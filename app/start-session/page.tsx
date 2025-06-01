"use client"
import Link from "next/link"
import { useState, useEffect } from 'react';

export default function StartSession() {
  const [ipAddress, setIpAddress] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Generate a dummy IP address and password for demonstration
    setIpAddress(`192.168.1.${Math.floor(Math.random() * 255)}`);
    setPassword(Math.random().toString(36).substring(2, 10));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">Démarrer une session à distance</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Choisissez une option pour démarrer ou rejoindre une session de partage d'écran.
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <Link href={`/share-config?ip=${ipAddress}&password=${password}`}>
            <span className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground rounded-lg shadow-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer min-w-[200px] h-[150px]">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <span className="text-xl font-semibold">Partager mon écran</span>
            </span>
          </Link>
          <Link href="/connect-remote">
            <span className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-secondary to-accent text-secondary-foreground rounded-lg shadow-lg hover:from-secondary/90 hover:to-accent/90 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer min-w-[200px] h-[150px]">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
              <span className="text-xl font-semibold">Accéder à un écran</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
} 