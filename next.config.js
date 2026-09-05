/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,
	agentRules: false,
	turbopack: {
		root: __dirname,
	},
}

module.exports = nextConfig
