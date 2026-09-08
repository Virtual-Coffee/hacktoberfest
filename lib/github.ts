import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { account, user } from '@/db/schema'

const org = process.env.VC_GITHUB_ORG

/**
 * Members of these teams get `admin` too. Org owners always do.
 *
 * Defaulted in code rather than left to an env var so that widening or
 * narrowing admin access is a commit and a code review, and so a deploy needs
 * no out-of-band change in the Netlify UI. Note that syncing runs at request
 * time, so a netlify.toml [build.environment] entry would not reach it anyway.
 */
const DEFAULT_ADMIN_TEAMS = ['hacktoberfest-team']

const configuredTeams = (process.env.VC_GITHUB_ADMIN_TEAMS ?? '')
	.split(',')
	.map((team) => team.trim())
	.filter(Boolean)

const adminTeams = configuredTeams.length
	? configuredTeams
	: DEFAULT_ADMIN_TEAMS

/**
 * Sign-in happens inside the OAuth callback, where a little latency is
 * invisible. The resync happens inside an admin request, where it is not.
 */
const SIGN_IN_TIMEOUT_MS = 3000
const RESYNC_TIMEOUT_MS = 2000

const githubHeaders = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
}

type Membership = {
	state?: string
	role?: string
	user?: { login?: string }
}

type Role = 'admin' | 'user'

/** Distinguishes "GitHub said no" from "we could not ask". */
type Lookup<T> = { ok: true; value: T | null } | { ok: false }

async function githubGet<T>(
	url: string,
	token: string,
	timeoutMs: number
): Promise<Lookup<T>> {
	try {
		const response = await fetch(url, {
			headers: { ...githubHeaders, Authorization: `Bearer ${token}` },
			// A slow GitHub must never hang the OAuth callback.
			signal: AbortSignal.timeout(timeoutMs),
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
 * Resolves org membership and admin-team membership into `user.role`.
 *
 * The failure policy is deliberately asymmetric: a definite 404 demotes,
 * because it means the user genuinely left the org or the team, but any error
 * we cannot interpret (missing `read:org` after declining the grant, a revoked
 * token, a GitHub outage, a timeout) leaves the stored role untouched. Sign-in
 * must not fail because GitHub had a bad day, and quietly demoting someone on a
 * transient 403 is worse than briefly stale data.
 *
 * Returns the role now stored, or null when it could not be determined and the
 * stored value was deliberately left alone.
 */
async function resolveAndStoreRole(
	userId: string,
	accessToken: string,
	timeoutMs: number
): Promise<Role | null> {
	if (!org) return null

	// Scoped to the authenticated user, so it needs only `read:org` and does
	// not require the caller to already be visible as an org member.
	const membership = await githubGet<Membership>(
		`https://api.github.com/user/memberships/orgs/${org}`,
		accessToken,
		timeoutMs
	)

	if (!membership.ok) return null

	const isVcOrgMember = membership.value?.state === 'active'
	let isAdmin = isVcOrgMember && membership.value?.role === 'admin'

	const login = membership.value?.user?.login

	// Org owners are already admin and never reach the loop, so this costs them
	// nothing. Each team is one more request, so keep the configured list short.
	if (isVcOrgMember && !isAdmin && login) {
		for (const team of adminTeams) {
			const lookup = await githubGet<Membership>(
				`https://api.github.com/orgs/${org}/teams/${team}/memberships/${login}`,
				accessToken,
				timeoutMs
			)

			// Same asymmetry as the membership lookup above. Without this the
			// error would fall through to the write below and demote a
			// team-based admin on a GitHub blip.
			if (!lookup.ok) return null

			if (lookup.value?.state === 'active') {
				isAdmin = true
				break
			}
		}
	}

	const role: Role = isAdmin ? 'admin' : 'user'

	await db
		.update(user)
		.set({ isVcOrgMember, role, orgRoleSyncedAt: new Date() })
		.where(eq(user.id, userId))

	return role
}

/**
 * Resolves Virtual Coffee org membership into `user.role` on sign-in.
 *
 * Runs from the account create/update hooks because those are the only place
 * the provider access token is handed over directly, and they fire on the
 * OAuth callback -- once per sign-in rather than once per request. Admin
 * checks then read the stored role, and only call GitHub again once it goes
 * stale (see resyncGitHubOrgRole). Nothing here ever throws.
 */
export async function syncGitHubOrgRole(oauthAccount: {
	providerId: string
	userId: string
	accessToken?: string | null | undefined
}) {
	if (oauthAccount.providerId !== 'github' || !oauthAccount.accessToken) return
	// Unset locally, so development works without org access.
	if (!org) return

	try {
		await resolveAndStoreRole(
			oauthAccount.userId,
			oauthAccount.accessToken,
			SIGN_IN_TIMEOUT_MS
		)
	} catch {
		// A failed role sync must never break sign-in.
	}
}

/**
 * Re-runs the lookups for a user who already has a session, using the access
 * token stored at sign-in.
 *
 * Sign-in is otherwise the only time the role is resolved, and sessions roll
 * (7 day expiry, refreshed daily), so an active user might never re-authenticate
 * -- and someone removed from an admin team would keep `admin` indefinitely.
 *
 * Reads `account.access_token` directly rather than going through
 * `auth.api.getAccessToken`: that endpoint wants a Better Auth account id, so it
 * needs this query anyway, and GitHub OAuth-app tokens neither expire nor carry
 * a refresh token, so its refresh machinery buys nothing. The token is
 * plaintext only because `account.encryptOAuthTokens` is not enabled in
 * lib/auth.ts -- if that is ever turned on, this must decrypt.
 *
 * Returns the role now stored, or null if it could not be determined. Never
 * throws: an admin request must not 500 because GitHub or the database blinked.
 */
export async function resyncGitHubOrgRole(
	userId: string
): Promise<Role | null> {
	if (!org) return null

	try {
		const [row] = await db
			.select({ accessToken: account.accessToken })
			.from(account)
			.where(and(eq(account.userId, userId), eq(account.providerId, 'github')))
			.limit(1)

		if (!row?.accessToken) return null

		return await resolveAndStoreRole(userId, row.accessToken, RESYNC_TIMEOUT_MS)
	} catch {
		return null
	}
}
