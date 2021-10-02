import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Layout from '../components/Layout'
import Form, { FormLayout } from '../components/Forms'
import SignIn from '../components/SignIn'
import { useQuery } from 'react-query'
import Button from '../components/Button'
import { getMaintainersSubmission } from '../util/api'

// Become a Contributor: Virtual Coffee Hacktoberfest Initiative

const intro = (
	<>
		<div className="text-center">
			<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
				Calling All Maintainers
			</h1>
			<p className="mt-4 text-lg leading-6 text-gray-500">
				Are you an Open Source maintainer who is interested in participating in
				Hacktoberfest? We're looking for some OSS maintainers to partner with in
				order to provide a welcoming environment to our Contributors as they
				start their open source journey.
			</p>
		</div>
	</>
)

const successView = (
	<div className="py-16 px-4  sm:px-6 lg:px-8 lg:py-24">
		<div className="relative max-w-2xl mx-auto">
			<div className="text-center">
				<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 flex justify-center">
					<span className="mr-4">🙌</span>
					<span>Thank you for your interest!</span>
					<span className="ml-4">🙌</span>
				</h1>
				<div className="text-lg leading-6 text-gray-500">
					<p className="mt-4">
						You'll hear from a Virtual Coffee member soon with next steps.
					</p>
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

	const previousFormSubmission = useQuery(
		'maintainers-form',
		getMaintainersSubmission,
		{ enabled: sessionStatus === 'authenticated' }
	)

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<FormLayout
				title="Calling All Maintainers"
				description="We're looking for some OSS maintainers to partner with in order to provide a welcoming environment to our Contributors as they start their open source journey."
			>
				<SignIn />
			</FormLayout>
		)
	}

	if (!(previousFormSubmission.isSuccess || previousFormSubmission.isError)) {
		return null
	}

	if (!previousFormSubmission.data) {
		return (
			<FormLayout
				title="We've ended submissions for 2021"
				description="Thank you for your interest, but we've ended submissions for this year. See you next year!"
			>
				<div className="text-center">
					<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
						We've ended submissions for 2021
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
			title="Calling All Maintainers"
			description="We're looking for some OSS maintainers to partner with in order to provide a welcoming environment to our Contributors as they start their open source journey."
		>
			<Form
				session={session}
				previousFormSubmission={
					previousFormSubmission?.data?.success
						? previousFormSubmission.data.fields
						: null
				}
				errorMessage={error ? errorMessage : undefined}
				successView={successView}
				intro={intro}
				formKey="maintainers"
				fieldsetLegend="Maintainer Details"
			/>
		</FormLayout>
	)
}
