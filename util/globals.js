import { useMemo } from 'react'

export function useNewSubmissionsClosed() {
	return useMemo(() => {
		const submissionsClosed = new Date(2024, 10, 2)
		return Date.now() > submissionsClosed.getTime()
	}, [])
}
