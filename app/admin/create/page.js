"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreatePost() {
  const router = useRouter()
  const [form, setForm] = useState({ title: "", slug: "", content: "" })
  const [loading, setLoading] = useState(false)

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    setForm({ ...form, title, slug })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push("/admin") // Go back to dashboard on success
        router.refresh()
      } else {
        alert("Failed to create post")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Write New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-xl font-semibold text-black placeholder:text-gray-500"
              />
            </div>

            {/* Slug Input (Auto-generated but editable) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-black outline-none text-black"
              />
            </div>

            {/* Content Area */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content
              </label>
              <textarea
                required
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your story here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-y leading-relaxed text-black placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
