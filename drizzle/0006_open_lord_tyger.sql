ALTER TABLE "hippocampi_conversations" ALTER COLUMN "status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "public"."hippocampi_appointments" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."hippocampi_doctor_subscriptions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."hippocampi_invoices" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."hippocampi_conversations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('open', 'closed');--> statement-breakpoint
ALTER TABLE "public"."hippocampi_appointments" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "public"."hippocampi_doctor_subscriptions" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "public"."hippocampi_invoices" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "public"."hippocampi_conversations" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";