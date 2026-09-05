import { fromNodeHeaders } from 'better-auth/node'
import {
	findSubmission,
	profileToFormValues,
	saveSubmission,
	updateProfile,
} from '@/util/data'
import { auth } from '@/lib/auth'
import { buildFormSchema, zodIssuesToFieldErrors } from '@/util/formSchema'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	})

	if (session) {
		const userId = session.user.id

		switch (req.method) {
			case 'POST':
				const data =
					typeof req.body === 'string' ? JSON.parse(req.body) : req.body

				const parsed = buildFormSchema('mentors', {
					includeProfile: true,
				}).safeParse(data)

				if (!parsed.success) {
					const errors = zodIssuesToFieldErrors(parsed.error)

					if (req.headers.accept === 'application/json') {
						res.status(409).send({
							success: false,
							message: 'Please fill out all required fields.',
							errors,
						})
					} else {
						res.redirect(
							303,
							'/mentors?error=1&message=Please fill out all required fields.'
						)
					}
					return
				}

				// `agree` is consent, not a response: saveSubmission records it
				// as agreedToCocAt rather than storing it among the answers.
				const { agree: _agree, ...values } = parsed.data

				const profile = await updateProfile(userId, values)

				const submission = await saveSubmission(userId, 'mentors', values)

				if (req.headers.accept === 'application/json') {
					res.send({
						success: true,
						fields: {
							...profileToFormValues(profile),
							...submission.responses,
						},
					})
				} else {
					res.redirect(303, '/mentors-thanks')
				}

				break

			case 'GET':
				if (req.headers.accept !== 'application/json') {
					res.status(400).send({ message: 'Bad request' })
					return
				}

				const result = await findSubmission(userId, 'mentors')

				if (result) {
					res.send({
						success: true,
						fields: result.responses,
					})
				} else {
					res.status(404).send({ success: false, message: 'Not found.' })
				}

				break
			default:
				res.status(405).send({ message: 'Requests method not allowed.' })
		}
	} else {
		// 401, not 200: util/api.ts only checks response.ok, so a 200 here made
		// an unauthenticated request indistinguishable from a successful one --
		// the dashboard rendered "Submitted!" for signed-out visitors.
		res.status(401).send({
			success: false,
			message: 'You must be signed in to view this content.',
		})
	}
}
