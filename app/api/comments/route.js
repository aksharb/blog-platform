import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// POST /api/comments
// Creates a comment for an authenticated user. Expects `{ content, postId }`.
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { content, postId } = await req.json()
    if (!content || !postId) return NextResponse.json({ error: "Missing data" }, { status: 400 })

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
      },
      include: { author: { select: { name: true, id: true } } },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("POST /api/comments error:", error)
    return NextResponse.json({ error: "Error creating comment" }, { status: 500 })
  }
}
