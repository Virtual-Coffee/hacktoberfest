import Layout from './Layout'
import Container from './Container'
import SignIn from './SignIn'
import { useSessionStatus } from '@/lib/auth-client'
import type { ReactNode } from 'react'

/**
 * The same loading / unauthenticated triad every gated page hand-rolls, plus a
 * fourth branch for a signed-in member who is not an admin.
 *
 * This is convenience only. The boundary that matters is requireAdmin() on the
 * /api/admin/* routes -- without it, hiding the nav link would leave the data
 * one fetch away.
 */
export default function AdminGate({
	title,
	description,
	children,
}: {
	title?: string
	description?: string
	children: ReactNode
}) {
	const { data: session, status: sessionStatus } = useSessionStatus()

	if (sessionStatus === 'loading') {
		return null
	}

	if (sessionStatus === 'unauthenticated') {
		return (
			<Layout title={title} description={description}>
				<Container>
					<SignIn />
				</Container>
			</Layout>
		)
	}

	if (session?.user.role !== 'admin') {
		return (
			<Layout title={title} description={description}>
				<Container>
					<div className="max-w-2xl mx-auto text-center py-12">
						<h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900">
							Not authorized
						</h1>
						<p className="mt-4 text-lg leading-6 text-gray-500">
							This page is for Virtual Coffee organizers. If you think you
							should have access, ask in the Virtual Coffee Slack.
						</p>
					</div>
				</Container>
			</Layout>
		)
	}

	return (
		<Layout title={title} description={description}>
			<Container>{children}</Container>
		</Layout>
	)
}
