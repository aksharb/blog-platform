import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // 1. Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    })

    if (existingUser) {
      return NextResponse.json({
        message: "Admin already exists! You can log in.",
      })
    }

    // 2. Create the Admin User
    const hashedPassword = await bcrypt.hash("password123", 10)

    const user = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin Akshar",
        password: hashedPassword,
        role: "ADMIN",
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
