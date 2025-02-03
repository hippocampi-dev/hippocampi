ALTER TABLE "hippocampi_user" ADD COLUMN "name" varchar(255);--> statement-breakpoint
ALTER TABLE "hippocampi_user" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "hippocampi_user" DROP COLUMN IF EXISTS "last_name";