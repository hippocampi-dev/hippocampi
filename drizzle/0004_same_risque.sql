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
DO $$ BEGIN
 ALTER TABLE "hippocampi_cognitive_assessments" ADD CONSTRAINT "hippocampi_cognitive_assessments_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
