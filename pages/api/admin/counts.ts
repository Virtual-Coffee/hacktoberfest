import { countsByYear } from '@/util/admin'
import { requireAdmin, requireGet } from '@/util/requireAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!(await requireAdmin(req, res))) return
	if (!requireGet(req, res)) return

	res.send({ success: true, counts: await countsByYear() })
}
