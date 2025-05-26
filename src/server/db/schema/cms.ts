import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  serial,
  pgEnum,
  vector
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { patients } from "./patient";
import { createTable } from "./schema";
import { timestamps } from "./utils";
import { users } from "./auth";

// Blog Posts
export const blogPosts = createTable("blog_posts", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image", { length: 255 }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("published_at", {
    mode: "date",
    withTimezone: true,
  }),
  authorId: varchar("author_id", { length: 255 })
    .references(() => users.id, { onDelete: "set null" }),
  tags: text("tags").array(),
  ...timestamps
});

// Blog Chunks for vector search/embeddings
export const blogChunks = createTable("blog_chunks", {
  id: serial("id").primaryKey(),
  blogSlug: text("blog_slug").notNull(),
  title: text("title"),
  heading: text("heading"),
  url: text("url"),
  chunkIndex: integer("chunk_index"), // order inside the blog
  content: text("content"), // raw chunk
  embedding: vector("embedding", { dimensions: 1536 }), // OpenAI text-embedding-3-small dimension
  createdAt: timestamp("created_at", { 
    withTimezone: true 
  }).defaultNow(),
});

// Add index for efficient vector search
export const blogChunksEmbeddingIndex = sql`
  CREATE INDEX IF NOT EXISTS blog_chunks_embedding_idx 
  ON blog_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
`;