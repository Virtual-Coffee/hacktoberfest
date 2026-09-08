import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '@/lib/auth'
import { resyncGitHubOrgRole } from '@/lib/github'
import type { NextApiRequest, NextApiResponse } from 'next'

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

/**
 * How long a resolved role is trusted before it is checked against GitHub
 * again. Admin-team membership turns over, and the role is otherwise only
 * resolved at sign-in -- with rolling 7-day sessions, a removed member could
 * otherwise keep `admin` indefinitely.
 */
const ROLE_MAX_AGE_MS = 60 * 60 * 1000

const isStale = (syncedAt: Date | string | null | undefined) => {
	if (!syncedAt) return true

	const time = new Date(syncedAt).getTime()
	if (Number.isNaN(time)) return true

	return Date.now() - time > ROLE_MAX_AGE_MS
}

/**
 * The real admin boundary. The client-side gate in components/AdminGate.tsx is
 * a convenience -- this is what actually keeps other members' submissions off a
 * non-admin's wire.
 *
 * `role` and `orgRoleSyncedAt` ride on the session through
 * user.additionalFields (lib/auth.ts), and are `input: false` there, so they
 * can only ever have been written server-side. That means the check, and the
 * staleness test below it, cost no extra query.
 *
 * Returns the session on success; on failure it has already sent the response
 * and returns null, so callers just `if (!session) return`.
 *
 * Also marks the response uncacheable. Everything behind this boundary is
 * other members' personal data on a stable, guessable URL, and Next sets no
 * cache header of its own on a pages API route -- so without this the CSV
 * export in particular lands in the browser's disk cache and stays there for
 * the next person at that machine.
 */
export async function requireAdmin(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<Session | null> {
	res.setHeader(
		'Cache-Control',
		'private, no-cache, no-store, max-age=0, must-revalidate'
	)

	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	})

	if (!session) {
		res.status(401).send({
			success: false,
			message: 'You must be signed in to view this content.',
		})
		return null
	}

	let role = session.user.role

	// Only revalidate an existing admin. Revocation is the direction that has
	// to be automatic; promotion is not, and re-checking everyone would let any
	// signed-in member trigger GitHub calls just by hitting an admin URL. A
	// newly added team member signs out and back in, which re-runs the sync.
	if (role === 'admin' && isStale(session.user.orgRoleSyncedAt)) {
		// null means GitHub could not be reached. Fall back to the stored role
		// rather than locking admins out during an outage -- the same asymmetry
		// syncGitHubOrgRole applies.
		role = (await resyncGitHubOrgRole(session.user.id)) ?? role
	}

	if (role !== 'admin') {
		res.status(403).send({
			success: false,
			message: 'You do not have access to this content.',
		})
		return null
	}

	return session
}

/**
 * Every admin route is read-only.
 *
 * Runs before requireAdmin, so an unsupported method is turned away on the
 * method alone. The other order let a stale admin's POST reach the GitHub
 * resync above -- several requests on a 2-second timeout each -- before the
 * 405 it was always going to get, and a failed resync leaves the timestamp
 * stale, so the next POST pays it again.
 */
export function requireGet(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(405).send({ message: 'Requests method not allowed.' })
		return false
	}
	return true
}
