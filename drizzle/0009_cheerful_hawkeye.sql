ALTER TABLE "hippocampi_appointments" ALTER COLUMN "scheduled_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "hippocampi_appointments" ALTER COLUMN "scheduled_at" SET DEFAULT now();