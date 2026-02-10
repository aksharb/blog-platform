import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tighter italic">
            LOOPWAVE.BLOG
          </h1>
          <Link
            href="/login"
            className="text-xs font-bold tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-gray-600 text-center italic">
            No signals found in the database.
          </p>
        ) : (
          <div className="space-y-20">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/posts/${post.slug}`}>
                  <div className="text-xs font-mono text-blue-500 mb-3 tracking-widest uppercase">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {post.content}
                  </p>
                  <div className="text-xs text-gray-600 uppercase tracking-widest font-bold">
                    Read Entry →
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
