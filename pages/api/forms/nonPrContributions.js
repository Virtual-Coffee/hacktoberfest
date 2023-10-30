import { getToken } from 'next-auth/jwt'
import { createOrUpdateForm, findFormResults } from '../util/airtable'
import * as formData from '../../../data/forms'
import { nextAuthOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'

const secret = process.env.SECRET

export default async (req, res) => {
	const session = await getServerSession(req, res, nextAuthOptions)
	const token = await getToken({ req, secret })

	if (session && token?.auth_id) {
		switch (req.method) {
			case 'POST':
				const data =
					typeof req.body === 'string' ? JSON.parse(req.body) : req.body

				const errors = []

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

				const formRowResult = await createOrUpdateForm(
					token.auth_id,
					'nonPrContributions',
					data
				)

				// console.log(formRowResult)

				if (req.headers.accept === 'application/json') {
					res.send({
						success: true,
						fields: {
							...formRowResult.fields,
						},
					})
				} else {
					res.redirect(303, '/non-pr-contributions-thanks')
				}

				break

			case 'GET':
				if (!req.headers.accept === 'application/json') {
					res.status(400).send({ message: 'Bad request' })
					return
				}

				const results = await findFormResults(
					token.auth_id,
					'nonPrContributions'
				)

				if (results) {
					res.send({
						success: true,
						results: results.map((r) => r.fields),
					})
				} else {
					res.status(404).send({ success: false, message: 'Not found.' })
				}

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
