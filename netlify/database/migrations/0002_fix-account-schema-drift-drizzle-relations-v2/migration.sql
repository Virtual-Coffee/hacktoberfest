-- account.issuer was a leftover from the next-auth -> Better Auth migration
-- (and possibly Better Auth 1.7.0-1.7.2's now-removed OIDC issuer tracking).
-- Better Auth 1.7.4 never reads or writes it, and its own CLI-generated
-- schema doesn't define it -- this drop just brings the database back in
-- line with what Better Auth actually expects.
DROP INDEX "account_issuer_accountId_uidx";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "issuer";
