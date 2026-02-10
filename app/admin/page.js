import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { PlusCircle, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"
import { authOptions } from "@/lib/auth"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user.email}</span>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session.user.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Post Card - NOW CLICKABLE */}
          <Link href="/admin/create">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <PlusCircle size={24} />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Create New Post
              </h3>
              <p className="text-gray-500 text-sm">
                Draft and publish a new article to your blog.
              </p>
            </div>
          </Link>

          {/* Placeholders for future features */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-60 cursor-not-allowed">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <MessageSquare size={24} />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Comments</h3>
            <p className="text-gray-500 text-sm">Coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  )
}
