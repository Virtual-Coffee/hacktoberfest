import { getSubmitter } from '@/util/admin'
import { requireAdmin, requireGet } from '@/util/requireAdmin'
import { parseYearParam } from '@/util/adminYear'
import { currentYear } from '@/util/globals'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!(await requireAdmin(req, res))) return
	if (!requireGet(req, res)) return

	const { userId } = req.query

	if (typeof userId !== 'string' || !userId) {
		res.status(404).send({ success: false, message: 'Not found.' })
		return
	}

	const year = parseYearParam(req.query.year, currentYear)
	const detail = await getSubmitter(userId, year)

	if (!detail) {
		res.status(404).send({ success: false, message: 'Not found.' })
		return
	}

	res.send({ success: true, ...detail })
}
