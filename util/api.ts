import type { FormValues } from '@/data/forms'

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
