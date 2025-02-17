ALTER TABLE "hippocampi_invoices" RENAME COLUMN "amount" TO "total";--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" DROP CONSTRAINT "hippocampi_doctor_subscriptions_doctor_id_hippocampi_doctors_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_patient_doctor_management" DROP CONSTRAINT "hippocampi_patient_doctor_management_doctor_id_hippocampi_doctors_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_patient_doctor_management" DROP CONSTRAINT "hippocampi_patient_doctor_management_patient_id_hippocampi_patients_patient_id_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" ALTER COLUMN "subscription_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ALTER COLUMN "appointment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ALTER COLUMN "total" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hippocampi_doctors" ADD COLUMN "bio" text NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "hourly_rate" numeric(2) NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "duration" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_invoices" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_subscriptions" ADD CONSTRAINT "hippocampi_doctor_subscriptions_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patient_doctor_management" ADD CONSTRAINT "hippocampi_patient_doctor_management_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patient_doctor_management" ADD CONSTRAINT "hippocampi_patient_doctor_management_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" DROP COLUMN IF EXISTS "current_period_start";--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" DROP COLUMN IF EXISTS "current_period_end";