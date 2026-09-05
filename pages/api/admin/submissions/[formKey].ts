import { listSubmissions } from '@/util/admin'
import { isFormKey } from '@/util/adminForms'
import { requireAdmin, requireGet } from '@/util/requireAdmin'
import { parseYearParam } from '@/util/adminYear'
import { currentYear } from '@/util/globals'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!(await requireAdmin(req, res))) return
	if (!requireGet(req, res)) return

	const { formKey } = req.query

	// Validated against the known form keys before it is used to pick a table.
	if (!isFormKey(formKey)) {
		res.status(404).send({ success: false, message: 'Unknown form.' })
		return
	}

	const year = parseYearParam(req.query.year, currentYear)

	res.send({
		success: true,
		formKey,
		year,
		submissions: await listSubmissions(formKey, year),
	})
}
