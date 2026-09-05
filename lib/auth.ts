import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { db, schema } from '@/db'
import { syncGitHubOrgRole } from '@/lib/github'

const productionHost = 'hacktoberfest.virtualcoffee.io'

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),

	secret: process.env.BETTER_AUTH_SECRET,

	// Replaces the NEXTAUTH_URL / AUTH_TRUST_HOST arrangement. Netlify serves
	// this site on more than one hostname, so there is no single correct base
	// URL to pin; the host is derived from the request and the allowlist is
	// what makes that safe. allowedHosts also seeds trustedOrigins, so that is
	// not maintained separately.
	//
	// Note this does NOT make sign-in work on deploy previews. A GitHub OAuth
	// App accepts exactly one callback URL, so the per-PR hostnames can never
	// complete the OAuth round-trip no matter what base URL we resolve.
	// Previews render fine signed out; authenticated flows are verified
	// locally and on production. Fixing it properly would mean a GitHub App
	// (which allows multiple callbacks) or an OAuth proxy.
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

	databaseHooks: {
		account: {
			// create fires on first sign-in, update on every one after it, when
			// Better Auth writes back the refreshed access token. Together they
			// keep the stored role current without a GitHub call per request.
			create: { after: syncGitHubOrgRole },
			update: { after: syncGitHubOrgRole },
		},
	},
})

export type AuthInstance = typeof auth
