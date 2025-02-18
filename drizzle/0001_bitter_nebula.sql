ALTER TABLE "hippocampi_invoices" ALTER COLUMN "invoice_status" SET DEFAULT 'unpaid';--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ALTER COLUMN "appointment_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ALTER COLUMN "hourly_rate" SET DATA TYPE numeric;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" DROP COLUMN IF EXISTS "duration";--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" DROP COLUMN IF EXISTS "total";