import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import AdminGate from '@/components/AdminGate'
import SubmissionsTable from '@/components/admin/SubmissionsTable'
import { FormTabs, YearSelect } from '@/components/admin/Controls'
import { useSessionStatus } from '@/lib/auth-client'
import { getAdminCounts, getAdminSubmissions } from '@/util/api'
import { FORM_HEADINGS, isFormKey } from '@/util/adminForms'
import { currentYear } from '@/util/globals'
import { parseYearParam } from '@/util/adminYear'

export default function Page() {
	const { status: sessionStatus } = useSessionStatus()
	const router = useRouter()

	const formKeyParam = Array.isArray(router.query.formKey)
		? router.query.formKey[0]
		: router.query.formKey
	const formKey = isFormKey(formKeyParam) ? formKeyParam : null
	const year = parseYearParam(router.query.year, currentYear)

	const counts = useQuery({
		queryKey: ['admin-counts'],
		queryFn: getAdminCounts,
		enabled: sessionStatus === 'authenticated',
	})

	const submissions = useQuery({
		queryKey: ['admin-submissions', formKey, year],
		queryFn: () => getAdminSubmissions(formKey!, year),
		enabled: sessionStatus === 'authenticated' && formKey !== null,
	})

	// router.query is empty on the very first client render, so an unknown form
	// is only really unknown once the router has hydrated.
	if (!formKey) {
		if (!router.isReady) return null

		return (
			<AdminGate title="Admin | Virtual Coffee Hacktoberfest">
				<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900">
					Unknown form
				</h1>
				<p className="mt-4 text-lg leading-6 text-gray-500">
					No submission form matches that address.
				</p>
			</AdminGate>
		)
	}

	const rows = submissions.data?.submissions
	const yearCounts = counts.data?.counts ?? []
	const selected = yearCounts.find((row) => row.year === year)
	const noun =
		formKey === 'nonPrContributions' ? 'contributions' : 'submissions'

	return (
		<AdminGate
			title={`${FORM_HEADINGS[formKey]} | Admin | Virtual Coffee Hacktoberfest`}
			description={`${FORM_HEADINGS[formKey]} ${noun} for ${year}.`}
		>
			<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
				{FORM_HEADINGS[formKey]}
			</h1>
			<p className="mt-3 mb-6 text-lg leading-6 text-gray-500">
				{rows ? `${rows.length} ${noun} for ${year}.` : ` `}
			</p>

			<div className="border-b border-gray-200 flex justify-between items-end flex-wrap gap-3">
				<FormTabs active={formKey} year={year} counts={selected} />
				<div className="pb-2">
					<YearSelect
						year={year}
						years={yearCounts.map((row) => row.year)}
						onChange={(next) =>
							router.push({
								pathname: `/admin/${formKey}`,
								query: { year: next },
							})
						}
					/>
				</div>
			</div>

			{submissions.isPending ? (
				<div className="mt-6 px-6 py-12 text-center text-sm text-gray-500">
					Loading {noun}…
				</div>
			) : (
				<SubmissionsTable formKey={formKey} year={year} rows={rows} />
			)}
		</AdminGate>
	)
}
