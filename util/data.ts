import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import {
	contributorSubmission,
	maintainerSubmission,
	memberProfile,
	mentorSubmission,
	nonPrContribution,
} from '@/db/schema'
import type { MemberProfileRow } from '@/db/schema'
import type { FormKey, FormValues } from '@/data/forms'
import { currentYear } from './globals'

const TABLES = {
	contributors: contributorSubmission,
	maintainers: maintainerSubmission,
	mentors: mentorSubmission,
	nonPrContributions: nonPrContribution,
} satisfies Record<FormKey, unknown>

/**
 * The three role forms hold one row per member per year, so a save is an
 * upsert. Non-PR contributions are append-only: the form asks members to
 * submit one entry per contribution and the dashboard counts the rows.
 */
const UPSERT_PER_YEAR: Record<FormKey, boolean> = {
	contributors: true,
	maintainers: true,
	mentors: true,
	nonPrContributions: false,
}

/** 'Yes'/'No' is what the Single select fields in data/forms.tsx render. */
const yesNo = (value: boolean | null) =>
	value === null ? undefined : value ? 'Yes' : 'No'

const toBoolean = (value: FormValues[string]) =>
	value === undefined ? undefined : `${value}`.toLowerCase() === 'yes'

/**
 * Projects a profile row onto the field names data/forms.tsx uses.
 *
 * IsMember and AllowSocialSharing are stored as real booleans but render
 * through the Single select branch, which only understands strings -- hence
 * the Yes/No mapping. (Under Airtable these were typed boolean while the form
 * sent strings, which is why those two radios never pre-selected on a return
 * visit.)
 */
export function profileToFormValues(row: MemberProfileRow): FormValues {
	return {
		Name: row.name ?? undefined,
		Email: row.contactEmail ?? undefined,
		PreferredTimeZone: row.preferredTimeZone ?? undefined,
		GitHubUsername: row.githubUsername ?? undefined,
		TwitterUsername: row.twitterUsername ?? undefined,
		Pronouns: row.pronouns ?? undefined,
		IsMember: yesNo(row.isMember),
		AllowSocialSharing: yesNo(row.allowSocialSharing),
	}
}

export type ProfileSeed = {
	name?: string | null
	email?: string | null
	githubUsername?: string | null
	twitterUsername?: string | null
}

export async function findOrCreateProfile(
	userId: string,
	seed: ProfileSeed = {}
): Promise<MemberProfileRow> {
	const [existing] = await db
		.select()
		.from(memberProfile)
		.where(eq(memberProfile.userId, userId))
		.limit(1)

	if (existing) return existing

	const [created] = await db
		.insert(memberProfile)
		.values({
			userId,
			name: seed.name ?? null,
			contactEmail: seed.email ?? null,
			githubUsername: seed.githubUsername ?? null,
			twitterUsername: seed.twitterUsername ?? null,
		})
		// Two concurrent first-time requests would otherwise race on the
		// user_id unique constraint.
		.onConflictDoNothing({ target: memberProfile.userId })
		.returning()

	if (created) return created

	const [raced] = await db
		.select()
		.from(memberProfile)
		.where(eq(memberProfile.userId, userId))
		.limit(1)

	return raced!
}

/**
 * Ownership is structural here: `userId` is the unique key, so there is no
 * caller-supplied record id to tamper with. The Airtable version took a
 * profile_id, re-read the record and threw 'Not authorized' on mismatch.
 */
export async function updateProfile(
	userId: string,
	values: FormValues
): Promise<MemberProfileRow> {
	const [updated] = await db
		.update(memberProfile)
		.set({
			name: (values.Name as string | undefined) ?? null,
			contactEmail: (values.Email as string | undefined) ?? null,
			preferredTimeZone:
				(values.PreferredTimeZone as string | undefined) ?? null,
			githubUsername: (values.GitHubUsername as string | undefined) ?? null,
			twitterUsername: (values.TwitterUsername as string | undefined) ?? null,
			pronouns: (values.Pronouns as string | undefined) ?? null,
			isMember: toBoolean(values.IsMember) ?? null,
			allowSocialSharing: toBoolean(values.AllowSocialSharing) ?? null,
		})
		.where(eq(memberProfile.userId, userId))
		.returning()

	return updated!
}

export type SubmissionResult = {
	id: string
	responses: FormValues
	created_at: string
}

const toResult = (row: {
	id: string
	responses: FormValues
	createdAt: Date
}): SubmissionResult => ({
	id: row.id,
	responses: row.responses,
	created_at: row.createdAt.toISOString(),
})

export async function findSubmission(
	userId: string,
	formKey: FormKey
): Promise<SubmissionResult | null> {
	const table = TABLES[formKey]

	const [row] = await db
		.select()
		.from(table)
		.where(and(eq(table.userId, userId), eq(table.year, currentYear)))
		.limit(1)

	return row ? toResult(row) : null
}

export async function findSubmissions(
	userId: string,
	formKey: FormKey
): Promise<SubmissionResult[]> {
	const table = TABLES[formKey]

	const rows = await db
		.select()
		.from(table)
		.where(and(eq(table.userId, userId), eq(table.year, currentYear)))
		.orderBy(asc(table.createdAt))

	return rows.map(toResult)
}

/**
 * Atomic upsert against the (user_id, year) unique index. The Airtable version
 * read then wrote, leaving a window where a double submit created two rows.
 */
export async function saveSubmission(
	userId: string,
	formKey: FormKey,
	values: FormValues
): Promise<SubmissionResult> {
	const table = TABLES[formKey]
	const row = {
		userId,
		year: currentYear,
		responses: values,
		agreedToCocAt: new Date(),
	}

	if (!UPSERT_PER_YEAR[formKey]) {
		const [created] = await db.insert(table).values(row).returning()
		return toResult(created!)
	}

	const [saved] = await db
		.insert(table)
		.values(row)
		.onConflictDoUpdate({
			target: [table.userId, table.year],
			set: { responses: values, agreedToCocAt: row.agreedToCocAt },
		})
		.returning()

	return toResult(saved!)
}
