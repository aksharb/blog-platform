import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { post: { select: { authorId: true } } },
    })

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Allow delete if user is admin or post author
    const isAdmin = session.user.role === "ADMIN"
    const isPostAuthor = comment.post.authorId === session.user.id

    if (!isAdmin && !isPostAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.comment.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/comments/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    )
  }
}
