"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from 'next/navigation';

export default function ShareConfig() {
  const searchParams = useSearchParams();
  const initialIp = searchParams.get('ip') || '';
  const initialPassword = searchParams.get('password') || '';

  const [info, setInfo] = useState<{ ip: string; password: string } | null>(initialIp && initialPassword ? { ip: initialIp, password: initialPassword } : null);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<{ ip?: boolean; password?: boolean }>({})

  useEffect(() => {
    if (!initialIp || !initialPassword) {
      handleStartShare();
    }
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">Partager mon écran</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Voici les informations de connexion pour votre session de partage d'écran. Partagez-les avec la personne qui souhaite se connecter.
        </p>
        {loading && !info && <p className="text-primary">Chargement des informations de partage...</p>}
        {error && <div className="text-destructive font-semibold mb-4">{error}</div>}

        {info && (
          <div className="mt-6 p-6 border rounded-xl bg-muted text-muted-foreground shadow-lg flex flex-col gap-6 items-center justify-center">
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="font-semibold text-foreground text-xl">Adresse IP :</span>
              <div className="flex items-center bg-secondary rounded-lg px-4 py-2 w-full max-w-xs justify-between">
                <span className="font-mono tracking-wider text-secondary-foreground text-xl select-all">{info.ip}</span>
                <button
                  className="ml-4 px-3 py-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded transition text-sm"
                  onClick={() => handleCopy(info.ip, 'ip')}
                >
                  {copied.ip ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="font-semibold text-foreground text-xl">Mot de passe :</span>
              <div className="flex items-center bg-secondary rounded-lg px-4 py-2 w-full max-w-xs justify-between">
                <span className="font-mono tracking-wider text-secondary-foreground text-xl select-all">{info.password}</span>
                <button
                  className="ml-4 px-3 py-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded transition text-sm"
                  onClick={() => handleCopy(info.password, 'password')}
                >
                  {copied.password ? 'Copié !' : 'Copier'}
                </button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-4">Ces informations sont valides pour cette session uniquement.</div>
          </div>
        )}

        {!info && !loading && !error && (
          <button
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-lg hover:bg-primary/90 transition shadow-lg"
            onClick={handleStartShare}
            disabled={loading}
          >
            Démarrer le partage
          </button>
        )}
      </div>
    </div>
  )
} 