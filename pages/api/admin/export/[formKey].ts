import { listSubmissions } from '@/util/admin'
import { isFormKey } from '@/util/adminForms'
import { csvFilename, submissionsToCsv } from '@/util/adminCsv'
import { requireAdmin, requireGet } from '@/util/requireAdmin'
import { parseYearParam } from '@/util/adminYear'
import { currentYear } from '@/util/globals'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * The CSV export, reached by a plain link from the list page so the browser
 * sends the session cookie and handles the download itself.
 *
 * Reuses listSubmissions, so the file and the grid cannot drift: this is
 * everything for one form and year, not the page currently on screen.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (!(await requireAdmin(req, res))) return
	if (!requireGet(req, res)) return

	const { formKey } = req.query

	if (!isFormKey(formKey)) {
		res.status(404).send({ success: false, message: 'Unknown form.' })
		return
	}

	const year = parseYearParam(req.query.year, currentYear)
	const rows = await listSubmissions(formKey, year)

	res.setHeader('Content-Type', 'text/csv; charset=utf-8')
	res.setHeader(
		'Content-Disposition',
		`attachment; filename="${csvFilename(formKey, year)}"`
	)
	res.send(submissionsToCsv(formKey, rows))
}
