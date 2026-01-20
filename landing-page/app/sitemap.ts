import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.untainted.io'
  
  // Static routes
  const routes = [
    '',
    '/business',
    '/personal',
    '/how-it-works',
    '/pricing',
    '/blog',
    '/about',
    '/contact',
    '/docs',
    '/security', 
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog posts
  const posts = getBlogPosts()
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}
