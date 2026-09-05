import { useMemo, useState } from 'react'
import { useTable } from '@tanstack/react-table'
import type { PaginationState } from '@tanstack/react-table'
import classNames from '@/util/classNames'
import { PINNED_COLUMN_ID, buildColumns, features } from './columns'
import type { AdminSubmissionRow } from '@/util/admin'
import type { FormKey } from '@/data/forms'

/** A fresh fallback array each render would invalidate the row models. */
const EMPTY_ROWS: AdminSubmissionRow[] = []

const PAGE_SIZE = 25

const SORT_INDICATOR = { asc: ' ▲', desc: ' ▼' } as const

export default function SubmissionsTable({
	formKey,
	year,
	rows,
}: {
	formKey: FormKey
	year: number
	rows: AdminSubmissionRow[] | undefined
}) {
	const columns = useMemo(() => buildColumns(formKey, year), [formKey, year])
	const data = rows ?? EMPTY_ROWS

	// v9 has no table.getState(); pagination is controlled here so the
	// "Showing 1-25 of 184" line can read pageIndex. autoResetPageIndex sends
	// us back to page 1 when the form or year changes the data underneath.
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: PAGE_SIZE,
	})

	const table = useTable({
		features,
		columns,
		data,
		state: { pagination },
		onPaginationChange: setPagination,
		initialState: {
			columnPinning: { start: [PINNED_COLUMN_ID], end: [] },
			sorting: [{ id: PINNED_COLUMN_ID, desc: false }],
		},
	})

	const pageRows = table.getRowModel().rows
	const total = data.length
	const { pageIndex } = pagination
	const firstRow = total === 0 ? 0 : pageIndex * PAGE_SIZE + 1
	const lastRow = Math.min(total, (pageIndex + 1) * PAGE_SIZE)

	if (total === 0) {
		return (
			<div className="mt-6 bg-white shadow-sm border border-gray-200 rounded-lg px-6 py-12 text-center">
				<p className="text-sm text-gray-500">No submissions for {year}.</p>
			</div>
		)
	}

	return (
		<div className="mt-6 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
			<div className="overflow-x-auto">
				<table className="border-collapse min-w-[1600px]">
					<thead className="bg-gray-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const pinned = header.column.getIsPinned()
									const sorted = header.column.getIsSorted()

									return (
										<th
											key={header.id}
											scope="col"
											aria-sort={
												sorted === 'asc'
													? 'ascending'
													: sorted === 'desc'
														? 'descending'
														: undefined
											}
											className={classNames(
												'text-left px-4 py-2.5 text-xs font-semibold whitespace-nowrap',
												pinned
													? 'sticky left-0 z-10 bg-gray-50 border-r border-gray-200 w-56 text-gray-700'
													: 'text-gray-500'
											)}
										>
											{header.isPlaceholder ? null : (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="inline-flex items-center gap-1 hover:text-gray-900"
												>
													<table.FlexRender header={header} />
													{sorted ? SORT_INDICATOR[sorted] : null}
												</button>
											)}
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{pageRows.map((row, index) => {
							const striped = index % 2 === 1

							return (
								<tr
									key={row.id}
									className={classNames(
										'border-t border-gray-200',
										striped && 'bg-gray-50'
									)}
								>
									{row.getAllCells().map((cell) => {
										const pinned = cell.column.getIsPinned()

										return (
											<td
												key={cell.id}
												className={classNames(
													'px-4 py-2.5 text-[13px] whitespace-nowrap',
													pinned
														? classNames(
																'sticky left-0 z-10 border-r border-gray-200 font-medium text-gray-900',
																striped ? 'bg-gray-50' : 'bg-white'
															)
														: 'text-gray-700'
												)}
											>
												<table.FlexRender cell={cell} />
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
			<div className="flex justify-between items-center gap-4 px-4 py-3 border-t border-gray-200 bg-white">
				<p className="text-sm text-gray-500">
					Showing{' '}
					<span className="font-medium text-gray-900">
						{firstRow}–{lastRow}
					</span>{' '}
					of <span className="font-medium text-gray-900">{total}</span>
				</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white"
					>
						Previous
					</button>
					<button
						type="button"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	)
}
