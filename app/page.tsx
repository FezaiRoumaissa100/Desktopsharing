"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-4xl font-bold mb-4">Bienvenue sur VNC Web</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        Accédez à vos ordinateurs à distance, partagez votre écran ou prenez le contrôle d'un poste distant en toute simplicité et sécurité.
      </p>
      <button
        className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition"
        onClick={() => router.push("/start-session")}
      >
        Start Remote Session
      </button>
    </div>
  )
}
