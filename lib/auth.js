import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password)
          throw new Error("Missing credentials")
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) throw new Error("No user found")
        const match = await bcrypt.compare(credentials.password, user.password)
        if (!match) throw new Error("Incorrect password")
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
}
