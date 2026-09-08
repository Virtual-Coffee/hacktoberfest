/**
 * Shared by the admin pages and the admin API routes, and kept out of
 * util/requireAdmin.ts so the client can import it without pulling in
 * lib/auth (and the GitHub client secret with it).
 *
 * `?year=` is user input on an otherwise unbounded query, so anything that is
 * not a plausible four-digit year falls back rather than reaching the database.
 */
export function parseYearParam(
	value: string | string[] | undefined,
	fallback: number
): number {
	const raw = Array.isArray(value) ? value[0] : value
	if (!raw) return fallback

	const year = Number(raw)
	if (!Number.isInteger(year) || year < 2000 || year > 2100) return fallback

	return year
}
