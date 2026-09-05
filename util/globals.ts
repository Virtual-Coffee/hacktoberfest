import { useMemo } from 'react'

// Must be a literal `process.env.NEXT_PUBLIC_X` member access: Next inlines
// these at build time by static substitution, which does not work through a
// computed `process.env[key]` lookup.
//
// NEXT_PUBLIC_ is required because `currentYear` is rendered by client
// components (pages/index.tsx, contributors, maintainers, non-pr-contributions)
// and read by `useNewSubmissionsClosed` below. The same inlined value is
// available server-side, so API routes and the data layer read the same
// constant the browser renders -- no serialization, no drift.
//
// Because it is inlined at build time, changing this on Netlify requires a
// rebuild, not just a redeploy of the existing build. It lives in
// netlify.toml under [build.environment] so that changing it is a commit.
const configuredYear = Number(process.env.NEXT_PUBLIC_HACKTOBERFEST_YEAR)

export const currentYear = Number.isInteger(configuredYear)
	? configuredYear
	: new Date().getFullYear()

export function useNewSubmissionsClosed() {
	return useMemo(() => {
		const submissionsClosed = new Date(currentYear, 10, 2)
		return Date.now() > submissionsClosed.getTime()
	}, [])
}
