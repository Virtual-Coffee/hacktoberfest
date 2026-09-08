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
 * Admin reads. These hit /api/admin/*.
 *
 * Unlike the member-facing helpers above, these do not flatten every failure
 * to null. react-query settles a null as success-with-no-data, and an admin
 * page cannot tell that apart from an empty table -- so a failure rendered as
 * "No submissions yet" or "Not found", which is a lie about someone else's
 * data. Three outcomes instead:
 *
 * - 403 throws AdminAccessError. Access was revoked mid-session; see
 *   components/admin/useAdminAccess.ts, which refetches the session so
 *   AdminGate can say so.
 * - 404 returns null. This is an answer, not a failure: no member matches that
 *   address. The pages still render their own "not found" copy for it.
 * - Anything else throws. The server or the network broke, and the page says
 *   that rather than inventing an empty result.
 */
export class AdminAccessError extends Error {
	constructor() {
		super('You do not have access to this content.')
		this.name = 'AdminAccessError'
	}
}

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
	if (response.status === 403) {
		throw new AdminAccessError()
	}
	if (response.status === 404) {
		return null
	}
	if (!response.ok) {
		throw new Error(`Admin request failed with ${response.status}`)
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
	if (response.status === 403) {
		throw new AdminAccessError()
	}
	if (response.status === 404) {
		return null
	}
	if (!response.ok) {
		throw new Error(`Admin request failed with ${response.status}`)
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
	if (response.status === 403) {
		throw new AdminAccessError()
	}
	if (response.status === 404) {
		return null
	}
	if (!response.ok) {
		throw new Error(`Admin request failed with ${response.status}`)
	}
	return response.json()
}
