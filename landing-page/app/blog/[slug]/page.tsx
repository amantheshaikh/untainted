import { getBlogPosts, getBlogPost } from '@/lib/blog'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'

import { Callout } from '@/components/mdx/Callout'
import { CTA } from '@/components/mdx/CTA'

// Standard components to use in MDX
const components = {
  Callout,
  CTA,
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) {
    return {}
  }
  return {
    title: `${post.metadata.title} - Untainted`,
    description: post.metadata.description || post.metadata.summary,
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.metadata.title,
    "description": post.metadata.description || post.metadata.summary,
    "datePublished": post.metadata.date,
    "author": {
      "@type": "Person",
      "name": post.metadata.author || "Untainted Team",
    },
    "url": `https://www.untainted.io/blog/${post.slug}`,
    ...(post.metadata.image && { "image": post.metadata.image }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <article className="container max-w-3xl mx-auto px-6">
          <div className="mb-10 text-center">
             <Link href="/blog" className="inline-block mb-6 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
               ← Back to Blog
             </Link>
             <time className="block text-sm text-muted-foreground mb-2">
               {post.metadata.date}
             </time>
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
               {post.metadata.title}
             </h1>
             {post.metadata.author && (
               <div className="flex justify-center items-center mt-4">
                  <span className="text-sm font-medium text-foreground">
                    by {post.metadata.author}
                  </span>
               </div>
             )}
          </div>

          <div className="prose prose-lg dark:prose-invert prose-orange mx-auto">
            <MDXRemote
              source={post.content}
              components={components}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
