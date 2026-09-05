import { getDatabase, MissingDatabaseConnectionError } from '@netlify/database'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless'
import { drizzle as drizzleNodePg } from 'drizzle-orm/node-postgres'
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import * as schema from './schema'

export type Database = PgDatabase<PgQueryResultHKT, typeof schema>

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

	// getDatabase() picks the driver for the environment: neon's serverless
	// pool in deployed functions, a plain pg pool locally. They expose the
	// same query surface, so both branches widen to PgDatabase.
	return connection.driver === 'serverless'
		? drizzleNeon(connection.pool, { schema })
		: drizzleNodePg(connection.pool, { schema })
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
