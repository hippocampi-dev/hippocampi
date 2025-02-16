ALTER TYPE "status" ADD VALUE 'subscribed';--> statement-breakpoint
ALTER TYPE "status" ADD VALUE 'unsubscribed';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctor_subscriptions" (
	"doctor_id" varchar(255) PRIMARY KEY NOT NULL,
	"subscription_id" varchar(255) NOT NULL,
	"status" "status" DEFAULT 'unsubscribed' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_invoices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_invoice_id" varchar(255),
	"appointment_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"amount" numeric(2),
	"status" "status" DEFAULT 'unpaid' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hippocampi_patient_doctor_management" ALTER COLUMN "last_visit" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_medications" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_patients" ALTER COLUMN "condition" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_subscriptions" ADD CONSTRAINT "hippocampi_doctor_subscriptions_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_invoices" ADD CONSTRAINT "hippocampi_invoices_appointment_id_hippocampi_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."hippocampi_appointments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_invoices" ADD CONSTRAINT "hippocampi_invoices_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_invoices" ADD CONSTRAINT "hippocampi_invoices_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
