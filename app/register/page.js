"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", name: "" })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) router.push("/login")
    else {
      alert("Registration failed. Try a different email.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-[#111] p-10 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter italic mb-2">
            JOIN LOOPWAVE
          </h1>
          <p className="text-gray-500 text-sm">
            Create an author account to start publishing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            className="w-full bg-black border border-white/10 p-3 rounded-lg text-white placeholder:text-gray-600 focus:border-blue-500 outline-none transition-all"
            type="text"
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            className="w-full bg-black border border-white/10 p-3 rounded-lg text-white placeholder:text-gray-600 focus:border-blue-500 outline-none transition-all"
            type="email"
            placeholder="Email Address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            required
            className="w-full bg-black border border-white/10 p-3 rounded-lg text-white placeholder:text-gray-600 focus:border-blue-500 outline-none transition-all"
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            type="submit"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
