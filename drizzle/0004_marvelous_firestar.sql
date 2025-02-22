ALTER TABLE "hippocampi_subscriptions" DROP CONSTRAINT "hippocampi_subscriptions_user_role_hippocampi_user_roles_user_role_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_subscriptions" DROP COLUMN IF EXISTS "user_role";