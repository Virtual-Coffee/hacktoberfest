import { Parser } from '@json2csv/plainjs'
import { string as stringFormatter } from '@json2csv/formatters'
import {
	formatBoolean,
	formatDate,
	formatText,
	formatValue,
	responseFields,
} from '@/util/adminFields'
import type { AdminSubmissionRow } from '@/util/admin'
import type { FormKey } from '@/data/forms'

const quote = stringFormatter()

/**
 * Excel and Sheets execute a cell beginning `=`, `+`, `-`, `@`, tab or carriage
 * return as a formula, and every value here is text a submitter typed into a
 * public form. Prefixing with an apostrophe makes the cell inert.
 *
 * Deliberately NOT @json2csv's `stringExcel` formatter, which is the documented
 * answer to this: that wraps *every* string as `="value"`, which is safe in
 * Excel but renders literally as `="Ana Delgado"` in Sheets, pandas and
 * anything else that reads a CSV. This touches only the risky values.
 */
const FORMULA_LEAD = /^[=+\-@\t\r]/

const csvSafeString = (value: string) =>
	quote(FORMULA_LEAD.test(value) ? `'${value}` : value)

/**
 * Columns match the on-screen grid exactly -- same order, same `—` for a field
 * nobody answered, same comma-joining of Multiple select arrays -- because both
 * are generated from responseFields(). components/admin/columns.tsx is the
 * other half of that; they must be changed together.
 */
function buildFields(formKey: FormKey) {
	return [
		{ label: 'Name', value: (row: AdminSubmissionRow) => formatText(row.name) },
		{
			label: 'GitHub',
			value: (row: AdminSubmissionRow) => formatText(row.githubUsername),
		},
		{
			label: 'Email',
			value: (row: AdminSubmissionRow) => formatText(row.email),
		},
		{
			label: 'Time zone',
			value: (row: AdminSubmissionRow) => formatText(row.preferredTimeZone),
		},
		{
			label: 'Pronouns',
			value: (row: AdminSubmissionRow) => formatText(row.pronouns),
		},
		{
			label: 'Member',
			value: (row: AdminSubmissionRow) => formatBoolean(row.isMember),
		},
		...responseFields(formKey).map((field) => ({
			label: field.label,
			value: (row: AdminSubmissionRow) => formatValue(row.responses[field.key]),
		})),
		{
			label: 'Submitted',
			value: (row: AdminSubmissionRow) => formatDate(row.createdAt),
		},
	]
}

export function submissionsToCsv(
	formKey: FormKey,
	rows: AdminSubmissionRow[]
): string {
	const parser = new Parser<AdminSubmissionRow, AdminSubmissionRow>({
		fields: buildFields(formKey),
		// Excel reads a UTF-8 CSV as the system codepage without it, which
		// mangles any non-ASCII name.
		withBOM: true,
		formatters: { string: csvSafeString },
	})

	return parser.parse(rows)
}

export const csvFilename = (formKey: FormKey, year: number) =>
	`${formKey}-${year}.csv`
