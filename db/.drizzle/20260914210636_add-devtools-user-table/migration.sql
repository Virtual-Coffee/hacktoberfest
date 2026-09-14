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