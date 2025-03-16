DROP INDEX IF EXISTS "meeting_date_idx";--> statement-breakpoint
ALTER TABLE "hippocampi_appointments" DROP COLUMN IF EXISTS "scheduled_at";