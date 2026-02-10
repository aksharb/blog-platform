import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
          </div>
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">Dashboard</Link>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">You haven't written any posts yet.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <Link href={`/posts/${p.slug}`} className="font-semibold text-gray-900 hover:underline">{p.title}</Link>
                    <div className="text-sm text-gray-600">{p.published ? 'Published' : 'Draft'}</div>
                  </div>
                  <div className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
