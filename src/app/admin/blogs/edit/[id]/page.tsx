import { redirect } from "next/navigation";
import { BlogPostForm } from "~/components/blog/BlogPostForm";
import { db } from "~/server/db";
import { blogPosts } from "~/server/db/schema/cms";
import { eq } from "drizzle-orm";
import { auth } from "~/server/auth";

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Optional: check for admin role here if needed
  
  // Fetch the blog post to edit
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, params.id),
  });
  
  if (!post) {
    redirect("/admin/blogs");
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogPostForm 
        userId={session.user.id}
        defaultValues={{
          ...post,
          authorId: post.authorId === null ? undefined : post.authorId,
        }}
        isEditing={true}
        postId={params.id}
      />
    </div>
  );
}
