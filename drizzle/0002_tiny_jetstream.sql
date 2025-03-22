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
DO $$ BEGIN
 ALTER TABLE "hippocampi_consultation_notes" ADD CONSTRAINT "hippocampi_consultation_notes_appointment_id_hippocampi_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."hippocampi_appointments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
