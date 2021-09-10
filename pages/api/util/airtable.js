import * as formData from '../../../data/forms'

var Airtable = require('airtable')
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
	'appGHm8ztVWug6UxH'
)

const TABLES = {
	contributors: 'hacktoberfest_contributor',
	maintainers: 'hacktoberfest_maintainer',
}

export async function findOrCreateUserAuthIdByGitHubAccount(githubAccount) {
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

export async function findOrCreateUserProfile(auth_id, githubAccount) {
	const results = await base('member_profiles')
		.select({
			filterByFormula: `{auth_id}='${auth_id}'`,
		})
		.firstPage()

	if (results && results.length) {
		const userRow = results[0]
		return userRow.fields
	} else {
		const created = await base('member_profiles').create({
			Name: githubAccount.name || githubAccount.login,
			member: [auth_id],
			// casting id as a string because i can't find any docs that promise user id will always be a number
			GitHubUsername: githubAccount.login,
			TwitterUsername: githubAccount.twitter_username,
			Email: githubAccount.email,
		})

		return created.fields
	}
}

export async function updateUserProfile(auth_id, profile_id, fields) {
	const profile = await base('member_profiles').find(profile_id)

	if (profile.get('auth_id')[0] !== auth_id) {
		throw new Error('Not authorized')
	}

	const results = await base('member_profiles').update(profile_id, {
		GitHubUsername: fields.GitHubUsername,
		TwitterUsername: fields.TwitterUsername,
		Name: fields.Name,
		Pronouns: fields.Pronouns,
		Email: fields.Email,
		IsMember: fields.IsMember,
		AllowSocialSharing: fields.AllowSocialSharing,
	})

	return results
}

export async function findFormResult(auth_id, formKey) {
	console.log({ auth_id, formKey, TABLES })
	const table = TABLES[formKey]
	if (!table) {
		throw new Error('no table')
	}
	const findResults = await base(table)
		.select({
			filterByFormula: `{auth_id}='${auth_id}'`,
		})
		.firstPage()

	if (findResults && findResults.length) {
		return findResults[0]
	}

	return null
}

export async function createOrUpdateForm(auth_id, formKey, fields) {
	const table = TABLES[formKey]
	if (!table) {
		throw new Error('no table')
	}

	const values = formData[formKey].reduce((vals, field) => {
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

	const previousResult = await findFormResult(auth_id, formKey)

	if (previousResult) {
		return await base(table).update(previousResult.id, values)
	} else {
		return await base(table).create({
			...values,
			member: [auth_id],
		})
	}
}
