import { fromNodeHeaders } from 'better-auth/node'
import { findOrCreateProfile, profileToFormValues } from '@/util/data'
import { auth } from '@/lib/auth'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * The signed-in member's profile, in the field names data/forms.tsx uses.
 *
 * This is a separate request rather than part of the session on purpose. The
 * old next-auth `session` callback fetched the profile from Airtable on every
 * session read, putting it in the hot path of every authenticated request.
 * Better Auth's customSession plugin would reintroduce that, since it is
 * evaluated per fetch and bypasses session caching -- so the profile is a
 * cached query used only by the pages that render profile fields.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	})

	if (!session) {
		res.status(401).send({ success: false, message: 'You must be signed in.' })
		return
	}

	if (req.method !== 'GET') {
		res.status(405).send({ message: 'Requests method not allowed.' })
		return
	}

	const profile = await findOrCreateProfile(session.user.id, {
		name: session.user.name,
		email: session.user.email,
		githubUsername: session.user.githubLogin,
		twitterUsername: session.user.twitterUsername,
	})

	res.send({ success: true, profile: profileToFormValues(profile) })
}
