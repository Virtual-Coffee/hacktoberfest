import { useRouter } from 'next/router'
import { useSessionStatus } from '@/lib/auth-client'
import Form, { FormLayout, SignupsPausedNotice } from '@/components/Forms'
import SignIn from '@/components/SignIn'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/Button'
import { getProfile, getMentorsSubmission } from '@/util/api'
import { signupsPaused } from '@/util/globals'

// Become a Contributor: Virtual Coffee Hacktoberfest Initiative

const intro = (
	<>
		<div className="text-center">
			<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
				Become an OSWeave Mentor
			</h1>
			<p className="mt-4 text-lg leading-6 text-gray-500">
				Thank you for expressing your interest in joining our pool of OSWeave mentors. We
				would really appreciate it if you took the time to fill out this short
				questionnaire.
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
	const { data: session, status: sessionStatus } = useSessionStatus()
	const router = useRouter()
	const { error, message: errorMessage } = router.query

	const previousFormSubmission = useQuery({
		queryKey: ['mentors-form'],
		queryFn: getMentorsSubmission,
		enabled: sessionStatus === 'authenticated',
	})

	const profile = useQuery({
		queryKey: ['profile'],
		queryFn: getProfile,
		enabled: sessionStatus === 'authenticated',
	})

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<FormLayout
				title="Become an OSWeave Mentor"
				description="OSweave is a great place to provide high-impact help to enable early-career contributors to make quality contributions."
			>
				<SignIn />
			</FormLayout>
		)
	}

	if (!(previousFormSubmission.isSuccess || previousFormSubmission.isError)) {
		return null
	}

	if (profile.isPending) {
		return null
	}

	if (!previousFormSubmission.data && signupsPaused) {
		return <SignupsPausedNotice />
	}

	return (
		<FormLayout
			title="Become a OSWeave Mentor"
			description="OSWeave is a great place to provide high-impact help to enable early-career contributors to make quality contributions."
		>
			<Form
				session={session}
				profile={profile.data?.profile ?? null}
				previousFormSubmission={
					previousFormSubmission?.data?.success
						? previousFormSubmission.data.fields
						: null
				}
				errorMessage={
					error && typeof errorMessage === 'string' ? errorMessage : undefined
				}
				successView={successView}
				intro={intro}
				formKey="mentors"
				fieldsetLegend="Mentor Details"
			/>
		</FormLayout>
	)
}
