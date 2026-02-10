"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function CommentSection({ postId, initialComments = [] }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      })

      if (res.ok) {
        const newComment = await res.json()
        setComments([newComment, ...comments])
        setContent("")
      } else if (res.status === 401) {
        alert("Please log in to comment")
      } else {
        alert("Failed to post comment")
      }
    } catch (err) {
      console.error(err)
      alert("Error posting comment")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId))
      } else if (res.status === 403) {
        alert("You don't have permission to delete this comment")
      } else {
        alert("Failed to delete comment")
      }
    } catch (e) {
      console.error(e)
      alert("Error deleting comment")
    }
  }

  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {session ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-800"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full bg-gray-800 text-white rounded border border-gray-700 p-3 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-gray-400">
          <a href="/login" className="text-blue-400 hover:text-blue-300">
            Log in
          </a>{" "}
          to comment
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">
                    {comment.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(comment.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                {session && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-3 text-gray-200 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
