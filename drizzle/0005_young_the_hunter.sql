CREATE TABLE "hippocampi_blog_posts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"featured_image" varchar(255),
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"author_id" varchar(255),
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hippocampi_blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "hippocampi_blog_posts" ADD CONSTRAINT "hippocampi_blog_posts_author_id_hippocampi_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."hippocampi_users"("id") ON DELETE set null ON UPDATE no action;