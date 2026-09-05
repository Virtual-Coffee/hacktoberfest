import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import AdminGate from '@/components/AdminGate'
import { YearSelect } from '@/components/admin/Controls'
import { useSessionStatus } from '@/lib/auth-client'
import { getAdminCounts } from '@/util/api'
import { FORM_HEADINGS, FORM_KEYS, FORM_LABELS } from '@/util/adminForms'
import { currentYear } from '@/util/globals'
import { parseYearParam } from '@/util/adminYear'

export default function Page() {
	const { status: sessionStatus } = useSessionStatus()
	const router = useRouter()
	const year = parseYearParam(router.query.year, currentYear)

	const counts = useQuery({
		queryKey: ['admin-counts'],
		queryFn: getAdminCounts,
		enabled: sessionStatus === 'authenticated',
	})

	const rows = counts.data?.counts ?? []
	const years = rows.map((row) => row.year)
	const selected = rows.find((row) => row.year === year)

	return (
		<AdminGate
			title="Admin | Virtual Coffee Hacktoberfest"
			description="Submissions across all forms."
		>
			<div className="flex justify-between items-start flex-wrap gap-4">
				<div>
					<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
						Admin
					</h1>
					<p className="mt-4 mb-8 text-lg leading-6 text-gray-500">
						Submissions across all forms.
					</p>
				</div>
				<div className="mt-1.5">
					<YearSelect
						year={year}
						years={years}
						onChange={(next) =>
							router.push({ pathname: '/admin', query: { year: next } })
						}
					/>
				</div>
			</div>

			<dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{FORM_KEYS.map((formKey) => (
					<div
						key={formKey}
						className="bg-white shadow-sm rounded-lg p-5 border border-gray-200"
					>
						<dt className="text-sm font-medium text-gray-500">
							{FORM_HEADINGS[formKey]}
						</dt>
						<dd className="mt-2 text-3xl leading-9 font-semibold text-gray-900">
							{selected ? selected[formKey] : '—'}
						</dd>
						<div className="mt-3">
							<Link
								href={`/admin/${formKey}?year=${year}`}
								className="text-sm font-medium text-orange-600 hover:text-orange-500"
							>
								View submissions →
							</Link>
						</div>
					</div>
				))}
			</dl>

			<div className="mt-10 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-200">
					<h2 className="text-lg leading-6 font-medium text-gray-900">
						By year
					</h2>
					<p className="mt-1 text-sm text-gray-500">
						Row counts per submission table.
					</p>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
								>
									Year
								</th>
								{FORM_KEYS.map((formKey) => (
									<th
										key={formKey}
										scope="col"
										className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
									>
										{FORM_LABELS[formKey]}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr key={row.year} className="border-t border-gray-200">
									<td className="px-6 py-3.5 text-sm font-medium text-gray-900">
										{row.year}
									</td>
									{FORM_KEYS.map((formKey) => (
										<td
											key={formKey}
											className="px-6 py-3.5 text-sm text-gray-700 text-right"
										>
											{row[formKey]}
										</td>
									))}
								</tr>
							))}
							{counts.isSuccess && rows.length === 0 ? (
								<tr className="border-t border-gray-200">
									<td
										colSpan={FORM_KEYS.length + 1}
										className="px-6 py-8 text-sm text-gray-500 text-center"
									>
										No submissions yet.
									</td>
								</tr>
							) : null}
						</tbody>
					</table>
				</div>
			</div>
		</AdminGate>
	)
}
