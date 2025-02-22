DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('patient', 'doctor', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hippocampi_doctor_subscriptions" RENAME TO "hippocampi_subscriptions";--> statement-breakpoint
ALTER TABLE "hippocampi_subscriptions" DROP CONSTRAINT "hippocampi_doctor_subscriptions_doctor_id_hippocampi_doctors_doctor_id_fk";
--> statement-breakpoint
ALTER TABLE "hippocampi_user_roles" ALTER COLUMN "user_role" SET DATA TYPE user_role;--> statement-breakpoint
ALTER TABLE "hippocampi_subscriptions" ADD COLUMN "user_role" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_subscriptions" ADD CONSTRAINT "hippocampi_subscriptions_doctor_id_hippocampi_users_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hippocampi_subscriptions" ADD CONSTRAINT "hippocampi_subscriptions_user_role_hippocampi_user_roles_user_role_fk" FOREIGN KEY ("user_role") REFERENCES "public"."hippocampi_user_roles"("user_role") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
