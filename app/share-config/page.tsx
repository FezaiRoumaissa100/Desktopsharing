"use client"
import { useState, useEffect } from "react"

export default function ShareConfig() {
  const [ip, setIp] = useState("")
  const [mode, setMode] = useState("0") // 0 = view only, 1 = contrôle complet
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Récupère automatiquement l'IP locale au chargement
    const fetchIp = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/start-share", { method: "POST" })
        if (!res.ok) throw new Error("Erreur lors de la récupération de l'IP")
        const data = await res.json()
        setIp(data.ip)
      } catch (e: any) {
        setError(e.message)
      }
    }
    fetchIp()
  }, [])

  const handleGenerateLink = async () => {
    setLoading(true)
    setError("")
    setLink("")
    try {
      if (!ip) throw new Error("Impossible de récupérer l'adresse IP")
      const res = await fetch("http://localhost:5000/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, mode })
      })
      if (!res.ok) throw new Error("Erreur lors de la génération du lien")
      const data = await res.json()
      setLink(data.link)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      setError("Erreur lors de la copie dans le presse-papier.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-green-50 to-green-100">
      <h2 className="text-2xl font-bold text-green-800">Partager mon écran</h2>
      <div className="mb-2 text-green-900">Adresse IP détectée : <span className="font-mono bg-green-100 px-2 py-1 rounded">{ip || '...'}</span></div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="0" checked={mode === "0"} onChange={() => setMode("0")}/>
          View only
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="mode" value="1" checked={mode === "1"} onChange={() => setMode("1")}/>
          Contrôle complet
        </label>
      </div>
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg hover:bg-green-700 transition shadow-lg"
        onClick={handleGenerateLink}
        disabled={loading}
      >
        {loading ? "Génération..." : "Générer le lien d'accès"}
      </button>
      {link && (
        <div className="mt-6 p-6 border rounded-xl bg-green-700 shadow-lg flex flex-col gap-4 min-w-[320px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Lien d'accès :</span>
            <span className="bg-green-900 text-white px-3 py-1 rounded font-mono tracking-wider text-lg select-all break-all">{link}</span>
            <button
              className="ml-2 px-2 py-1 bg-green-500 hover:bg-green-400 text-white rounded text-xs transition"
              onClick={handleCopy}
            >
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="text-sm text-green-200 mt-2">Donnez ce lien à la personne qui veut accéder à votre écran.</div>
        </div>
      )}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
    </div>
  )
} 