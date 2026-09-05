import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import type { AppProps } from 'next/app'

// Create a client
const queryClient = new QueryClient()

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
			</QueryClientProvider>
		</>
	)
}
