"use client"

import { useRouter } from "next/navigation"

// Small client helper to delete a comment.
// Confirms with the user, calls the DELETE API, and refreshes UI on success.
export default function DeleteComment({ commentId }) {
  const router = useRouter()

  const handleDelete = async () => {
    const ok = confirm(
      "Are you sure you want to delete this comment? This action cannot be undone."
    )
    if (!ok) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" })
      if (res.ok) {
        // Refresh server-side rendered data to reflect deletion.
        router.refresh()
      } else {
        const text = await res.text()
        alert("Unable to delete comment: " + (text || res.status))
      }
    } catch (e) {
      console.error("Error deleting comment", e)
      alert("An unexpected error occurred while deleting the comment.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-400 text-sm"
      aria-label="Delete comment"
    >
      Delete
    </button>
  )
}
