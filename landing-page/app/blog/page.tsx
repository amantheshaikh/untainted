import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Blog - Untainted',
  description: 'Latest news, product updates, and insights from the Untainted team.',
}

export default function BlogIndex() {
  const posts = getBlogPosts()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Blog</h1>
            <p className="text-muted-foreground text-lg">
              News, updates, and deep dives into food intelligence.
            </p>
          </div>

          <div className="grid gap-10">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article key={post.slug} className="group relative flex flex-col items-start">
                  <h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.metadata.title}
                    </Link>
                  </h2>
                  <time className="relative z-10 order-first mb-3 flex items-center text-sm text-muted-foreground pl-3.5">
                    <span className="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                      <span className="h-4 w-0.5 rounded-full bg-border" />
                    </span>
                    {post.metadata.date}
                  </time>
                  <p className="relative z-10 mt-2 text-muted-foreground text-base leading-relaxed">
                    {post.metadata.description || post.metadata.summary}
                  </p>
                  <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                    Read article
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="ml-1 h-4 w-4 stroke-current"
                    >
                      <path
                        d="M6.75 5.75 9.25 8l-2.5 2.25"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </article>
              ))
            ) : (
               <p className="text-muted-foreground">No posts found.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
