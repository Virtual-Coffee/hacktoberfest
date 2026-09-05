import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	agentRules: false,
	turbopack: {
		root: __dirname,
	},
}

export default nextConfig
