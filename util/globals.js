import { useMemo } from 'react'

export const currentYear = 2024

export function useNewSubmissionsClosed() {
	return useMemo(() => {
		const submissionsClosed = new Date(currentYear, 10, 2)
		return Date.now() > submissionsClosed.getTime()
	}, [])
}
