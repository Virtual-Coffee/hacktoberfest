import { forms } from '@/data/forms'
import type { FormKey, FormValues } from '@/data/forms'

export type DisplayField = { key: string; label: string }

/**
 * The columns/rows an admin view shows for a form, derived from the form
 * definition rather than from the keys present in the data -- so a field
 * nobody answered still appears, and the order matches the form.
 *
 * Two field types are dropped because they never reach `responses`:
 * `alert` is pure UI (contributors ends with one), and `lookup` is the vestigial
 * `auth_id`. util/formSchema.ts returns null for both, and the schema strips
 * unknown keys.
 *
 * `otherFieldName` gets a column of its own: those are sibling keys in
 * `responses` (SkillsOther, ReasonsOther, ...) with no field entry to generate
 * a column from.
 */
export function responseFields(formKey: FormKey): DisplayField[] {
	const fields: DisplayField[] = []

	for (const field of forms[formKey]) {
		if (field.type === 'alert' || field.type === 'lookup') continue

		const label = field.label ?? field.name
		fields.push({ key: field.name, label })

		if (field.otherFieldName) {
			fields.push({ key: field.otherFieldName, label: `${label} — other` })
		}
	}

	return fields
}

export const EM_DASH = '—'

/** Multiple selects arrive as arrays; the two Yes/No fields as booleans. */
export function formatValue(value: FormValues[string]): string {
	if (value === undefined || value === null) return EM_DASH

	if (Array.isArray(value)) {
		const items = value.filter((item) => `${item}`.trim() !== '')
		return items.length ? items.join(', ') : EM_DASH
	}

	if (typeof value === 'boolean') return value ? 'Yes' : 'No'

	const text = `${value}`.trim()
	return text === '' ? EM_DASH : text
}

export function formatBoolean(value: boolean | null | undefined): string {
	if (value === null || value === undefined) return EM_DASH
	return value ? 'Yes' : 'No'
}

export function formatText(value: string | null | undefined): string {
	const text = value?.trim()
	return text ? text : EM_DASH
}

export function formatDate(value: string | null | undefined): string {
	if (!value) return EM_DASH

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return EM_DASH

	return date.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})
}
