DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('scheduled', 'canceled', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non_binary', 'other', 'prefer_not_to_say');
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
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "hippocampi_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctor_credentials" (
	"doctorId" varchar(255) PRIMARY KEY NOT NULL,
	"degree" varchar(255) NOT NULL,
	"medical_school" varchar(255) NOT NULL,
	"residency" varchar(255) NOT NULL,
	"approach" text NOT NULL,
	"specialization" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_doctors" (
	"doctorId" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"location" text NOT NULL,
	"specialization" varchar,
	"ratings" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_patient_doctor_management" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_scheduled_meetings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"scheduled_at" timestamp (0) with time zone NOT NULL,
	"status" "status" DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_user_roles" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_role" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_allergies" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctorId" varchar(255) NOT NULL,
	"allergen" varchar NOT NULL,
	"reaction_description" text,
	"severity_level" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_cognitive_symptoms" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctorId" varchar(255) NOT NULL,
	"symptom_type" varchar NOT NULL,
	"onset_date" date DEFAULT now(),
	"severity_level" numeric,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_diagnoses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctorId" varchar(255) NOT NULL,
	"condition_name" varchar NOT NULL,
	"diagnosis_date" date NOT NULL,
	"status" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_emergency_contacts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctorId" varchar(255) NOT NULL,
	"name" varchar NOT NULL,
	"relationship" "relationship" NOT NULL,
	"phone_number" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_medications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"doctorId" varchar(255) NOT NULL,
	"medication_name" varchar NOT NULL,
	"dosage" text NOT NULL,
	"frequency" "frequency" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hippocampi_patients" (
	"patientId" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"middle_initial" varchar,
	"date" date NOT NULL,
	"gender" "gender" NOT NULL,
	"primary_language" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"email" varchar(255) NOT NULL,
	"street_address" text NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
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
 ALTER TABLE "hippocampi_user_logins" ADD CONSTRAINT "hippocampi_user_logins_affected_patient_id_hippocampi_patients_patientId_fk" FOREIGN KEY ("affected_patient_id") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_credentials" ADD CONSTRAINT "hippocampi_doctor_credentials_doctorId_hippocampi_doctors_doctorId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_doctors"("doctorId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_credentials" ADD CONSTRAINT "hippocampi_doctor_credentials_specialization_hippocampi_doctors_specialization_fk" FOREIGN KEY ("specialization") REFERENCES "public"."hippocampi_doctors"("specialization") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctors" ADD CONSTRAINT "hippocampi_doctors_doctorId_hippocampi_users_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctors" ADD CONSTRAINT "hippocampi_doctors_email_hippocampi_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."hippocampi_users"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patient_doctor_management" ADD CONSTRAINT "hippocampi_patient_doctor_management_doctor_id_hippocampi_doctors_doctorId_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctorId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patient_doctor_management" ADD CONSTRAINT "hippocampi_patient_doctor_management_patient_id_hippocampi_patients_patientId_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_scheduled_meetings" ADD CONSTRAINT "hippocampi_scheduled_meetings_doctor_id_hippocampi_doctors_doctorId_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctorId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_scheduled_meetings" ADD CONSTRAINT "hippocampi_scheduled_meetings_patient_id_hippocampi_patients_patientId_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "hippocampi_allergies" ADD CONSTRAINT "hippocampi_allergies_doctorId_hippocampi_patients_patientId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_cognitive_symptoms" ADD CONSTRAINT "hippocampi_cognitive_symptoms_doctorId_hippocampi_patients_patientId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_diagnoses" ADD CONSTRAINT "hippocampi_diagnoses_doctorId_hippocampi_patients_patientId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_emergency_contacts" ADD CONSTRAINT "hippocampi_emergency_contacts_doctorId_hippocampi_patients_patientId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_medications" ADD CONSTRAINT "hippocampi_medications_doctorId_hippocampi_patients_patientId_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."hippocampi_patients"("patientId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patients" ADD CONSTRAINT "hippocampi_patients_patientId_hippocampi_users_id_fk" FOREIGN KEY ("patientId") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_patients" ADD CONSTRAINT "hippocampi_patients_email_hippocampi_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."hippocampi_users"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "hippocampi_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "hippocampi_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_user_idx" ON "hippocampi_user_logins" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_action_idx" ON "hippocampi_user_logins" USING btree ("action");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_logins_patient_idx" ON "hippocampi_user_logins" USING btree ("affected_patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_doctor_idx" ON "hippocampi_scheduled_meetings" USING btree ("doctor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_patient_idx" ON "hippocampi_scheduled_meetings" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "meeting_date_idx" ON "hippocampi_scheduled_meetings" USING btree ("scheduled_at");