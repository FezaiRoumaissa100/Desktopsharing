"use client"
import Link from "next/link"

export default function StartSession() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h2 className="text-2xl font-bold mb-4">Démarrer une session distante</h2>
      <div className="flex gap-8">
        <Link href="/share-config">
          <span className="px-8 py-4 bg-green-600 text-white rounded-lg text-xl hover:bg-green-700 transition cursor-pointer">
            Partager mon écran
          </span>
        </Link>
        <Link href="/connect-remote">
          <span className="px-8 py-4 bg-green-500 text-white rounded-lg text-xl hover:bg-green-600 transition cursor-pointer">
            Accéder à un écran
          </span>
        </Link>
      </div>
    </div>
  )
} 