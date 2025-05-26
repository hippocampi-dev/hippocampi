CREATE TABLE "hippocampi_blog_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_slug" text NOT NULL,
	"title" text,
	"heading" text,
	"url" text,
	"chunk_index" integer,
	"content" text,
	"embedding" text,
	"created_at" timestamp with time zone DEFAULT now()
);
