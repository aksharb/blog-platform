"use client"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DeleteButton({ postId }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure? This cannot be undone.")) return

    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      router.refresh() // This reloads the post list
    } else {
      alert("Failed to delete post.")
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-600 p-2 transition-colors"
    >
      <Trash2 size={18} />
    </button>
  )
}
