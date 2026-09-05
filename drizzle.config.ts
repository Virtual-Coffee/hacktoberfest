import { defineConfig } from 'drizzle-kit'

/**
 * drizzle-kit is used only to AUTHOR migration SQL, never to apply it.
 * Netlify owns migration state and applies `netlify/database/migrations` on
 * deploy, so running `drizzle-kit migrate` or `drizzle-kit push` against this
 * project would change the schema behind Netlify's back and desync its ledger.
 *
 * `out` is drizzle-kit's own bookkeeping directory: it holds the snapshots
 * that let `pnpm db:generate` diff the schema against what has already been
 * migrated. It is committed because those snapshots are what make the diff
 * correct on another machine -- but it is not what gets applied.
 *
 * To change the schema:
 *   1. edit db/schema/app.ts
 *   2. pnpm db:generate            -- writes SQL + a snapshot into db/.drizzle
 *   3. netlify database migrations new -d <description>
 *   4. copy the new SQL into that migration file
 */
export default defineConfig({
	dialect: 'postgresql',
	schema: './db/schema/index.ts',
	out: './db/.drizzle',
})
