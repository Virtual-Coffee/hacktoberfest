import Link from 'next/link'
import {
	columnPinningFeature,
	createColumnHelper,
	createPaginatedRowModel,
	createSortedRowModel,
	rowPaginationFeature,
	rowSortingFeature,
	sortFn_alphanumeric,
	tableFeatures,
} from '@tanstack/react-table'
import {
	EM_DASH,
	formatBoolean,
	formatDate,
	formatText,
	formatValue,
	responseFields,
} from '@/util/adminFields'
import type { AdminSubmissionRow } from '@/util/admin'
import type { FormKey } from '@/data/forms'

/**
 * Module scope on purpose: `features` must be a stable reference, and a fresh
 * one each render would invalidate every data-dependent row model.
 *
 * Only the three features the grid actually uses are registered -- in v9 the
 * sorting/pagination/pinning APIs do not exist on the table until they are.
 *
 * `alphanumeric` is the only sort function registered, and every column below
 * names it rather than leaving `sortFn` on its `'auto'` default. Auto samples
 * the first ten rows: values with no digits resolve to `text`, which is not
 * registered here, and v9 only rescues the other direction (alphanumeric ->
 * text), so those columns silently fell back to `sortFn_basic` -- a raw `>`
 * with no lowercasing, which sorts `Zoe` above `alice`. Naming it also means
 * `project2` sorts before `project10` in every column, not just the ones that
 * happened to have a number in the first ten rows.
 */
export const features = tableFeatures({
	rowSortingFeature,
	rowPaginationFeature,
	columnPinningFeature,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	sortFns: { alphanumeric: sortFn_alphanumeric },
})

const helper = createColumnHelper<typeof features, AdminSubmissionRow>()

/** Pinned so it stays put while the response columns scroll sideways. */
export const PINNED_COLUMN_ID = 'name'

/**
 * Columns are built per form key, never shared: `Skills`, `Availability`,
 * `CommunicationPreferences`, `RepoName` and `RepoUrl` all appear in more than
 * one form with different labels and options.
 */
export function buildColumns(formKey: FormKey, year: number) {
	const profileColumns = [
		helper.accessor((row) => row.name ?? EM_DASH, {
			id: PINNED_COLUMN_ID,
			header: 'Name',
			sortFn: 'alphanumeric',
			cell: ({ row }) => (
				<Link
					href={`/admin/user/${encodeURIComponent(row.original.userId)}?year=${year}&from=${formKey}`}
					className="font-medium text-gray-900 hover:text-orange-600"
				>
					{row.original.name ?? EM_DASH}
				</Link>
			),
		}),
		helper.accessor((row) => formatText(row.githubUsername), {
			id: 'githubUsername',
			header: 'GitHub',
			sortFn: 'alphanumeric',
		}),
		helper.accessor((row) => formatText(row.email), {
			id: 'email',
			header: 'Email',
			sortFn: 'alphanumeric',
		}),
		helper.accessor((row) => formatText(row.preferredTimeZone), {
			id: 'preferredTimeZone',
			header: 'Time zone',
			sortFn: 'alphanumeric',
		}),
		helper.accessor((row) => formatText(row.pronouns), {
			id: 'pronouns',
			header: 'Pronouns',
			sortFn: 'alphanumeric',
		}),
		helper.accessor((row) => formatBoolean(row.isMember), {
			id: 'isMember',
			header: 'Member',
			sortFn: 'alphanumeric',
		}),
	]

	// Read straight off `responses`, keyed by the field `name` from
	// data/forms.tsx -- PascalCase, not the label.
	const responseColumns = responseFields(formKey).map((field) =>
		helper.accessor((row) => formatValue(row.responses[field.key]), {
			id: `response:${field.key}`,
			header: field.label,
			sortFn: 'alphanumeric',
		})
	)

	const metaColumns = [
		helper.accessor((row) => row.createdAt, {
			id: 'createdAt',
			header: 'Submitted',
			sortFn: 'alphanumeric',
			cell: ({ row }) => formatDate(row.original.createdAt),
		}),
	]

	return helper.columns([...profileColumns, ...responseColumns, ...metaColumns])
}
