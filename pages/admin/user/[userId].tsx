import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import AdminGate from '@/components/AdminGate'
import {
	Card,
	CardHeader,
	CardHeaderActions,
	CardHeaderHeader,
	CardList,
	CardListItem,
	CardListItemKey,
	CardListItemValue,
} from '@/components/Card'
import {
	EM_DASH,
	formatBoolean,
	formatDate,
	formatText,
	formatValue,
	responseFields,
} from '@/components/admin/fields'
import { useSessionStatus } from '@/lib/auth-client'
import { getAdminSubmitter } from '@/util/api'
import { FORM_KEYS } from '@/util/adminForms'
import { currentYear } from '@/util/globals'
import { parseYearParam } from '@/util/adminYear'
import type { FormKey } from '@/data/forms'
import type { AdminSubmission } from '@/util/admin'

/** Singular here: each card is one person's submission to that form. */
const SECTION_TITLES: Record<FormKey, string> = {
	contributors: 'Contributor',
	maintainers: 'Maintainer',
	mentors: 'Mentor',
	nonPrContributions: 'Non-PR contributions',
}

function StatusBadge({ submitted }: { submitted: boolean }) {
	return (
		<span
			className={
				submitted
					? 'inline-flex items-center rounded-md bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800'
					: 'inline-flex items-center rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700'
			}
		>
			{submitted ? 'Submitted' : 'Not submitted'}
		</span>
	)
}

function SubmissionCard({
	formKey,
	submissions,
}: {
	formKey: FormKey
	submissions: AdminSubmission[]
}) {
	const fields = responseFields(formKey)
	const submitted = submissions.length > 0

	// Non-PR contributions are append-only, so one person can have several in a
	// year; the other three forms upsert to at most one row.
	const description = submitted
		? submissions
				.map(
					(submission) =>
						`Submitted ${formatDate(submission.createdAt)} · CoC agreed ${formatDate(
							submission.agreedToCocAt
						)}`
				)
				.join(' • ')
		: `Nothing submitted for this year.`

	return (
		<Card>
			<CardHeader>
				<CardHeaderHeader
					title={SECTION_TITLES[formKey]}
					description={description}
				/>
				<CardHeaderActions>
					<StatusBadge submitted={submitted} />
				</CardHeaderActions>
			</CardHeader>
			{submitted
				? submissions.map((submission, index) => (
						<CardList key={submission.id}>
							{submissions.length > 1 ? (
								<CardListItem>
									<CardListItemKey>Entry</CardListItemKey>
									<CardListItemValue>
										{index + 1} of {submissions.length}
									</CardListItemValue>
								</CardListItem>
							) : null}
							{fields.map((field) => (
								<CardListItem key={field.key}>
									<CardListItemKey>{field.label}</CardListItemKey>
									<CardListItemValue>
										{formatValue(submission.responses[field.key])}
									</CardListItemValue>
								</CardListItem>
							))}
						</CardList>
					))
				: null}
		</Card>
	)
}

export default function Page() {
	const { status: sessionStatus } = useSessionStatus()
	const router = useRouter()

	const userId = Array.isArray(router.query.userId)
		? router.query.userId[0]
		: router.query.userId
	const year = parseYearParam(router.query.year, currentYear)
	const from = Array.isArray(router.query.from)
		? router.query.from[0]
		: router.query.from

	const detail = useQuery({
		queryKey: ['admin-submitter', userId, year],
		queryFn: () => getAdminSubmitter(userId!, year),
		enabled: sessionStatus === 'authenticated' && Boolean(userId),
	})

	const data = detail.data
	const submitter = data?.submitter

	const backHref = from ? `/admin/${from}?year=${year}` : `/admin?year=${year}`
	const backLabel = from ? 'Back to submissions' : 'Back to Admin'

	return (
		<AdminGate
			title={`${submitter?.name ?? 'Submitter'} | Admin | Virtual Coffee Hacktoberfest`}
		>
			<Link
				href={backHref}
				className="text-sm font-medium text-gray-500 hover:text-gray-700"
			>
				← {backLabel}
			</Link>

			{detail.isPending ? (
				<p className="mt-6 text-sm text-gray-500">Loading…</p>
			) : !submitter || !data ? (
				<div className="mt-6">
					<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900">
						Not found
					</h1>
					<p className="mt-4 text-lg leading-6 text-gray-500">
						No member matches that address.
					</p>
				</div>
			) : (
				<>
					<div className="flex items-center gap-4 mt-4">
						{submitter.image ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={submitter.image}
								alt=""
								className="h-16 w-16 rounded-full bg-gray-200"
							/>
						) : (
							<div className="h-16 w-16 rounded-full bg-gray-200" />
						)}
						<div>
							<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
								{submitter.name ?? EM_DASH}
							</h1>
							<p className="mt-1.5 text-base text-gray-500">
								{[
									submitter.githubUsername && `@${submitter.githubUsername}`,
									submitter.pronouns,
									submitter.preferredTimeZone,
								]
									.filter(Boolean)
									.join(' · ') || EM_DASH}
							</p>
						</div>
					</div>

					<div className="mt-8 flex flex-col gap-8">
						<Card>
							<CardHeader>
								<CardHeaderHeader
									title="Profile"
									description={
										submitter.hasProfile
											? 'member_profile'
											: 'No profile row yet — showing the GitHub identity.'
									}
								/>
							</CardHeader>
							<CardList>
								<CardListItem>
									<CardListItemKey>Contact email</CardListItemKey>
									<CardListItemValue>
										{formatText(submitter.contactEmail)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>Account email</CardListItemKey>
									<CardListItemValue>
										{formatText(submitter.email)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>GitHub / Twitter</CardListItemKey>
									<CardListItemValue>
										{formatText(submitter.githubUsername)} ·{' '}
										{formatText(submitter.twitterUsername)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>Pronouns</CardListItemKey>
									<CardListItemValue>
										{formatText(submitter.pronouns)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>Time zone</CardListItemKey>
									<CardListItemValue>
										{formatText(submitter.preferredTimeZone)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>VC member</CardListItemKey>
									<CardListItemValue>
										{formatBoolean(submitter.isMember)}
									</CardListItemValue>
								</CardListItem>
								<CardListItem>
									<CardListItemKey>Allow social sharing</CardListItemKey>
									<CardListItemValue>
										{formatBoolean(submitter.allowSocialSharing)}
									</CardListItemValue>
								</CardListItem>
							</CardList>
						</Card>

						{FORM_KEYS.map((formKey) => (
							<SubmissionCard
								key={formKey}
								formKey={formKey}
								submissions={data.submissions[formKey] ?? []}
							/>
						))}
					</div>
				</>
			)}
		</AdminGate>
	)
}
