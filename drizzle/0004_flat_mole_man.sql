ALTER TABLE "hippocampi_invoices" ALTER COLUMN "appointment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "hourly_rate" numeric(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "total" numeric(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "hippocampi_patients" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" DROP COLUMN "amount";