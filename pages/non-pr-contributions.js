import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Form, { FormLayout } from '../components/Forms'
import SignIn from '../components/SignIn'
import { useQuery } from 'react-query'
import Button from '../components/Button'
import { getContributorSubmission } from '../util/api'
import { useNewSubmissionsClosed } from '../util/globals'

// Become a Contributor: Virtual Coffee Hacktoberfest Initiative

const intro = (
	<>
		<div className="text-center">
			<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
				Add a Non-PR Contribution
			</h1>
			<p className="mt-4 text-lg leading-6 text-gray-500">
				Not all open source contributions need to be code! If you have
				contributed to open source this month in other ways, please tell us
				about it!
			</p>
		</div>
	</>
)

{
	/* <Head>
			<title>Thank you for your interest!</title>
		</Head> */
}
const successView = (
	<div className="py-16 px-4  sm:px-6 lg:px-8 lg:py-24">
		<div className="relative max-w-2xl mx-auto">
			<div className="text-center">
				<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 flex justify-center">
					<span className="mr-4">🙌</span>
					<span>Thank you for your contribution!</span>
					<span className="ml-4">🙌</span>
				</h1>
				<div className="text-lg leading-6 text-gray-500">
					<p className="mt-4">You're a star!</p>

					<p className="mt-4">
						<Button size="lg" href="/dashboard">
							Go to Dashboard
						</Button>
					</p>
				</div>
			</div>
		</div>
	</div>
)

export default function Page() {
	const { data: session, status: sessionStatus } = useSession()
	const router = useRouter()
	const { error, message: errorMessage } = router.query
	const newSubmissionsClosed = useNewSubmissionsClosed()

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<FormLayout
				title="Add a Non-PR Contribution"
				description="Not all open source contributions need to be code!"
			>
				<SignIn />
			</FormLayout>
		)
	}

	if (newSubmissionsClosed) {
		return (
			<FormLayout
				title="We've ended submissions for 2023"
				description="Thank you for your interest, but we've ended submissions for this year. See you next year!"
			>
				<div className="text-center">
					<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
						We've ended submissions for 2023
					</h1>
					<p className="mt-4 text-lg leading-6 text-gray-500">
						Thank you for your interest, but we've ended submissions for this
						year.
					</p>
					<p className="mt-4 text-lg leading-6 text-gray-500">
						See you next year!
					</p>
				</div>
			</FormLayout>
		)
	}

	return (
		<FormLayout
			title="Add a Non-PR Contribution"
			description="Not all open source contributions need to be code!"
		>
			<Form
				showProfileFields={false}
				session={session}
				errorMessage={error ? errorMessage : undefined}
				successView={successView}
				intro={intro}
				formKey="nonPrContributions"
				fieldsetLegend="Contribution Details"
				submitText="Save Contribution"
			/>
		</FormLayout>
	)
}
