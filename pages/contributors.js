import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Form, { FormLayout } from '../components/Forms'
import SignIn from '../components/SignIn'
import { useQuery } from 'react-query'
import Button from '../components/Button'
import { getContributorSubmission } from '../util/api'

// Become a Contributor: Virtual Coffee Hacktoberfest Initiative

const intro = (
	<>
		<div className="text-center">
			<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
				Become a Hacktoberfest Contributor
			</h1>
			<p className="mt-4 text-lg leading-6 text-gray-500">
				Are you interested in participating in Hacktoberfest (or Open Source in
				general), but don't know where to start? Or are you an experienced
				developer looking to do this as part of the Virtual Coffee Community?
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
					<span>Thank you for your interest!</span>
					<span className="ml-4">🙌</span>
				</h1>
				<div className="text-lg leading-6 text-gray-500">
					<p className="mt-4">
						You'll hear from a Virtual Coffee member soon with next steps.
					</p>
					<p className="mt-4">
						In the meantime, make sure you've{' '}
						<a href="https://hacktoberfest.digitalocean.com/">
							signed up for Hacktoberfest on Digital Ocean
						</a>
						!
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
		'contributors-form',
		getContributorSubmission,
		{ enabled: sessionStatus === 'authenticated' }
	)

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<FormLayout
				title="Become a Hacktoberfest Contributor"
				description="Are you interested in participating in Hacktoberfest, but don't know where to start?"
			>
				<SignIn />
			</FormLayout>
		)
	}

	if (!(previousFormSubmission.isSuccess || previousFormSubmission.isError)) {
		return null
	}

	return (
		<FormLayout
			title="Become a Hacktoberfest Contributor"
			description="Are you interested in participating in Hacktoberfest, but don't know where to start?"
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
				formKey="contributors"
				fieldsetLegend="Contributor Details"
			/>
		</FormLayout>
	)
}
