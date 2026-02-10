import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <header className="mb-12 flex items-center justify-between mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-black">
          My Blog
        </h1>
        <Link
          href="/login"
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Admin Login
        </Link>
      </header>

      <main className="mx-auto max-w-2xl">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group cursor-pointer border-b border-gray-100 pb-8"
              >
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="mb-2 text-2xl font-bold text-gray-900 group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="mb-3 text-gray-500 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(post.createdAt).toLocaleDateString()} •{" "}
                    {post.author.name || "Anonymous"}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
