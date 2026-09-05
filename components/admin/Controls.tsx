import Link from 'next/link'
import classNames from '@/util/classNames'
import { FORM_KEYS, FORM_LABELS } from '@/util/adminForms'
import type { FormKey } from '@/data/forms'
import type { YearCounts } from '@/util/admin'

export function YearSelect({
	year,
	years,
	onChange,
}: {
	year: number
	years: number[]
	onChange: (year: number) => void
}) {
	// The dropdown is built from the years that actually have rows, plus the
	// selected one so a year with nothing in it is still shown as selected.
	const options = [...new Set([...years, year])].sort((a, b) => b - a)

	return (
		<div className="flex items-center gap-2">
			<label htmlFor="admin-year" className="text-sm font-medium text-gray-700">
				Year
			</label>
			<select
				id="admin-year"
				value={year}
				onChange={(event) => onChange(Number(event.target.value))}
				className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-900 bg-white"
			>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

export function FormTabs({
	active,
	year,
	counts,
}: {
	active: FormKey
	year: number
	counts: YearCounts | undefined
}) {
	return (
		<nav className="flex gap-8" aria-label="Submission forms">
			{FORM_KEYS.map((formKey) => {
				const current = formKey === active

				return (
					<Link
						key={formKey}
						href={`/admin/${formKey}?year=${year}`}
						aria-current={current ? 'page' : undefined}
						className={classNames(
							'flex items-center border-b-2 px-1 pb-3 text-sm font-medium',
							current
								? 'border-indigo-500 text-gray-900'
								: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
						)}
					>
						{FORM_LABELS[formKey]}
						{counts ? (
							<span
								className={classNames(
									'ml-2 rounded-full px-2 py-0.5 text-xs font-semibold',
									current
										? 'bg-indigo-100 text-indigo-800'
										: 'bg-gray-100 text-gray-700'
								)}
							>
								{counts[formKey]}
							</span>
						) : null}
					</Link>
				)
			})}
		</nav>
	)
}
