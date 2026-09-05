import { fromNodeHeaders } from 'better-auth/node'
import { auth } from '@/lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

type Session = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

/**
 * The real admin boundary. The client-side gate in components/AdminGate.tsx is
 * a convenience -- this is what actually keeps other members' submissions off a
 * non-admin's wire.
 *
 * `role` rides on the session through user.additionalFields (lib/auth.ts), and
 * is `input: false` there, so it can only ever have been written server-side by
 * syncGitHubOrgRole. That means no extra query is needed to check it.
 *
 * Returns the session on success; on failure it has already sent the response
 * and returns null, so callers just `if (!session) return`.
 */
export async function requireAdmin(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<Session | null> {
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

	if (session.user.role !== 'admin') {
		res.status(403).send({
			success: false,
			message: 'You do not have access to this content.',
		})
		return null
	}

	return session
}

/** Every admin route is read-only. */
export function requireGet(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'GET') {
		res.status(405).send({ message: 'Requests method not allowed.' })
		return false
	}
	return true
}
