import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db, schema } from '@/db'

const productionHost = 'hacktoberfest.virtualcoffee.io'

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),

	secret: process.env.BETTER_AUTH_SECRET,

	// Replaces the NEXTAUTH_URL / AUTH_TRUST_HOST arrangement. Deploy previews
	// and branch deploys each get their own hostname, so there is no single
	// correct base URL to pin -- a static value breaks preview sign-in. The
	// allowlist is what makes deriving the host from the request safe, and it
	// also seeds trustedOrigins, so that is not maintained separately.
	//
	// BETTER_AUTH_URL is a local-development override only; it must stay unset
	// in every Netlify context.
	baseURL: process.env.BETTER_AUTH_URL || {
		allowedHosts: [productionHost, '*.netlify.app'],
		protocol: 'https',
		fallback: `https://${productionHost}`,
	},

	advanced: {
		// Netlify functions sit behind a proxy, so the real hostname arrives as
		// x-forwarded-host. Better Auth ignores that header unless this is on.
		// Spoofing it is not useful: a forged host still has to match
		// allowedHosts above.
		trustedProxyHeaders: true,
	},

	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			// read:org backs the Virtual Coffee membership check that decides
			// the admin role. Adding it sends existing users through GitHub's
			// re-consent screen on their next sign-in.
			scope: ['read:user', 'user:email', 'read:org'],
			mapProfileToUser: (profile) => ({
				githubLogin: profile.login,
				githubId: String(profile.id),
				twitterUsername: profile.twitter_username ?? null,
			}),
		},
	},

	user: {
		additionalFields: {
			// Identity, set by mapProfileToUser above -- so these must accept input.
			githubLogin: { type: 'string', required: false },
			githubId: { type: 'string', required: false },
			twitterUsername: { type: 'string', required: false },

			// Authorization. input: false keeps clients from setting their own
			// role; these are written server-side from the GitHub org check.
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false,
			},
			isVcOrgMember: {
				type: 'boolean',
				required: false,
				defaultValue: false,
				input: false,
			},
			orgRoleSyncedAt: { type: 'date', required: false, input: false },
		},
	},
})

export type AuthInstance = typeof auth
