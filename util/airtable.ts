import Airtable from 'airtable'
import * as formData from '@/data/forms'
import type { FormKey, FormValues } from '@/data/forms'
import { currentYear } from './globals'
import type { GitHubUser, MemberProfile } from '@/types/next-auth'

type FieldSet = Airtable.FieldSet
type AirtableRecord = Airtable.Record<FieldSet>
type MemberProfileFields = FieldSet & MemberProfile

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	'appGHm8ztVWug6UxH'
)

const TABLES: Record<FormKey, string> = {
	contributors: 'hacktoberfest_contributor',
	maintainers: 'hacktoberfest_maintainer',
	mentors: 'hacktoberfest_mentor',
	nonPrContributions: 'hacktoberfest_contributions',
}

export async function findOrCreateUserAuthIdByGitHubAccount(
	githubAccount: GitHubUser
): Promise<string> {
	const results = await base('members_auth')
		.select({
			filterByFormula: `{GitHub ID}='${githubAccount.id}'`,
		})
		.firstPage()

	if (results && results.length) {
		const userRow = results[0]
		return userRow.id
	} else {
		const created = await base('members_auth').create({
			github: githubAccount.login,
			// casting id as a string because i can't find any docs that promise user id will always be a number
			'GitHub ID': `${githubAccount.id}`,
		})

		return created.id
	}
}

export async function findOrCreateUserProfile(
	auth_id: string,
	githubAccount: GitHubUser
): Promise<MemberProfileFields> {
	const results = await base('member_profiles')
		.select({
			filterByFormula: `{auth_id}='${auth_id}'`,
		})
		.firstPage()

	if (results && results.length) {
		const userRow = results[0]
		return userRow.fields as MemberProfileFields
	} else {
		const created = await base('member_profiles').create({
			Name: githubAccount.name || githubAccount.login,
			member: [auth_id],
			// casting id as a string because i can't find any docs that promise user id will always be a number
			GitHubUsername: githubAccount.login,
			TwitterUsername: githubAccount.twitter_username ?? undefined,
			Email: githubAccount.email ?? undefined,
		})

		return created.fields as MemberProfileFields
	}
}

export async function updateUserProfile(
	auth_id: string,
	profile_id: string,
	fields: FormValues
): Promise<AirtableRecord> {
	const profile = await base('member_profiles').find(profile_id)

	const authIds = profile.get('auth_id')
	if (!Array.isArray(authIds) || authIds[0] !== auth_id) {
		throw new Error('Not authorized')
	}

	const results = await base('member_profiles').update(profile_id, {
		GitHubUsername: fields.GitHubUsername,
		PreferredTimeZone: fields.PreferredTimeZone,
		TwitterUsername: fields.TwitterUsername,
		Name: fields.Name,
		Pronouns: fields.Pronouns,
		Email: fields.Email,
		IsMember: fields.IsMember,
		AllowSocialSharing: fields.AllowSocialSharing,
	})

	return results
}

export async function findFormResult(
	auth_id: string,
	formKey: FormKey
): Promise<AirtableRecord | null> {
	const table = TABLES[formKey]
	if (!table) {
		throw new Error('no table')
	}
	const findResults = await base(table)
		.select({
			filterByFormula: `AND({auth_id}='${auth_id}',Year=${currentYear})`,
		})
		.firstPage()

	if (findResults && findResults.length) {
		return findResults[0]
	}

	return null
}

export async function findFormResults(
	auth_id: string,
	formKey: FormKey
): Promise<ReadonlyArray<AirtableRecord> | null> {
	const table = TABLES[formKey]
	if (!table) {
		throw new Error('no table')
	}
	const findResults = await base(table)
		.select({
			filterByFormula: `AND({auth_id}='${auth_id}',Year=${currentYear})`,
		})
		.all()

	if (findResults) {
		return findResults
	}

	return null
}

export async function createOrUpdateForm(
	auth_id: string,
	formKey: FormKey,
	fields: FormValues
): Promise<AirtableRecord> {
	const table = TABLES[formKey]
	if (!table) {
		throw new Error('no table')
	}

	const values = formData.forms[formKey].reduce<FormValues>((vals, field) => {
		switch (field.type) {
			case 'Text':
			case 'Single select':
			case 'Multiple select':
			case 'Long text':
				return {
					...vals,
					[field.name]: fields[field.name],
					...(field.otherFieldName
						? { [field.otherFieldName]: fields[field.otherFieldName] }
						: {}),
				}

			case 'Checkbox':
				const parsedVal = `${fields[field.name]}`.toLowerCase()
				return {
					...vals,
					[field.name]:
						parsedVal === 'on' || parsedVal === 'yes' || parsedVal === 'true',
				}

			default:
				return vals
		}
	}, {})

	let previousResult: AirtableRecord | null = null

	if (formKey !== 'nonPrContributions') {
		previousResult = await findFormResult(auth_id, formKey)
	}

	if (previousResult) {
		return await base(table).update(previousResult.id, values)
	} else {
		return await base(table).create({
			...values,
			Year: `${currentYear}`,
			member: [auth_id],
		})
	}
}
