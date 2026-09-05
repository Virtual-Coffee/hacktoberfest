import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { user } from '@/db/schema'

const org = process.env.VC_GITHUB_ORG
/** Optional: members of this team also get `admin`, alongside org owners. */
const adminTeam = process.env.VC_GITHUB_ADMIN_TEAM

const githubHeaders = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
}

type Membership = {
	state?: string
	role?: string
	user?: { login?: string }
}

/** Distinguishes "GitHub said no" from "we could not ask". */
type Lookup<T> = { ok: true; value: T | null } | { ok: false }

async function githubGet<T>(url: string, token: string): Promise<Lookup<T>> {
	try {
		const response = await fetch(url, {
			headers: { ...githubHeaders, Authorization: `Bearer ${token}` },
			// A slow GitHub must never hang the OAuth callback.
			signal: AbortSignal.timeout(3000),
		})

		// 404 is a normal answer here -- it means "not a member" -- so it is a
		// successful lookup with an empty result, not a failure.
		if (response.status === 404) return { ok: true, value: null }
		if (!response.ok) return { ok: false }

		return { ok: true, value: (await response.json()) as T }
	} catch {
		return { ok: false }
	}
}

/**
 * Resolves Virtual Coffee org membership into `user.role` on sign-in.
 *
 * Runs from the account create/update hooks because those are the only place
 * the provider access token is handed over directly, and they fire on the
 * OAuth callback -- once per sign-in rather than once per request. Admin
 * checks then read the stored role and never call GitHub.
 *
 * The failure policy is deliberately asymmetric: a definite 404 demotes,
 * because it means the user genuinely left the org, but any error we cannot
 * interpret (missing `read:org` after declining the grant, a revoked token,
 * a GitHub outage, a timeout) leaves the stored role untouched. Sign-in must
 * not fail because GitHub had a bad day, and quietly demoting someone on a
 * transient 403 is worse than briefly stale data. Nothing here ever throws.
 */
export async function syncGitHubOrgRole(account: {
	providerId: string
	userId: string
	accessToken?: string | null | undefined
}) {
	if (account.providerId !== 'github' || !account.accessToken) return
	// Unset locally, so development works without org access.
	if (!org) return

	// Scoped to the authenticated user, so it needs only `read:org` and does
	// not require the caller to already be visible as an org member.
	const membership = await githubGet<Membership>(
		`https://api.github.com/user/memberships/orgs/${org}`,
		account.accessToken
	)

	if (!membership.ok) return

	const isVcOrgMember = membership.value?.state === 'active'
	let isAdmin = isVcOrgMember && membership.value?.role === 'admin'

	const login = membership.value?.user?.login
	if (isVcOrgMember && !isAdmin && adminTeam && login) {
		const team = await githubGet<Membership>(
			`https://api.github.com/orgs/${org}/teams/${adminTeam}/memberships/${login}`,
			account.accessToken
		)
		if (team.ok && team.value?.state === 'active') isAdmin = true
	}

	await db
		.update(user)
		.set({
			isVcOrgMember,
			role: isAdmin ? 'admin' : 'user',
			orgRoleSyncedAt: new Date(),
		})
		.where(eq(user.id, account.userId))
}
