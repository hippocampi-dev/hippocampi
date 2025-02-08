ALTER TABLE "hippocampi_doctor_credentials" DROP CONSTRAINT "hippocampi_doctor_credentials_specialization_hippocampi_doctors_specialization_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_credentials" DROP COLUMN IF EXISTS "specialization";