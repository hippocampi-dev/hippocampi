"use server"

import { db } from "~/server/db";
import { blogPosts } from "~/server/db/schema/cms";
import { eq, desc, sql } from "drizzle-orm";
import { users } from "~/server/db/schema/auth";

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: Date | null;
  featuredImage: string | null;
  author: string | null;
}

export interface BlogPostDetail extends BlogPostSummary {
  content: string;
  tags: string[] | null;
}

interface BlogPostFormData {
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  published: boolean;
  tags: string[] | null;
  authorId: string;
}

export async function getAllPublishedBlogPosts() {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        publishedAt: blogPosts.publishedAt,
        featuredImage: blogPosts.featuredImage,
        author: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));

    return { posts };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return { error: "Failed to fetch blog posts" };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        content: blogPosts.content,
        publishedAt: blogPosts.publishedAt,
        featuredImage: blogPosts.featuredImage,
        tags: blogPosts.tags,
        author: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (!post.length) return { error: "Blog post not found" };
    
    return { post: post[0] };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return { error: "Failed to fetch blog post" };
  }
}

export async function createBlogPost(data: BlogPostFormData) {
  try {
    // Check if a post with the same slug already exists
    const existingPost = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, data.slug))
      .limit(1);
    
    // If post exists, update it instead of creating new
    if (existingPost.length > 0 && existingPost[0]?.id) {
      const result = await db.update(blogPosts)
        .set({
          ...data,
          publishedAt: data.published ? new Date() : null,
        })
        .where(eq(blogPosts.id, existingPost[0].id as string))
        .returning();
      
      return { 
        success: true, 
        post: result[0], 
        message: "Existing blog post with the same slug has been updated" 
      };
    }
    
    // Otherwise, create a new post
    const result = await db.insert(blogPosts).values({
      ...data,
      publishedAt: data.published ? new Date() : null,
    }).returning();
    
    return { success: true, post: result[0] };
  } catch (error) {
    console.error("Error creating/updating blog post:", error);
    return { error: "Failed to create/update blog post" };
  }
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPostFormData> & { publishedAt?: Date | null }
) {
  try {
    // If we're publishing for the first time, set the publishedAt date
    if (data.published) {
      const existingPost = await db.select({ published: blogPosts.published })
        .from(blogPosts)
        .where(eq(blogPosts.id, id))
        .limit(1);
      
      if (existingPost.length > 0 && !existingPost[0]?.published) {
        data.publishedAt = new Date();
      }
    }

    const result = await db.update(blogPosts)
      .set(data)
      .where(eq(blogPosts.id, id))
      .returning();
    
    if (!result.length) return { error: "Blog post not found" };
    
    return { success: true, post: result[0] };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { error: "Failed to update blog post" };
  }
}

export async function getAllBlogPosts() {
  try {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        summary: blogPosts.summary,
        publishedAt: blogPosts.publishedAt,
        published: blogPosts.published,
        featuredImage: blogPosts.featuredImage,
        author: users.name,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .orderBy(desc(blogPosts.publishedAt));

    return { posts };
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    return { error: "Failed to fetch blog posts" };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { error: "Failed to delete blog post" };
  }
}

import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL_DEV
const SUPABASE_ANON_KEY = process.env.SUPABASE_API_KEY_DEV
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const openai   = new OpenAI({ apiKey: OPENAI_API_KEY })
const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)

/** Embed the user’s question */
export async function embedQuery(question: string) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
    encoding_format: 'float'
  })
  if (!data || !data[0]?.embedding) {
    throw new Error("Failed to generate embedding");
  }
  return data[0].embedding as number[]
}

/** Retrieve top‑k supporting chunks */
export async function retrieve(question: string, k = 4) {
  const queryEmbedding = await embedQuery(question)

  const { data, error } = await supabase.rpc('match_blog_chunks', {
    query_embedding: queryEmbedding,
    match_count: k
  })
  if (error) throw error
  return data as {
    blog_slug: string
    title: string
    heading: string
    url: string
    content: string
    score: number
  }[]
}
