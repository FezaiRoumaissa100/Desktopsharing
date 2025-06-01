"use client"
import { useState } from "react"

export default function ConnectRemote() {
  const [ip, setIp] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:5000/api/start-novnc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, password })
      })
      if (!res.ok) throw new Error("Erreur lors du lancement de noVNC")
      const data = await res.json()
      window.location.href = data.url
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h2 className="text-2xl font-bold">Accéder à un écran distant</h2>
      <form onSubmit={handleConnect} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Adresse IP du poste distant"
          value={ip}
          onChange={e => setIp(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe VNC"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-4 py-2"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
} 