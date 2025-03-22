DO $$ BEGIN
 CREATE TYPE "public"."notes_taken" AS ENUM('true', 'in-progress', 'to-do', 'false');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hippocampi_appointments" ADD COLUMN "notes_taken" "notes_taken" DEFAULT 'false';--> statement-breakpoint
ALTER TABLE "hippocampi_appointments" ADD COLUMN "file" varchar;