import { useMemo } from 'react'

export function useNewSubmissionsClosed() {
	return useMemo(() => {
		const submissionsClosed = new Date(2022, 10, 2)
		return Date.now() > submissionsClosed.getTime()
	}, [])
}
