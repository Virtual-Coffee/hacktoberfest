import { useEffect } from 'react'
import { useSessionStatus } from '@/lib/auth-client'
import { AdminAccessError } from '@/util/api'

/**
 * Turns a revoked admin's 403 into the Not authorized screen.
 *
 * The client session still says `role: 'admin'` after requireAdmin re-checks
 * GitHub and demotes the row, because the session was read before that
 * happened -- so AdminGate keeps rendering the dashboard while every query
 * 403s. Refetching the session picks up the new role, and AdminGate then falls
 * through to the Not authorized branch it already has. No new UI.
 *
 * Pass the query error from each admin page. Returns true while access is
 * known to be gone, so the page can suppress its empty state -- otherwise it
 * would claim "no submissions" or "not found" in the moment before the
 * refetched session swaps the screen out.
 */
export default function useAdminAccess(error: unknown): boolean {
	const { refetch } = useSessionStatus()
	const revoked = error instanceof AdminAccessError

	useEffect(() => {
		if (revoked) {
			refetch()
		}
	}, [revoked, refetch])

	return revoked
}
