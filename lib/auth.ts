import { betterAuth } from 'better-auth'
import { oAuthProxy } from 'better-auth/plugins'
import { devtools } from 'better-auth-devtools'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { db, schema } from '@/db'
import { syncGitHubOrgRole } from '@/lib/github'

const productionHost = 'hacktoberfest.virtualcoffee.io'
const productionURL = `https://${productionHost}`

// Devtools personas have no GitHub profile to take an avatar from, and the
// Nav menu button is nothing but the avatar.
const placeholderAvatar = (seed: string) =>
	`https://api.dicebear.com/10.x/initials/svg?seed=${encodeURIComponent(seed)}`

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg', schema }),

	secret: process.env.BETTER_AUTH_SECRET,

	// Replaces the NEXTAUTH_URL / AUTH_TRUST_HOST arrangement. Netlify serves
	// this site on more than one hostname, so there is no single correct base
	// URL to pin; the host is derived from the request and the allowlist is
	// what makes that safe. allowedHosts also seeds trustedOrigins, so that is
	// not maintained separately.
	//
	// Resolving the host is only half of preview sign-in; the OAuth round-trip
	// itself is handled by the oAuthProxy plugin below.
	//
	// BETTER_AUTH_URL is a local-development override only; it must stay unset
	// in every Netlify context.
	baseURL: process.env.BETTER_AUTH_URL || {
		allowedHosts: [productionHost, '*.netlify.app'],
		protocol: 'https',
		fallback: productionURL,
	},

	plugins: [
		// Deploy previews. A GitHub OAuth App accepts exactly one callback URL,
		// so a preview hostname can never finish the round-trip on its own.
		// The proxy sends GitHub to production's callback; production exchanges
		// the code, encrypts the profile with OAUTH_PROXY_SECRET, and bounces it
		// back to the preview origin, which creates the user and session in its
		// own context. Production skips the hop (request origin matches
		// productionURL), and allowedHosts above is what lets a *.netlify.app
		// origin be trusted as the return address.
		//
		// Omitted locally: BETTER_AUTH_URL means "local dev", which uses its own
		// OAuth app with a localhost callback -- left in, the proxy would rewrite
		// that redirect_uri to production's and GitHub would reject it.
		...(process.env.BETTER_AUTH_URL
			? []
			: [
					oAuthProxy({
						productionURL,
						// Must be the same value in every Netlify context. Falls
						// back to BETTER_AUTH_SECRET when unset, but keeping the
						// proxy on its own key means rotating one does not
						// invalidate the other.
						secret: process.env.OAUTH_PROXY_SECRET,
					}),
				]),

		// Local development only: a panel for creating throwaway users and
		// switching sessions, so admin pages can be worked on without a real
		// Virtual Coffee org membership. The plugin hard-disables its endpoints
		// under NODE_ENV=production (which includes deploy previews), so it is
		// safe to keep in the config unconditionally -- and it has to be, so
		// that `pnpm auth:generate` sees its devtoolsUser table. The React
		// panel is mounted in pages/_app.tsx. DEV_AUTH_ENABLED=false turns it
		// off locally without touching code.
		devtools({
			// `next dev` sets development. Opting in on that rather than `true`
			// means an unset NODE_ENV (a plain `node` process, some hosts) also
			// lands on off, without leaning on the plugin's production guard.
			enabled: process.env.NODE_ENV === 'development',
			templates: {
				user: {
					label: 'Member',
					user: { image: placeholderAvatar('Member') },
				},
				admin: {
					label: 'Admin',
					// Mirrors what syncGitHubOrgRole stores for an org admin. These
					// users have no GitHub account row, so requireAdmin's stale-role
					// resync finds no token and leaves the stored role alone.
					user: {
						role: 'admin',
						isVcOrgMember: true,
						image: placeholderAvatar('Admin'),
					},
				},
			},
			editableFields: [
				{
					key: 'role',
					label: 'Role',
					type: 'select',
					options: ['user', 'admin'],
				},
				{ key: 'isVcOrgMember', label: 'VC org member', type: 'boolean' },
			],
		}),
	],

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
