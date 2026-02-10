import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  // Find the post to check ownership
  const post = await prisma.post.findUnique({ where: { id } })

  // Only Admin or the Author themselves can delete
  if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ message: "Deleted" })
}
