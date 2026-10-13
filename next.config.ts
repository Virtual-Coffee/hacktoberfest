import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	agentRules: false,
	turbopack: {
		root: __dirname,
	},
	env: {
		// Mirrors the githubCredentials check in lib/auth.ts so the browser can
		// leave out a sign-in button the server has no provider for. Only the
		// yes/no reaches the bundle, never the credentials.
		GITHUB_SIGN_IN_CONFIGURED: String(
			Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
		),
	},
}

export default nextConfig
