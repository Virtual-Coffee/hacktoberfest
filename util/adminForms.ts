import { forms } from '@/data/forms'
import type { FormKey } from '@/data/forms'

/**
 * Client-safe half of the admin module.
 *
 * These live apart from util/admin.ts on purpose: that file imports `@/db`, so
 * a *value* import of it from a page drags the node-postgres driver into the
 * browser bundle and the build fails on `util/types`. Types from util/admin.ts
 * are fine to import anywhere -- `import type` erases -- but constants are not.
 */

export const FORM_KEYS = Object.keys(forms) as FormKey[]

/** Short, for tabs and table headers. */
export const FORM_LABELS: Record<FormKey, string> = {
	contributors: 'Contributors',
	maintainers: 'Maintainers',
	mentors: 'Mentors',
	nonPrContributions: 'Non-PR',
}

/** Spelled out, for page headings and stat cards. */
export const FORM_HEADINGS: Record<FormKey, string> = {
	contributors: 'Contributors',
	maintainers: 'Maintainers',
	mentors: 'Mentors',
	nonPrContributions: 'Non-PR contributions',
}

export function isFormKey(value: unknown): value is FormKey {
	return typeof value === 'string' && value in forms
}
