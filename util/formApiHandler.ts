import { fromNodeHeaders } from 'better-auth/node'
import {
	findSubmission,
	findSubmissions,
	profileToFormValues,
	saveSubmission,
	updateProfile,
} from '@/util/data'
import { auth } from '@/lib/auth'
import { buildFormSchema, zodIssuesToFieldErrors } from '@/util/formSchema'
import type { FormKey } from '@/data/forms'
import type { NextApiRequest, NextApiResponse } from 'next'

type FormApiOptions = {
	formKey: FormKey
	/** Page to redirect to for non-JSON submissions, without the leading slash. */
	page: string
	/**
	 * Whether the form carries the shared profile fields. Only non-PR
	 * contributions do not.
	 */
	includeProfile: boolean
	/**
	 * Append-only forms return every row from GET; the rest return the single
	 * row for the current year.
	 */
	multiple: boolean
}

const wantsJson = (req: NextApiRequest) =>
	req.headers.accept === 'application/json'

export function createFormApiHandler({
	formKey,
	page,
	includeProfile,
	multiple,
}: FormApiOptions) {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		})

		if (!session) {
			res.status(401).send({
				success: false,
				message: 'You must be signed in to view this content.',
			})
			return
		}

		const userId = session.user.id

		switch (req.method) {
			case 'POST': {
				const data =
					typeof req.body === 'string' ? JSON.parse(req.body) : req.body

				const parsed = buildFormSchema(formKey, {
					includeProfile,
				}).safeParse(data)

				if (!parsed.success) {
					if (wantsJson(req)) {
						res.status(409).send({
							success: false,
							message: 'Please fill out all required fields.',
							errors: zodIssuesToFieldErrors(parsed.error),
						})
					} else {
						res.redirect(
							303,
							`/${page}?error=1&message=Please fill out all required fields.`
						)
					}
					return
				}

				// `agree` is consent, not a response: saveSubmission records it as
				// agreedToCocAt rather than storing it among the answers.
				const { agree: _agree, ...values } = parsed.data

				const profile = includeProfile
					? await updateProfile(userId, values)
					: null

				const submission = await saveSubmission(userId, formKey, values)

				if (wantsJson(req)) {
					res.send({
						success: true,
						fields: {
							...(profile ? profileToFormValues(profile) : {}),
							...submission.responses,
						},
					})
				} else {
					res.redirect(303, `/${page}-thanks`)
				}

				return
			}

			case 'GET': {
				if (!wantsJson(req)) {
					res.status(400).send({ message: 'Bad request' })
					return
				}

				if (multiple) {
					const results = await findSubmissions(userId, formKey)

					res.send({
						success: true,
						results: results.map((result) => ({
							...result.responses,
							id: result.id,
							created_at: result.created_at,
						})),
					})
					return
				}

				const result = await findSubmission(userId, formKey)

				if (result) {
					res.send({ success: true, fields: result.responses })
				} else {
					res.status(404).send({ success: false, message: 'Not found.' })
				}

				return
			}

			default:
				res.status(405).send({ message: 'Requests method not allowed.' })
		}
	}
}
