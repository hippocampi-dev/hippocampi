CREATE TABLE "hippocampi_conversations" (
	"conversation_id" varchar(255) PRIMARY KEY NOT NULL,
	"patient_id" varchar(255) NOT NULL,
	"doctor_id" varchar(255) NOT NULL,
	"subject" varchar(255),
	"status" varchar(50) DEFAULT 'open',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hippocampi_messages" (
	"message_id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"read" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hippocampi_conversations" ADD CONSTRAINT "hippocampi_conversations_patient_id_hippocampi_patients_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."hippocampi_patients"("patient_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hippocampi_conversations" ADD CONSTRAINT "hippocampi_conversations_doctor_id_hippocampi_doctors_doctor_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."hippocampi_doctors"("doctor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hippocampi_messages" ADD CONSTRAINT "hippocampi_messages_conversation_id_hippocampi_conversations_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."hippocampi_conversations"("conversation_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hippocampi_messages" ADD CONSTRAINT "hippocampi_messages_sender_id_hippocampi_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE cascade ON UPDATE no action;