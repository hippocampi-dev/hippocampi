DO $$ BEGIN
 CREATE TYPE "public"."onboarding_status" AS ENUM('not-started', 'profile', 'credentials', 'pending-approval', 'approved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "date_of_birth" date NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "gender" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "primary_language" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "phone_number" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "onboarding_status" "onboarding_status" DEFAULT 'not-started';--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" DROP COLUMN IF EXISTS "location";