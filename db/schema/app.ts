import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core'
import type { FormValues } from '@/data/forms'
import { user } from './auth'

/**
 * Replaces Airtable's `member_profiles`.
 *
 * `contact_email` is deliberately not `user.email`. `user.email` is the
 * identity GitHub gave us and carries a unique constraint; `contact_email` is
 * a user-editable form field, and two members are allowed to share one (a
 * team address, say). Writing the form's Email into `user.email` would both
 * risk a unique violation and mutate the auth identity behind the user's back.
 */
export const memberProfile = pgTable('member_profile', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text('name'),
	contactEmail: text('contact_email'),
	preferredTimeZone: text('preferred_time_zone'),
	githubUsername: text('github_username'),
	twitterUsername: text('twitter_username'),
	pronouns: text('pronouns'),
	isMember: boolean('is_member'),
	allowSocialSharing: boolean('allow_social_sharing'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

const submissionColumns = {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	year: integer('year').notNull(),
	/**
	 * The whole form payload, keyed by the `name` values in data/forms.tsx.
	 * Validated by the Zod schema built from those same definitions before it
	 * lands here -- this $type is a compile-time assertion, not a guarantee.
	 */
	responses: jsonb('responses').$type<FormValues>().notNull().default({}),
	/** When the submitter last ticked the Code of Conduct checkbox. */
	agreedToCocAt: timestamp('agreed_to_coc_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
}

// One row per member per year. The unique index is what lets saveSubmission()
// use onConflictDoUpdate as an atomic upsert, replacing the read-then-write
// race in Airtable's createOrUpdateForm().
export const contributorSubmission = pgTable(
	'contributor_submission',
	submissionColumns,
	(table) => [
		uniqueIndex('contributor_submission_user_year').on(
			table.userId,
			table.year
		),
	]
)

export const maintainerSubmission = pgTable(
	'maintainer_submission',
	submissionColumns,
	(table) => [
		uniqueIndex('maintainer_submission_user_year').on(table.userId, table.year),
	]
)

export const mentorSubmission = pgTable(
	'mentor_submission',
	submissionColumns,
	(table) => [
		uniqueIndex('mentor_submission_user_year').on(table.userId, table.year),
	]
)

/**
 * Append-only, and deliberately without a unique index: the form tells members
 * to submit a separate entry per contribution, and the dashboard renders the
 * row count. A uniqueness constraint here would make every submission after
 * the first silently overwrite the previous one. A plain index supports the
 * list-by-user-and-year read.
 */
export const nonPrContribution = pgTable(
	'non_pr_contribution',
	submissionColumns,
	(table) => [
		index('non_pr_contribution_user_year').on(table.userId, table.year),
	]
)

export type MemberProfileRow = typeof memberProfile.$inferSelect
export type SubmissionRow = typeof contributorSubmission.$inferSelect
