-- Backing table for the better-auth-devtools plugin (lib/auth.ts): one row
-- per throwaway user created from the local dev panel. The plugin refuses
-- every request under NODE_ENV=production, so on Netlify this table exists
-- only because the schema is generated from one config and stays empty.
--
-- Authored by drizzle-kit (`pnpm db:generate`) and copied here verbatim.
CREATE TABLE "devtools_user" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL UNIQUE,
	"template_key" text NOT NULL,
	"label" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devtools_user" ADD CONSTRAINT "devtools_user_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
