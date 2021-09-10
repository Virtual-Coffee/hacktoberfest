import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Layout from '../components/Layout'
import {
	Card,
	CardHeader,
	CardHeaderActions,
	CardHeaderHeader,
	CardList,
	CardListItem,
	CardListItemValue,
	CardListItemKey,
} from '../components/Card'
import Container from '../components/Container'
import Button from '../components/Button'
import Loader from '../components/Loader'
import { CheckCircleIcon } from '@heroicons/react/outline'
import { getContributorSubmission } from '../util/api'
import { useQuery } from 'react-query'
import SignIn from '../components/SignIn'

export default function Page() {
	const { data: session, status: sessionStatus } = useSession()

	const contributorsSubmission = useQuery(
		'contributors-form',
		getContributorSubmission,
		{ enabled: sessionStatus === 'authenticated', retry: false }
	)

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

	console.log({ contributorsSubmission })

	return (
		<Layout title="VC Hacktoberfest Dashboard">
			<Container>
				<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
					Virtual Coffee Hacktoberfest Dashboard
				</h1>
				<p className="mt-4 mb-8 text-lg leading-6 text-gray-500">
					Keep track of signups etc.
				</p>
				<Card>
					<CardHeader>
						<CardHeaderHeader
							title="Contributor"
							description="Members interested in contributing to Open Source and completing the Hacktoberfest Challenge"
						/>
						<CardHeaderActions>
							{contributorsSubmission.status === 'idle' ||
							contributorsSubmission.status === 'loading' ? (
								<Loader />
							) : contributorsSubmission.status === 'success' &&
							  contributorsSubmission.data ? (
								<Button size="md" href="/contributors">
									Update your submission
								</Button>
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
								Are you interested in participating in Hacktoberfest (or Open
								Source in general), but don't know where to start? Or are you an
								experienced developer looking to complete Hacktoberfest as part
								of the Virtual Coffee Community? We'd love to help! Come join
								our Hacktoberfest Initiative and get the support you need to
								complete the challenge.
							</CardListItemValue>
						</CardListItem>
						<CardListItem>
							<CardListItemKey>Status</CardListItemKey>
							<CardListItemValue>
								{contributorsSubmission.status === 'idle' ||
								contributorsSubmission.status === 'loading' ? (
									<Loader />
								) : contributorsSubmission.status === 'success' &&
								  contributorsSubmission.data ? (
									<>
										<span className="inline-flex items-center px-5 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800">
											<CheckCircleIcon className="w-5 h-5 mr-1" /> Completed!
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
			</Container>
		</Layout>
	)
}
