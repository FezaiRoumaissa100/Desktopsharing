"use client"
import { useState } from "react"

export default function ConnectRemote() {
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (!link) throw new Error("Please paste the access link")
      const res = await fetch("http://localhost:5000/api/use-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link })
      })
      if (!res.ok) throw new Error("Invalid link or connection error")
      const data = await res.json()
      window.location.href = data.url
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">Access a Remote Screen</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Paste the access link you received from the host to connect.
        </p>
        <form onSubmit={handleConnect} className="flex flex-col gap-4 w-full max-w-xs mx-auto">
          <input
            type="text"
            placeholder="Paste the access link here"
            value={link}
            onChange={e => setLink(e.target.value)}
            className="border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-400"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-brand-600 text-white rounded-xl text-lg font-bold hover:bg-brand-700 transition shadow-lg w-full"
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>
        {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      </div>
    </div>
  )
} 