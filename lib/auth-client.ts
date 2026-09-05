import { createAuthClient } from 'better-auth/react'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import type { auth } from '@/lib/auth'

// The `auth` import is type-only, so it erases at compile time under
// isolatedModules and the server config -- including the GitHub client secret
// -- never reaches the browser bundle. inferAdditionalFields is what carries
// githubLogin/role/etc. onto session.user with real types instead of `any`.
export const authClient = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>()],
})

export type AppSession = typeof authClient.$Infer.Session
export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * Better Auth returns `{ data, isPending }` where next-auth returned
 * `{ data, status }`. This maps one onto the other so the render guards and
 * TanStack Query `enabled` flags already spread across the pages keep working
 * unchanged.
 */
export function useSessionStatus() {
	const { data, isPending, error, refetch } = authClient.useSession()

	const status: SessionStatus = isPending
		? 'loading'
		: data
			? 'authenticated'
			: 'unauthenticated'

	return { data, status, isPending, error, refetch }
}

export function signInWithGitHub(callbackURL = '/dashboard') {
	return authClient.signIn.social({ provider: 'github', callbackURL })
}

export function signOut(onSuccess?: () => void) {
	return authClient.signOut({ fetchOptions: { onSuccess } })
}
