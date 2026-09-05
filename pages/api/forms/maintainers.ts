import { fromNodeHeaders } from 'better-auth/node'
import {
	findSubmission,
	profileToFormValues,
	saveSubmission,
	updateProfile,
} from '@/util/data'
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
					...formData.profile
						.filter((field) => !!field.required)
						.map((field) => field.name),
					...formData.maintainers
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
							'/maintainers?error=1&message=Please fill out all required fields.'
						)
					}
					return
				}

				const profile = await updateProfile(userId, data)

				const submission = await saveSubmission(userId, 'maintainers', data)

				if (req.headers.accept === 'application/json') {
					res.send({
						success: true,
						fields: {
							...profileToFormValues(profile),
							...submission.responses,
						},
					})
				} else {
					res.redirect(303, '/maintainers-thanks')
				}

				break

			case 'GET':
				if (req.headers.accept !== 'application/json') {
					res.status(400).send({ message: 'Bad request' })
					return
				}

				const result = await findSubmission(userId, 'maintainers')

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
