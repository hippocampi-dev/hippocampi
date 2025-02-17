ALTER TABLE "hippocampi_patients" ADD COLUMN "hipaa_compliance" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_patients" DROP COLUMN IF EXISTS "hippa_compliance";