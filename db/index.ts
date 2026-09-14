import { getDatabase, MissingDatabaseConnectionError } from '@netlify/database'
import { drizzle } from 'drizzle-orm/netlify-db'
import type { NetlifyDbDatabase } from 'drizzle-orm/netlify-db'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export type Database =
	| NetlifyDbDatabase<typeof schema.allRelations>
	| NodePgDatabase<typeof schema.allRelations>

let instance: Database | null = null

function connect(): Database {
	let connection

	try {
		connection = getDatabase()
	} catch (error) {
		if (error instanceof MissingDatabaseConnectionError) {
			// By far the most common cause: the dev server was started with
			// `next` directly instead of `netlify dev`, which is what starts
			// the local Postgres and injects its connection string.
			throw new Error(
				'No database connection available. Run `pnpm dev` (which runs ' +
					'`netlify dev`) rather than starting Next directly -- the local ' +
					'database only starts alongside the Netlify dev server.',
				{ cause: error }
			)
		}
		throw error
	}

	// getDatabase() resolves the connection (and driver: neon's serverless
	// pool in deployed functions, a plain pg pool locally) via
	// NETLIFY_DB_URL/NETLIFY_DB_DRIVER; drizzle-orm's netlify-db driver
	// accepts that same client shape directly and picks the matching
	// implementation for us.
	return drizzle({ client: connection, relations: schema.allRelations })
}

/**
 * Connects on first use rather than at import time, so that pulling the
 * schema into a module during `next build` does not require a live database.
 */
export const db: Database = new Proxy({} as Database, {
	get(_target, property, receiver) {
		instance ??= connect()
		return Reflect.get(instance, property, receiver)
	},
})

export { schema }
