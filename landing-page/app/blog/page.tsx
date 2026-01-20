import NextImage from 'next/image'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ArrowRight, Calendar, User } from 'lucide-react'

export const metadata = {
  title: 'Blog - Untainted',
  description: 'Latest news, product updates, and insights from the Untainted team.',
}

export default function BlogIndex() {
  const posts = getBlogPosts()
  
  // Logic to find featured post or default to most recent
  const featuredPost = posts.find(p => p.metadata.featured) || posts[0]
  const otherPosts = posts.filter(p => p.slug !== featuredPost?.slug)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Resources & <br/> <span className="text-primary">Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Deep dives into food intelligence, compliance, and the future of safe commerce.
            </p>
          </div>

          {/* Featured Post Hero */}
          {featuredPost && (
            <div className="mb-20">
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Featured Story</p>
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <article className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Image */}
                        <div className="aspect-video w-full bg-secondary/30 rounded-2xl overflow-hidden relative border border-border">
                            {featuredPost.metadata.image ? (
                                <NextImage
                                    src={featuredPost.metadata.image}
                                    alt={featuredPost.metadata.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
                            )}
                            
                            {/* Overlay Effect */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {featuredPost.metadata.date}
                                </span>
                                {featuredPost.metadata.author && (
                                    <span className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        {featuredPost.metadata.author}
                                    </span>
                                )}
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                                {featuredPost.metadata.title}
                            </h2>
                            
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {featuredPost.metadata.description}
                            </p>

                            <div className="inline-flex items-center gap-2 text-primary font-bold mt-4 group-hover:translate-x-2 transition-transform">
                                Read Article <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </article>
                </Link>
            </div>
          )}

          {/* Divider */}
          <div className="h-px w-full bg-border/50 mb-16" />

          {/* Grid of Other Posts */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Latest Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {otherPosts.map((post) => (
                    <article key={post.slug} className="group flex flex-col h-full">
                        <Link href={`/blog/${post.slug}`} className="block mb-4 overflow-hidden rounded-xl border border-border bg-secondary/20 aspect-video relative">
                             {post.metadata.image ? (
                                <NextImage 
                                    src={post.metadata.image} 
                                    alt={post.metadata.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                             ) : (
                                <div className="w-full h-full bg-gray-100/50 flex items-center justify-center text-gray-300 text-2xl group-hover:scale-105 transition-transform duration-500">
                                    📝
                                </div>
                             )}
                        </Link>
                        
                        <div className="flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                {post.metadata.tags?.slice(0, 1).map(tag => (
                                    <span key={tag} className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    {post.metadata.title}
                                </Link>
                            </h3>
                            
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                                {post.metadata.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/30">
                                <span>{post.metadata.date}</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-primary font-medium">
                                    Read <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="rounded-3xl bg-secondary p-8 md:p-12 text-center max-w-4xl mx-auto border border-border">
            <h3 className="text-2xl font-bold mb-4">Stay untainted.</h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Get the latest updates on food intelligence standards, regulatory changes, and platform features delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Subscribe
                </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
