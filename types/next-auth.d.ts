import type { DefaultSession } from 'next-auth'

export type GitHubUser = {
	id: string | number
	name?: string | null
	email?: string | null
	image?: string | null
	login: string
	twitter_username?: string | null
}

export type MemberProfile = {
	profile_id: string
	GitHubUsername?: string
	TwitterUsername?: string
	PreferredTimeZone?: string
	Pronouns?: string
	Email?: string
	IsMember?: boolean
	AllowSocialSharing?: boolean
}

declare module 'next-auth' {
	interface User {
		login: string
		twitter_username?: string | null
	}

	interface Session extends DefaultSession {
		githubUser: GitHubUser
		profile: MemberProfile
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		auth_id: string
		githubUser: GitHubUser
	}
}
