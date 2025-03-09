ALTER TABLE "hippocampi_messages" ALTER COLUMN "read" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "hippocampi_messages" ADD COLUMN "time" timestamp with time zone NOT NULL;