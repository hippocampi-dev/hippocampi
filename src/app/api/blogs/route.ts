import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { blogPosts } from '~/server/db/schema/cms';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch published blog posts
    const blogs = await db.query.blogPosts.findMany({
      where: eq(blogPosts.published, true),
      orderBy: (blogs, { desc }) => [desc(blogs.publishedAt)],
    });

    return NextResponse.json({ 
      blogs,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
