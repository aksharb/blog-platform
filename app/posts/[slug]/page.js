import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import CommentSection from "@/app/components/CommentSection"

async function getPost(slug) {
  return await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export default async function PostPage({ params }) {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30">
      <article className="max-w-3xl mx-auto py-16 px-6">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-blue-400 mb-12 inline-block transition-colors"
        >
          ← Back to Feed
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-400 text-sm font-medium">
            <span className="bg-gray-800 px-2 py-1 rounded text-gray-300">
              {post.author.name || "Admin"}
            </span>
            <span className="mx-3 opacity-30">|</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        <hr className="my-12 border-white/10" />
        <CommentSection postId={post.id} initialComments={post.comments} />
      </article>
    </div>
  )
}
