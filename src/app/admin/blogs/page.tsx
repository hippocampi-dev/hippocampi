import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDate } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { getAllBlogPosts } from "~/app/_actions/blog/actions";
import { auth } from "~/server/auth";

export default async function AdminBlogsPage() {
  // Check if user is authenticated and is an admin
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // Note: Add your admin role check here if needed
  
  const { posts, error } = await getAllBlogPosts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">Create New Post</Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.published ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {post.publishedAt
                        ? formatDate(post.publishedAt)
                        : "Not published"}
                    </TableCell>
                    <TableCell>{post.author || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blogs/${post.slug}`} target="_blank">
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/blogs/edit/${post.id}`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No blog posts found. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
