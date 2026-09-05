import { fromNodeHeaders } from 'better-auth/node'
import { findSubmissions, saveSubmission } from '@/util/data'
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

				// Non-PR contributions carry no profile fields.
				const parsed = buildFormSchema('nonPrContributions', {
					includeProfile: false,
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
							'/non-pr-contributions?error=1&message=Please fill out all required fields.'
						)
					}
					return
				}

				const { agree: _agree, ...values } = parsed.data

				// Append-only: every submission is a separate contribution.
				const submission = await saveSubmission(
					userId,
					'nonPrContributions',
					values
				)

				if (req.headers.accept === 'application/json') {
					res.send({
						success: true,
						fields: submission.responses,
					})
				} else {
					res.redirect(303, '/non-pr-contributions-thanks')
				}

				break

			case 'GET':
				if (req.headers.accept !== 'application/json') {
					res.status(400).send({ message: 'Bad request' })
					return
				}

				const results = await findSubmissions(userId, 'nonPrContributions')

				res.send({
					success: true,
					results: results.map((result) => ({
						...result.responses,
						id: result.id,
						created_at: result.created_at,
					})),
				})

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
