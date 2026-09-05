import type { FormKey, FormValues } from '@/data/forms'
// Type-only, so it erases at compile time under isolatedModules: the server
// code in util/admin.ts (and the db client it pulls in) never reaches the
// browser bundle. Same reason lib/auth-client.ts imports `auth` as a type.
import type {
	AdminSubmissionRow,
	AdminSubmitterDetail,
	YearCounts,
} from '@/util/admin'

export type ProfileResponse = {
	success: true
	profile: FormValues
} | null

export async function getProfile(): Promise<ProfileResponse> {
	const response = await fetch('/api/profile', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

export type FormSubmissionResponse = {
	success: true
	fields: FormValues
} | null

export type NonPrContribution = FormValues & {
	id?: string
	RepoName?: string
	RepoUrl?: string
	created_at?: string
}

export type NonPrContributionsResponse = {
	success: true
	results: NonPrContribution[]
} | null

export async function getContributorSubmission(): Promise<FormSubmissionResponse> {
	const response = await fetch('/api/forms/contributors', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

export async function getMaintainersSubmission(): Promise<FormSubmissionResponse> {
	const response = await fetch('/api/forms/maintainers', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

export async function getMentorsSubmission(): Promise<FormSubmissionResponse> {
	const response = await fetch('/api/forms/mentors', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

export async function getNonPrContributions(): Promise<NonPrContributionsResponse> {
	const response = await fetch('/api/forms/nonPrContributions', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

/**
 * Admin reads. These hit /api/admin/*, which returns 403 to a non-admin -- the
 * `null` on !ok below is why the pages check for data rather than isError.
 */

export type AdminCountsResponse = {
	success: true
	counts: YearCounts[]
} | null

export async function getAdminCounts(): Promise<AdminCountsResponse> {
	const response = await fetch('/api/admin/counts', {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
	if (!response.ok) {
		return null
	}
	return response.json()
}

export type AdminSubmissionsResponse = {
	success: true
	formKey: FormKey
	year: number
	submissions: AdminSubmissionRow[]
} | null

export async function getAdminSubmissions(
	formKey: FormKey,
	year: number
): Promise<AdminSubmissionsResponse> {
	const response = await fetch(
		`/api/admin/submissions/${formKey}?year=${year}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		}
	)
	if (!response.ok) {
		return null
	}
	return response.json()
}

export type AdminSubmitterResponse =
	({ success: true } & AdminSubmitterDetail) | null

export async function getAdminSubmitter(
	userId: string,
	year: number
): Promise<AdminSubmitterResponse> {
	const response = await fetch(
		`/api/admin/users/${encodeURIComponent(userId)}?year=${year}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		}
	)
	if (!response.ok) {
		return null
	}
	return response.json()
}
