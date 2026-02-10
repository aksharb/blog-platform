import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route" // Import auth config

const prisma = new PrismaClient()

export async function POST(req) {
  const session = await getServerSession(authOptions)

  // 1. Security Check: Must be logged in
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, slug, content } = body

    // 2. Save to Database
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: true,
        author: { connect: { email: session.user.email } },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Error creating post" }, { status: 500 })
  }
}
