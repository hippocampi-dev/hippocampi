import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Footer from "~/components/ui/Footer"
import { Header } from "~/components/ui/Header"
import { getAllPublishedBlogPosts } from "~/app/_actions/blog/actions"
import { formatDate } from "~/lib/utils"

export default async function BlogsPage() {
  const { posts, error } = await getAllPublishedBlogPosts();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="px-9 py-12">
        <section className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-light mb-12 text-center">
            Our <span className="text-darkAccent">Insights</span>
          </h1>
          
          {error ? (
            <div className="text-center py-10">
              <p>Failed to load blog posts. Please try again later.</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {posts.map((post) => (
                <Card key={post.id} className="transition-all duration-200 hover:shadow-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-2xl font-medium">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{post.summary}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                    </span>
                    <Link 
                      href={`/blogs/${post.slug}`}
                      className="text-darkAccent hover:underline"
                    >
                      Read more →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p>No blog posts available at this time.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
