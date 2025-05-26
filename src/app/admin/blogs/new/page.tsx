import { redirect } from "next/navigation";
import { BlogPostForm } from "~/components/blog/BlogPostForm";
import { auth } from "~/server/auth";

export default async function NewBlogPostPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Optional: check for admin role here if needed
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogPostForm userId={session.user.id} />
    </div>
  );
}
