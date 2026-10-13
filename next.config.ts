import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	agentRules: false,
	turbopack: {
		root: __dirname,
	},
	env: {
		// Mirrors the githubCredentials check in lib/auth.ts so a local checkout
		// without them leaves out a sign-in button the server has no provider
		// for. Only the yes/no reaches the bundle, never the credentials. Deploys
		// always count as configured: there the credentials are scoped to
		// Functions (README "Authentication"), so the build cannot see them.
		GITHUB_SIGN_IN_CONFIGURED: String(
			process.env.NODE_ENV !== 'development' ||
				Boolean(
					process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
				)
		),
	},
}

export default nextConfig
