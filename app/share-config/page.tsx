"use client"
import { useState } from "react"

export default function ShareConfig() {
  const [info, setInfo] = useState<{ ip: string; password: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<{ ip?: boolean; password?: boolean }>({})

  const handleStartShare = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:5000/api/start-share", { method: "POST" })
      if (!res.ok) throw new Error("Erreur lors du démarrage du partage")
      const data = await res.json()
      setInfo({ ip: data.ip, password: data.password })
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (value: string, field: 'ip' | 'password') => {
    navigator.clipboard.writeText(value)
    setCopied({ ...copied, [field]: true })
    setTimeout(() => setCopied({ ...copied, [field]: false }), 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-green-50 to-green-100">
      <h2 className="text-2xl font-bold text-green-800">Partager mon écran</h2>
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition shadow-lg"
        onClick={handleStartShare}
        disabled={loading}
      >
        {loading ? "Démarrage..." : "Démarrer le partage"}
      </button>
      {info && (
        <div className="mt-6 p-6 border rounded-xl bg-green-700 shadow-lg flex flex-col gap-4 min-w-[320px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Adresse IP :</span>
            <span className="bg-green-900 text-white px-3 py-1 rounded font-mono tracking-wider text-lg select-all">{info.ip}</span>
            <button
              className="ml-2 px-2 py-1 bg-green-500 hover:bg-green-400 text-white rounded text-xs transition"
              onClick={() => handleCopy(info.ip, 'ip')}
            >
              {copied.ip ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Mot de passe :</span>
            <span className="bg-green-900 text-white px-3 py-1 rounded font-mono tracking-wider text-lg select-all">{info.password}</span>
            <button
              className="ml-2 px-2 py-1 bg-green-500 hover:bg-green-400 text-white rounded text-xs transition"
              onClick={() => handleCopy(info.password, 'password')}
            >
              {copied.password ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="text-sm text-green-200 mt-2">Donnez ces informations à la personne qui veut accéder à votre écran.</div>
        </div>
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  )
} 