import { and, asc, count, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import {
	contributorSubmission,
	maintainerSubmission,
	memberProfile,
	mentorSubmission,
	nonPrContribution,
	user,
} from '@/db/schema'
import { FORM_KEYS } from '@/util/adminForms'
import type { FormKey, FormValues } from '@/data/forms'

/**
 * Cross-user reads for the admin dashboard.
 *
 * Deliberately separate from util/data.ts: every function there is scoped to a
 * single `userId` and to `currentYear`, and that narrowness is the safety
 * property -- a member-facing route cannot accidentally reach an unscoped
 * query. Everything here is unscoped by design, so it must only ever be called
 * behind requireAdmin().
 */

const TABLES = {
	contributors: contributorSubmission,
	maintainers: maintainerSubmission,
	mentors: mentorSubmission,
	nonPrContributions: nonPrContribution,
} satisfies Record<FormKey, unknown>

/**
 * One list row. Profile columns are read from `member_profile` and `user`
 * rather than from the jsonb: formApiHandler passes the whole payload to
 * saveSubmission, so profile keys are also copied into `responses`, but that
 * copy is a snapshot from submit time and goes stale when someone edits their
 * profile later.
 */
export type AdminSubmissionRow = {
	id: string
	userId: string
	year: number
	responses: FormValues
	createdAt: string
	agreedToCocAt: string | null
	name: string | null
	githubUsername: string | null
	email: string | null
	preferredTimeZone: string | null
	pronouns: string | null
	isMember: boolean | null
	allowSocialSharing: boolean | null
	image: string | null
}

export async function listSubmissions(
	formKey: FormKey,
	year: number
): Promise<AdminSubmissionRow[]> {
	const table = TABLES[formKey]

	const rows = await db
		.select({
			id: table.id,
			userId: table.userId,
			year: table.year,
			responses: table.responses,
			createdAt: table.createdAt,
			agreedToCocAt: table.agreedToCocAt,
			userName: user.name,
			userEmail: user.email,
			userGithubLogin: user.githubLogin,
			userImage: user.image,
			profileName: memberProfile.name,
			profileEmail: memberProfile.contactEmail,
			profileGithubUsername: memberProfile.githubUsername,
			preferredTimeZone: memberProfile.preferredTimeZone,
			pronouns: memberProfile.pronouns,
			isMember: memberProfile.isMember,
			allowSocialSharing: memberProfile.allowSocialSharing,
		})
		.from(table)
		.leftJoin(user, eq(table.userId, user.id))
		.leftJoin(memberProfile, eq(table.userId, memberProfile.userId))
		.where(eq(table.year, year))
		.orderBy(asc(table.createdAt))

	return rows.map((row) => ({
		id: row.id,
		userId: row.userId,
		year: row.year,
		responses: row.responses,
		createdAt: row.createdAt.toISOString(),
		agreedToCocAt: row.agreedToCocAt?.toISOString() ?? null,
		name: row.profileName ?? row.userName ?? null,
		githubUsername: row.profileGithubUsername ?? row.userGithubLogin ?? null,
		email: row.profileEmail ?? row.userEmail ?? null,
		preferredTimeZone: row.preferredTimeZone,
		pronouns: row.pronouns,
		isMember: row.isMember,
		allowSocialSharing: row.allowSocialSharing,
		image: row.userImage ?? null,
	}))
}

export type YearCounts = { year: number } & Record<FormKey, number>

/**
 * Row counts per table per year. Feeds the overview stat cards, the "By year"
 * table, the tab badges, and the year dropdown -- the list of years comes from
 * the data rather than a hardcoded range, so a year with no rows never appears
 * and an unexpected one is not hidden.
 */
export async function countsByYear(): Promise<YearCounts[]> {
	const perForm = await Promise.all(
		FORM_KEYS.map(async (formKey) => {
			const table = TABLES[formKey]

			const rows = await db
				.select({ year: table.year, total: count() })
				.from(table)
				.groupBy(table.year)

			return { formKey, rows }
		})
	)

	const byYear = new Map<number, YearCounts>()

	const blank = (year: number): YearCounts => ({
		year,
		contributors: 0,
		maintainers: 0,
		mentors: 0,
		nonPrContributions: 0,
	})

	for (const { formKey, rows } of perForm) {
		for (const row of rows) {
			const entry = byYear.get(row.year) ?? blank(row.year)
			entry[formKey] = Number(row.total)
			byYear.set(row.year, entry)
		}
	}

	return [...byYear.values()].sort((a, b) => b.year - a.year)
}

export type AdminSubmitter = {
	userId: string
	name: string | null
	githubUsername: string | null
	email: string | null
	contactEmail: string | null
	twitterUsername: string | null
	preferredTimeZone: string | null
	pronouns: string | null
	isMember: boolean | null
	allowSocialSharing: boolean | null
	image: string | null
	hasProfile: boolean
}

export type AdminSubmission = {
	id: string
	responses: FormValues
	createdAt: string
	agreedToCocAt: string | null
}

export type AdminSubmitterDetail = {
	submitter: AdminSubmitter
	year: number
	submissions: Record<FormKey, AdminSubmission[]>
}

export async function getSubmitter(
	userId: string,
	year: number
): Promise<AdminSubmitterDetail | null> {
	const [row] = await db
		.select({
			userId: user.id,
			userName: user.name,
			userEmail: user.email,
			userGithubLogin: user.githubLogin,
			userTwitter: user.twitterUsername,
			userImage: user.image,
			profileId: memberProfile.id,
			profileName: memberProfile.name,
			contactEmail: memberProfile.contactEmail,
			profileGithubUsername: memberProfile.githubUsername,
			profileTwitter: memberProfile.twitterUsername,
			preferredTimeZone: memberProfile.preferredTimeZone,
			pronouns: memberProfile.pronouns,
			isMember: memberProfile.isMember,
			allowSocialSharing: memberProfile.allowSocialSharing,
		})
		.from(user)
		.leftJoin(memberProfile, eq(memberProfile.userId, user.id))
		.where(eq(user.id, userId))
		.limit(1)

	if (!row) return null

	const entries = await Promise.all(
		FORM_KEYS.map(async (formKey) => {
			const table = TABLES[formKey]

			const rows = await db
				.select({
					id: table.id,
					responses: table.responses,
					createdAt: table.createdAt,
					agreedToCocAt: table.agreedToCocAt,
				})
				.from(table)
				.where(and(eq(table.userId, userId), eq(table.year, year)))
				.orderBy(desc(table.createdAt))

			return [
				formKey,
				rows.map((submission) => ({
					id: submission.id,
					responses: submission.responses,
					createdAt: submission.createdAt.toISOString(),
					agreedToCocAt: submission.agreedToCocAt?.toISOString() ?? null,
				})),
			] as const
		})
	)

	return {
		submitter: {
			userId: row.userId,
			name: row.profileName ?? row.userName ?? null,
			githubUsername: row.profileGithubUsername ?? row.userGithubLogin ?? null,
			email: row.userEmail ?? null,
			contactEmail: row.contactEmail ?? null,
			twitterUsername: row.profileTwitter ?? row.userTwitter ?? null,
			preferredTimeZone: row.preferredTimeZone,
			pronouns: row.pronouns,
			isMember: row.isMember,
			allowSocialSharing: row.allowSocialSharing,
			image: row.userImage ?? null,
			hasProfile: row.profileId !== null,
		},
		year,
		submissions: Object.fromEntries(entries) as Record<
			FormKey,
			AdminSubmission[]
		>,
	}
}
