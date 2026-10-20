import { useSessionStatus } from '@/lib/auth-client'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
	Card,
	CardHeader,
	CardHeaderActions,
	CardHeaderHeader,
	CardList,
	CardListItem,
	CardListItemValue,
	CardListItemKey,
} from '@/components/Card'
import Container from '@/components/Container'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import {
	getContributorSubmission,
	getMaintainersSubmission,
	getMentorsSubmission,
	getNonPrContributions,
} from '@/util/api'
import { useQuery } from '@tanstack/react-query'
import SignIn from '@/components/SignIn'
import classNames from '@/util/classNames'
import { useNewSubmissionsClosed } from '@/util/globals'

export default function Page() {
	const { data: session, status: sessionStatus } = useSessionStatus()
	const newSubmissionsClosed = useNewSubmissionsClosed()

	const contributorsSubmission = useQuery({
		queryKey: ['contributors-form'],
		queryFn: getContributorSubmission,
		enabled: sessionStatus === 'authenticated',
		retry: false,
	})

	const maintainersSubmission = useQuery({
		queryKey: ['maintainers-form'],
		queryFn: getMaintainersSubmission,
		enabled: sessionStatus === 'authenticated',
		retry: false,
	})

	const mentorsSubmission = useQuery({
		queryKey: ['mentors-form'],
		queryFn: getMentorsSubmission,
		enabled: sessionStatus === 'authenticated',
		retry: false,
	})

	const nonPrContributions = useQuery({
		queryKey: ['contribs-form'],
		queryFn: getNonPrContributions,
		enabled: sessionStatus === 'authenticated',
		retry: false,
	})

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<Layout>
				<Container>
					<SignIn />
				</Container>
			</Layout>
		)
	}

	return (
		<Layout title="OSWeave Participant Dashboard">
			<Container>
				<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
					OSWeave Participant Dashboard
				</h1>
				<p className="mt-4 mb-8 text-lg leading-6 text-gray-500">
					Keep track of signups etc.
				</p>
				<div className="space-y-12">
					<Card>
						<CardHeader>
							<CardHeaderHeader
								title="Contributor"
								description="Members interested in making quality contributions to open source"
							/>
							<CardHeaderActions>
								{contributorsSubmission.status === 'pending' ? (
									<Loader />
								) : contributorsSubmission.status === 'success' &&
								  contributorsSubmission.data ? (
									<Button size="md" href="/contributors">
										Update your submission
									</Button>
								) : newSubmissionsClosed ? (
									<span
										className={classNames(
											'text-orange-600 bg-gray-50 ',
											'text-base px-5 py-3',
											'inline-block border border-transparent leading-6 font-medium rounded-md '
										)}
									>
										All Full!
									</span>
								) : (
									<Button size="md" href="/contributors">
										I Want to Hack!
									</Button>
								)}
							</CardHeaderActions>
						</CardHeader>
						<CardList>
							<CardListItem>
								<CardListItemKey>About</CardListItemKey>
								<CardListItemValue>
									Are you part of Virtual Coffee, or one of our participating
									communities and companies, who wants to contribute to open
									source but doesn't know where to start? Or have you
									contributed to open source before and want to keep making
									quality contributions? We'd love to help! Come join OSWeave
									and get the support you need.
								</CardListItemValue>
							</CardListItem>
							<CardListItem>
								<CardListItemKey>Status</CardListItemKey>
								<CardListItemValue>
									{contributorsSubmission.status === 'pending' ? (
										<Loader />
									) : contributorsSubmission.status === 'success' &&
									  contributorsSubmission.data ? (
										<>
											<span className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
												<CheckCircleIcon className="w-5 h-5 mr-1" /> Submitted!
											</span>{' '}
										</>
									) : (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
											{newSubmissionsClosed
												? 'Submissions closed for the year'
												: 'Open'}
										</span>
									)}
								</CardListItemValue>
							</CardListItem>
							{contributorsSubmission.data && (
								<CardListItem>
									<CardListItemKey>
										Non-PR Contributions{' '}
										{nonPrContributions.data && (
											<>({nonPrContributions.data.results.length})</>
										)}
									</CardListItemKey>
									<CardListItemValue>
										Not all open source contributions need to be code! If you
										have contributed to open source this month in other ways,
										please tell us about it!
										<div className="mt-2">
											<Button size="sm" href="/non-pr-contributions">
												Add your contribution
											</Button>
										</div>
										{nonPrContributions.data &&
											nonPrContributions.data.results.length > 0 && (
												<>
													<div className="mt-4">
														<strong>
															{nonPrContributions.data.results.length}{' '}
															Contributions:
														</strong>
													</div>
													<ul className="list-disc mt-2">
														{nonPrContributions.data.results.map((result) => (
															<li key={result.id}>
																<a
																	href={result.RepoUrl}
																	className="font-medium underline text-blue-700 hover:text-blue-600"
																>
																	{result.RepoName}
																</a>{' '}
																submitted on{' '}
																{new Date(
																	result.created_at ?? ''
																).toLocaleDateString()}
															</li>
														))}
													</ul>
												</>
											)}
									</CardListItemValue>
								</CardListItem>
							)}
						</CardList>
					</Card>
					<Card>
						<CardHeader>
							<CardHeaderHeader
								title="Maintainer"
								description="Open-source maintainers partnering with OSWeave to source quality contributions to their projects"
							/>
							<CardHeaderActions>
								{maintainersSubmission.status === 'pending' ? (
									<Loader />
								) : maintainersSubmission.status === 'success' &&
								  maintainersSubmission.data ? (
									<Button size="md" href="/maintainers">
										Update your submission
									</Button>
								) : newSubmissionsClosed ? (
									<span
										className={classNames(
											'text-orange-600 bg-gray-50 ',
											'text-base px-5 py-3',
											'inline-block border border-transparent leading-6 font-medium rounded-md '
										)}
									>
										All Full!
									</span>
								) : (
									<Button size="md" href="/maintainers">
										I Have Issues!
									</Button>
								)}
							</CardHeaderActions>
						</CardHeader>
						<CardList>
							<CardListItem>
								<CardListItemKey>About</CardListItemKey>
								<CardListItemValue>
									Do you have an open-source project and are looking for
									contributors? OSWeave connects you with contributors who are
									ready to make quality, sustainable contributions to your
									project.
								</CardListItemValue>
							</CardListItem>
							<CardListItem>
								<CardListItemKey>Resources</CardListItemKey>
								<CardListItemValue>
									<ul className="list-disc">
										<li>
											<a
												href="https://virtualcoffee.io/resources/developer-resources/open-source/maintainer-guide#repository-checklist"
												className="font-medium underline text-blue-700 hover:text-blue-600"
											>
												Maintainer's Checklist
											</a>
										</li>
									</ul>
								</CardListItemValue>
							</CardListItem>
							<CardListItem>
								<CardListItemKey>Status</CardListItemKey>
								<CardListItemValue>
									{maintainersSubmission.status === 'pending' ? (
										<Loader />
									) : maintainersSubmission.status === 'success' &&
									  maintainersSubmission.data ? (
										<>
											<span className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
												<CheckCircleIcon className="w-5 h-5 mr-1" /> Submitted!
											</span>{' '}
										</>
									) : (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
											{newSubmissionsClosed
												? 'Submissions closed for the year'
												: 'Open'}
										</span>
									)}
								</CardListItemValue>
							</CardListItem>
						</CardList>
					</Card>
					<Card>
						<CardHeader>
							<CardHeaderHeader
								title="Mentor"
								description="Members interested in providing high-impact help to enable early-career contributors to succeed."
							/>
							<CardHeaderActions>
								{mentorsSubmission.status === 'pending' ? (
									<Loader />
								) : mentorsSubmission.status === 'success' &&
								  mentorsSubmission.data ? (
									<Button size="md" href="/mentors">
										Update your submission
									</Button>
								) : (
									<Button size="md" href="/mentors">
										I'd Love to Help!
									</Button>
								)}
							</CardHeaderActions>
						</CardHeader>
						<CardList>
							<CardListItem>
								<CardListItemKey>About</CardListItemKey>
								<CardListItemValue>
									Have a few pull requests under your belt and want to give
									back? Join our pool of OSWeave mentors. Help out open-source
									contributors in Slack, or hold your own open office hours,
									whatever fits your schedule.
								</CardListItemValue>
							</CardListItem>
							<CardListItem>
								<CardListItemKey>Status</CardListItemKey>
								<CardListItemValue>
									{mentorsSubmission.status === 'pending' ? (
										<Loader />
									) : mentorsSubmission.status === 'success' &&
									  mentorsSubmission.data ? (
										<>
											<span className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
												<CheckCircleIcon className="w-5 h-5 mr-1" /> Submitted!
											</span>{' '}
										</>
									) : (
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
											Open
										</span>
									)}
								</CardListItemValue>
							</CardListItem>
						</CardList>
					</Card>
				</div>
			</Container>
		</Layout>
	)
}
