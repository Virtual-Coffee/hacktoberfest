import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'

// Create a client
const queryClient = new QueryClient()

// Local-only auth panel (test users, session switching); the server side is
// the devtools plugin in lib/auth.ts. The NODE_ENV check is a compile-time
// constant, so production builds drop the import entirely rather than ship a
// panel that would only ever get a 403 from its own endpoints. Client-only:
// it reads the browser session and has no server-rendered form.
const AuthDevtools =
	process.env.NODE_ENV === 'production'
		? () => null
		: dynamic(
				() =>
					import('better-auth-devtools/react').then(
						(m) => m.BetterAuthDevtools
					),
				{ ssr: false }
			)

// Better Auth's useSession reads a shared store, so there is no session
// provider to mount. Nothing supplied pageProps.session before either, so
// no server-rendered session is lost by dropping it.
export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
				/>
			</Head>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />
				{/* useSession consumers read a shared store and do not refetch
				    on their own, so a full reload is what makes a switched
				    session show up in Nav, AdminGate and the pages. */}
				<AuthDevtools reloadOnSessionChange />
			</QueryClientProvider>
		</>
	)
}
