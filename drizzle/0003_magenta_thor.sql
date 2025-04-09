ALTER TABLE "hippocampi_appointments" DROP CONSTRAINT "hippocampi_appointments_doctor_id_hippocampi_doctors_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_appointments" DROP CONSTRAINT "hippocampi_appointments_patient_id_hippocampi_patients_patient_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_appointments" ADD CONSTRAINT "hippocampi_appointments_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_appointments" ADD CONSTRAINT "hippocampi_appointments_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
