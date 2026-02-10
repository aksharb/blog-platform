"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

// Simple client button to sign the user out.
// Keeps UX snappy by avoiding a full redirect when possible,
// but falls back to the default `signOut()` flow on error.
export default function LogoutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // Ask NextAuth to sign out without redirecting so we can
      // programmatically control the UX and refresh the app state.
      await signOut({ redirect: false })
      router.push("/")
      router.refresh()
    } catch (e) {
      console.error("Sign out error", e)
      // If something goes wrong, fall back to the built-in redirect.
      signOut()
    }
  }

  return (
    <button
      onClick={handleSignOut}
      className="ml-4 text-sm text-red-600 hover:underline"
      aria-label="Sign out"
    >
      Log Out
    </button>
  )
}
