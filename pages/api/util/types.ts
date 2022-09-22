export type Collaborator = {
	/**
	 * unique user id
	 */
	id: string
	/**
	 * user's email address
	 */
	email: string
	/**
	 * user's display name (optional, may be empty if the user hasn't created an account)
	 */
	name: string
}

export type AirtableMembersAuthFieldSet = {
	/*
	 * Formula
	 * Computed value: {Name}.
	 */
	'Profile Name': number | string

	/*
	 * Created time
	 * The time the record was created in UTC, e.g. "2015-08-29T07:00:00.000Z".
	 */
	Created: string

	/*
	 * Formula
	 * Computed value: LAST_MODIFIED_TIME().
	 */
	'Last Modified': number | string

	/*Y
	 * Text
	 * A single line of text.
	 */
	github: string

	/*
	 * Link to another record
	 * Array of linked records IDs from the member_profiles table.
	 */
	member_profile: string[]

	/*
	 * Formula
	 * Computed value: RECORD_ID().
	 */
	id: number | string

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_contributor_2021 table.
	 */
	hacktoberfest_contributor_2021: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_repo_2021 table.
	 */
	hacktoberfest_repo_2021: string[]

	/*
	 * Created by
	 * Object providing details about the collaborator in this field.
	 */
	'Created By': Collaborator

	/*
	 * Last modified by
	 * Object providing details about the collaborator in this field.
	 */
	'Last Modified By': Collaborator

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_maintainer_2021 table.
	 */
	hacktoberfest_maintainer_2021: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_mentor_2021 table.
	 */
	hacktoberfest_mentor_2021: string[]

	/*
	 * Lookup
	 * Array of Name fields in linked member_profiles records.
	 */
	Name: string[]

	/*Y
	 * Text
	 * A single line of text.
	 */
	'GitHub ID': string

	/*
	 * Lookup
	 * Array of Email fields in linked member_profiles records.
	 */
	Email: string[]

	/*
	 * Lookup
	 * Array of Pronouns fields in linked member_profiles records.
	 */
	Pronouns: string[]

	/*
	 * Lookup
	 * Array of GitHubUsername fields in linked member_profiles records.
	 */
	GitHubUsername: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the member_articles table.
	 */
	member_articles: string[]

	/*
	 * Lookup
	 * Array of TwitterUsername fields in linked member_profiles records.
	 */
	TwitterUsername: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the Volunteers table.
	 */
	Volunteers: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_contributor table.
	 */
	hacktoberfest_contributor: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_repo table.
	 */
	hacktoberfest_repo: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_maintainer table.
	 */
	hacktoberfest_maintainer: string[]

	/*
	 * Link to another record
	 * Array of linked records IDs from the hacktoberfest_mentor table.
	 */
	hacktoberfest_mentor: string[]
}
