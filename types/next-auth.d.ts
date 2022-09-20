import { JWT } from 'next-auth/jwt'
import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface User {
		id: string
		name: string
		email: string | null
		image?: string
		login: string
		twitter_username?: string
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		/** The user's auth_id */
		auth_id: string
	}
}
