import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { PlusCircle, MessageSquare, Trash2 } from "lucide-react"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeleteButton from "@/components/DeleteButton" // We'll create this next

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch posts so we can delete them
  // Admins see all, Authors see only theirs
  const posts = await prisma.post.findMany({
    where: session.user.role === "ADMIN" ? {} : { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {session.user.email}
          <Link href="/" className="ml-4 text-blue-600 hover:underline">
            View Site
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>

        {/* Your Original Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/admin/create">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlusCircle size={24} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Create New Post
              </h3>
              <p className="text-gray-500 text-sm">
                Draft and publish a new article.
              </p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <MessageSquare size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Comments</h3>
            <p className="text-gray-500 text-sm">Feature coming soon.</p>
          </div>
        </div>

        {/* NEW: Manage Posts Section with Delete Button */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Manage Your Posts
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {posts.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No posts found.</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteButton postId={post.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
