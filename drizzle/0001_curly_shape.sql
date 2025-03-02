ALTER TABLE "hippocampi_users" ADD COLUMN "mfa_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_users" ADD COLUMN "mfa_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "hippocampi_users" ADD COLUMN "mfa_secret" varchar(255);--> statement-breakpoint
ALTER TABLE "hippocampi_users" ADD COLUMN "mfa_temp_secret" varchar(255);