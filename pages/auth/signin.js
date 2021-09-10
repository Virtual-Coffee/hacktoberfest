import { getProviders, signIn } from 'next-auth/react'
import Layout from '../../components/Layout'

export default function SignIn({ providers }) {
	return (
		<Layout>
			{Object.values(providers).map((provider) => (
				<div key={provider.name}>
					<button onClick={() => signIn(provider.id)}>
						Sign in with {provider.name}
					</button>
				</div>
			))}
		</Layout>
	)
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
	const providers = await getProviders()
	return {
		props: { providers },
	}
}
