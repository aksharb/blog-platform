import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// DELETE /api/posts/:id
// Only admins or the post's author can remove a post.
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = params

    // Find the post to check ownership
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Only Admin or the Author themselves can delete
    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
