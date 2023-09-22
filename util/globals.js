import { useMemo } from 'react'

export function useNewSubmissionsClosed() {
	return useMemo(() => {
		const submissionsClosed = new Date(2023, 10, 2)
		return Date.now() > submissionsClosed.getTime()
	}, [])
}
