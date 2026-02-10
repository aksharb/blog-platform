import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma" // uses the singleton you just made
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(req) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, slug, content } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: true,
        // FIX: Connect by ID, not email. IDs are immutable; emails can change.
        author: { connect: { id: session.user.id } },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    // FIX: Handle duplicate slugs specifically
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A post with this slug already exists. Change the title." },
        { status: 409 },
      )
    }
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Error creating post" }, { status: 500 })
  }
}
