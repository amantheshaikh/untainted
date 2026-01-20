import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Directory to store markdown files
// Directory to store markdown files
// Handle both app root and project root execution contexts
const possiblePaths = [
  path.join(process.cwd(), 'content/blog'),
  path.join(process.cwd(), 'landing-page/content/blog'),
]

export const postsDirectory = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0]

export interface BlogPost {
  slug: string
  metadata: {
    title: string
    date: string
    description?: string
    summary?: string
    tags?: string[]
    canonical?: string
    author?: string
    image?: string
    [key: string]: any
  }
  content: string
}

export function getBlogPosts(): BlogPost[] {
  // Create directory if it doesn't exist to avoid build errors
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') && !fileName.startsWith('_'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        metadata: data as BlogPost['metadata'],
        content,
      }
    })

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (new Date(a.metadata.date) > new Date(b.metadata.date)) {
      return -1
    }
    return 1
  })
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      metadata: data as BlogPost['metadata'],
      content,
    }
  } catch (error) {
    return null
  }
}
