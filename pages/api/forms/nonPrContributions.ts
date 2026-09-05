import { fromNodeHeaders } from 'better-auth/node'
import { findSubmissions, saveSubmission } from '@/util/data'
import * as formData from '@/data/forms'
import { auth } from '@/lib/auth'
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

				const errors: { field: string; message: string }[] = []

				const requiredFields = [
					'agree',
					...formData.nonPrContributions
						.filter((field) => !!field.required)
						.map((field) => field.name),
				]

				requiredFields.forEach((field) => {
					if (!data[field]) {
						errors.push({
							field,
							message: `${field} is required.`,
						})
					}
				})

				if (errors.length) {
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

				// Append-only: every submission is a separate contribution.
				const submission = await saveSubmission(
					userId,
					'nonPrContributions',
					data
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
		res.send({
			error: 'You must be sign in to view the protected content on this page.',
		})
	}
}
