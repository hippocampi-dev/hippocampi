import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react" 
import Footer from "~/components/ui/Footer"
import { Header } from "~/components/ui/Header"
import { notFound } from "next/navigation"
import { getBlogPostBySlug } from "~/app/_actions/blog/actions"
import { formatDate } from "~/lib/utils"
import { MarkdownContent } from "~/components/blog/MarkdownContent"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const { post, error } = await getBlogPostBySlug(params.slug);

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="px-9 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/blogs" className="flex items-center text-darkAccent hover:underline mb-6">
              <ArrowLeft size={16} className="mr-2" />
              Back to all blogs
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-light mb-4">{post.title}</h1>
            <div className="flex items-center text-muted-foreground mb-8">
              {post.publishedAt && (
                <>
                  <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
                  <span className="mx-2">•</span>
                </>
              )}
              <span>{post.author || "Anonymous"}</span>
            </div>

            {post.featuredImage && (
              <div className="relative w-full h-80 md:h-96 mb-8">
                <Image 
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <MarkdownContent content={post.content} />
            
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-4 border-t">
                <h4 className="text-sm uppercase text-muted-foreground mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
