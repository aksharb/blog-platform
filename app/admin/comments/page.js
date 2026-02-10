import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteComment from "@/components/DeleteComment"

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, post: { select: { title: true, id: true } } },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
          <Link href="/admin" className="text-sm text-gray-600 hover:underline">Back</Link>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          {comments.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No comments found.</p>
          ) : (
            <ul className="divide-y">
              {comments.map((c) => (
                <li key={c.id} className="py-4 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{c.author?.name || "Anonymous"}</div>
                    <div className="text-sm text-gray-600">on <Link href={`/posts/${c.post.id}`} className="text-blue-600 hover:underline">{c.post.title}</Link></div>
                    <p className="text-sm text-gray-700 mt-2">{c.content}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <DeleteComment commentId={c.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
