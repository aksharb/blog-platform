import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"

// 1. Fetch data for the specific post
async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  if (!post) return null
  return post
}

export default async function PostPage({ params }) {
  // Await params correctly for Next.js 15+ (if applicable, safe for 14 too)
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto py-16 px-6">
      <Link
        href="/"
        className="text-sm text-gray-500 hover:text-black mb-8 block"
      >
        ← Back to Home
      </Link>

      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 text-sm">
          <span>By {post.author.name || "Anonymous"}</span>
          <span className="mx-2">•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {/* Render content preserving whitespace */}
      <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
        {post.content}
      </div>
    </article>
  )
}
