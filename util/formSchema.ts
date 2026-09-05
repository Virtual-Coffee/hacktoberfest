import { z } from 'zod'
import * as formData from '@/data/forms'
import type { FormField, FormKey } from '@/data/forms'

/** Browsers post '' for an untouched optional input. */
const emptyToUndefined = (value: unknown) => (value === '' ? undefined : value)

const CHECKBOX_TRUE = new Set(['on', 'yes', 'true', '1'])

const toBoolean = (value: unknown) =>
	typeof value === 'boolean'
		? value
		: CHECKBOX_TRUE.has(`${value}`.toLowerCase())

/** A single-value multi-select posts as a bare string rather than an array. */
const toArray = (value: unknown) =>
	value === undefined || Array.isArray(value) ? value : [value]

/**
 * Builds the schema for one declared field, or null when the field is not part
 * of the payload at all.
 *
 * The `never` in the default branch is load-bearing: adding a FieldType to
 * data/forms.tsx without deciding how it validates becomes a compile error.
 * That is what stops the RepoUrl bug from recurring -- persistence used to be
 * driven by a second, hand-maintained switch that simply had no 'URL' case, so
 * the field was dropped on write while the dashboard went on reading it back.
 * Now the schema is the whitelist, and it is generated from the same
 * declarations the form renders from.
 */
function fieldSchema(field: FormField): z.ZodType | null {
	switch (field.type) {
		case 'Text':
			return field.inputType === 'email' ? z.email() : z.string().trim().min(1)

		case 'URL':
			return z.url()

		case 'Long text':
			return z.string().trim().min(1)

		case 'Single select':
			return field.possibleValues?.length
				? z.enum(field.possibleValues as [string, ...string[]])
				: z.string().trim().min(1)

		case 'Multiple select':
			// Not z.enum(possibleValues): otherFieldName lets a submitter add a
			// free-text value alongside the declared options.
			return z.preprocess(toArray, z.array(z.string().trim().min(1)))

		case 'Checkbox':
			return z.preprocess(toBoolean, z.boolean())

		// UI-only, and the auth_id pseudo-field. Neither is submitted.
		case 'alert':
		case 'lookup':
			return null

		default: {
			const exhaustive: never = field.type
			return exhaustive
		}
	}
}

function shapeFor(fields: FormField[]) {
	const shape: Record<string, z.ZodType> = {}

	for (const field of fields) {
		const base = fieldSchema(field)
		if (!base) continue

		shape[field.name] = field.required
			? base
			: z.preprocess(emptyToUndefined, base.optional())

		if (field.otherFieldName) {
			shape[field.otherFieldName] = z.preprocess(
				emptyToUndefined,
				z.string().trim().optional()
			)
		}
	}

	return shape
}

/**
 * `agree` is not in data/forms.tsx -- Forms.tsx hardcodes the Code of Conduct
 * checkbox, and the routes used to prepend the literal string to their
 * required-field list. It stays explicit here, and is recorded as
 * agreedToCocAt on the row rather than stored among the responses.
 */
const agree = z.preprocess(
	toBoolean,
	z.literal(true, 'You must agree to the Code of Conduct.')
)

export function buildFormSchema(
	formKey: FormKey,
	{ includeProfile }: { includeProfile: boolean }
) {
	// Default .strip() rather than .strict(): unknown keys (the auth_id
	// pseudo-field, anything a browser extension adds) are dropped instead of
	// failing the submission.
	return z.object({
		agree,
		...(includeProfile ? shapeFor(formData.profile) : {}),
		...shapeFor(formData.forms[formKey]),
	})
}

/** Matches the { field, message } shape Forms.tsx's reducer already renders. */
export function zodIssuesToFieldErrors(error: z.ZodError) {
	return error.issues.map((issue) => ({
		field: issue.path.join('.') || 'form',
		message: issue.message,
	}))
}
