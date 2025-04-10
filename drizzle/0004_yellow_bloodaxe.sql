ALTER TABLE "hippocampi_doctor_availabilities" DROP CONSTRAINT "hippocampi_doctor_availabilities_doctor_id_hippocampi_doctors_doctor_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_doctor_availabilities" ADD CONSTRAINT "hippocampi_doctor_availabilities_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
