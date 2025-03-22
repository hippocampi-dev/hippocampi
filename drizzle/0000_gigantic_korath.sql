DO $$ BEGIN
 CREATE TYPE "public"."day_of_week" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."onboarding_status" AS ENUM('not-started', 'profile', 'credentials', 'pending', 'rejected', 'approved');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."appointment_status" AS ENUM('Scheduled', 'Canceled', 'Completed', 'No-Show');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."invoice_status" AS ENUM('unpaid', 'paid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."notes_taken" AS ENUM('true', 'in-progress', 'to-do', 'false');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('patient', 'doctor', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_status" AS ENUM('subscribed', 'unsubscribed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other', 'prefer_not_to_say');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."frequency" AS ENUM('daily', 'weekly', 'monthly', 'as_needed', 'prn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."relationship" AS ENUM('spouse', 'child', 'caregiver', 'parent', 'sibling', 'friend', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('open', 'closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_accounts" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hippocampi_accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_user_logins" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"affected_patient_id" varchar(255),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_verified" boolean DEFAULT false NOT NULL,
	"mfa_secret" varchar(255),
	"mfa_temp_secret" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "hippocampi_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctor_availabilities" (
	"recurring_id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_time" varchar NOT NULL,
	"end_time" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctor_credentials" (
	"doctor_id" varchar(255) PRIMARY KEY NOT NULL,
	"degree" varchar(255) NOT NULL,
	"medical_school" varchar(255) NOT NULL,
	"residency" varchar(255) NOT NULL,
	"approach" text NOT NULL,
	"date_submitted" timestamp,
	"files" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctors" (
	"doctor_id" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"date_of_birth" date NOT NULL,
	"age" integer NOT NULL,
	"gender" varchar NOT NULL,
	"primary_language" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"specialization" varchar,
	"ratings" varchar(20),
	"bio" text NOT NULL,
	"profile_url" varchar(255) NOT NULL,
	"onboarding_status" "onboarding_status" DEFAULT 'not-started',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hippocampi_doctors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_appointments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"reason" text,
	"notes" text,
	"appointment_status" "appointment_status" DEFAULT 'Scheduled' NOT NULL,
	"reviewed" boolean DEFAULT false,
	"notes_taken" "notes_taken" DEFAULT 'false',
	"file" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_consultation_notes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"appointment_id" varchar(255) NOT NULL,
	"patient_name" varchar(255) NOT NULL,
	"patient_dob" varchar(50),
	"appointment_date" varchar(50),
	"consulting_specialist" varchar(255),
	"sections" json NOT NULL,
	"medications" json,
	"is_draft" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_invoices" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"stripe_payment_id" varchar(255),
	"invoice_status" "invoice_status" DEFAULT 'unpaid' NOT NULL,
	"appointment_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"hourly_rate" numeric NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_patient_doctor_management" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"last_visit" date,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_subscriptions" (
	"doctor_id" varchar(255) PRIMARY KEY NOT NULL,
	"stripe_customer_id" varchar(255),
	"subscription_id" varchar(255),
	"subscription_status" "subscription_status" DEFAULT 'unsubscribed' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_user_roles" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_role" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_allergies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"allergen" varchar NOT NULL,
	"reaction_description" text,
	"severity_level" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_cognitive_assessments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"primary_concerns" json NOT NULL,
	"additional_support" json DEFAULT 'null'::json,
	"mental_demands" text NOT NULL,
	"cognitive_changes" text NOT NULL,
	"areas_for_help" json DEFAULT 'null'::json,
	"additional_info" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_cognitive_symptoms" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"symptom_type" varchar NOT NULL,
	"onset_date" date DEFAULT now(),
	"severity_level" varchar,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_diagnoses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"condition_name" varchar NOT NULL,
	"diagnosis_date" date NOT NULL,
	"self_reported" boolean DEFAULT false,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_emergency_contacts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"relationship" "relationship" NOT NULL,
	"phone_number" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_medical_history" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"existing_diagnoses" text DEFAULT 'n/a',
	"family_history_of_neurological_disorders" text DEFAULT 'n/a',
	"history_of_chemotherapy_or_radiation_therapy" text DEFAULT 'n/a',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_medications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"medication_name" varchar NOT NULL,
	"dosage" text NOT NULL,
	"frequency" "frequency" NOT NULL,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_patients" (
	"patient_id" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"middle_initial" varchar,
	"condition" varchar,
	"date_of_birth" date NOT NULL,
	"age" integer NOT NULL,
	"gender" "gender" NOT NULL,
	"primary_language" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"street_address" text NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
	"hipaa_compliance" boolean NOT NULL,
	"stripe_customer_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hippocampi_patients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_treatments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"treatment_name" varchar NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"notes" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_conversations" (
	"conversation_id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"subject" varchar(255),
	"status" "status" DEFAULT 'open',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_messages" (
	"message_id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"time" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_accounts" ADD CONSTRAINT "hippocampi_accounts_user_id_hippocampi_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_sessions" ADD CONSTRAINT "hippocampi_sessions_user_id_hippocampi_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_user_logins" ADD CONSTRAINT "hippocampi_user_logins_user_id_hippocampi_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_user_logins" ADD CONSTRAINT "hippocampi_user_logins_affected_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("affected_patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_availabilities" ADD CONSTRAINT "hippocampi_doctor_availabilities_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_credentials" ADD CONSTRAINT "hippocampi_doctor_credentials_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctors" ADD CONSTRAINT "hippocampi_doctors_doctor_id_hippocampi_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_appointments" ADD CONSTRAINT "hippocampi_appointments_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_appointments" ADD CONSTRAINT "hippocampi_appointments_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_consultation_notes" ADD CONSTRAINT "hippocampi_consultation_notes_appointment_id_hippocampi_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."hippocampi_appointments"("id") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "hippocampi_subscriptions" ADD CONSTRAINT "hippocampi_subscriptions_doctor_id_hippocampi_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_user_roles" ADD CONSTRAINT "hippocampi_user_roles_user_id_hippocampi_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_allergies" ADD CONSTRAINT "hippocampi_allergies_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_cognitive_assessments" ADD CONSTRAINT "hippocampi_cognitive_assessments_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_cognitive_symptoms" ADD CONSTRAINT "hippocampi_cognitive_symptoms_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_diagnoses" ADD CONSTRAINT "hippocampi_diagnoses_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_emergency_contacts" ADD CONSTRAINT "hippocampi_emergency_contacts_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_medical_history" ADD CONSTRAINT "hippocampi_medical_history_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_medications" ADD CONSTRAINT "hippocampi_medications_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patients" ADD CONSTRAINT "hippocampi_patients_patient_id_hippocampi_users_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_treatments" ADD CONSTRAINT "hippocampi_treatments_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_conversations" ADD CONSTRAINT "hippocampi_conversations_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_conversations" ADD CONSTRAINT "hippocampi_conversations_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_messages" ADD CONSTRAINT "hippocampi_messages_conversation_id_hippocampi_conversations_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."hippocampi_conversations"("conversation_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_messages" ADD CONSTRAINT "hippocampi_messages_sender_id_hippocampi_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "hippocampi_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "hippocampi_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_user_idx" ON "hippocampi_user_logins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_action_idx" ON "hippocampi_user_logins" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_patient_idx" ON "hippocampi_user_logins" USING btree ("affected_patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_doctor_idx" ON "hippocampi_appointments" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_patient_idx" ON "hippocampi_appointments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_date_idx" ON "hippocampi_appointments" USING btree ("scheduled_at");