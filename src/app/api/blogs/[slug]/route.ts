import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/server/db';
import { blogPosts } from '~/server/db/schema/cms';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  if (!slug) {
    return NextResponse.json(
      { success: false, error: 'Missing slug parameter' },
      { status: 400 }
    );
  }
  
  try {
    // Fetch the blog post by slug
    const blog = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Only return published blogs unless in development
    if (!blog.published && process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      blog,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}
