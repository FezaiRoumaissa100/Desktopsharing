"use client"
import { useState, useEffect } from "react"
import { cookies } from 'next/headers';

export default function ShareConfig() {
  const [ip, setIp] = useState("")
  const [mode, setMode] = useState("0") // 0 = view only, 1 = full control
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
  const getConfig = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/get-ip");
      if (!res.ok) throw new Error("Error fetching IP from Flask");
      const data = await res.json();
      if (data.ip) setIp(data.ip);
    } catch (e: any) {
      setError(e.message);
    }
  };
  getConfig();
}, []);


  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    setLink("");
    try {
      if (!ip) throw new Error("Unable to fetch IP address");
      const res = await fetch("http://localhost:5000/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, mode })
      });
      if (!res.ok) throw new Error("Error generating access link");
      const data = await res.json();
      setLink(data.link);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setError("Error copying to clipboard.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">Share My Screen</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Generate a secure access link to share your screen remotely.
        </p>
        <div className="mb-4 text-brand-900 text-base">Detected IP Address: <span className="font-mono bg-brand-100 px-2 py-1 rounded text-brand-800">{ip || '...'}</span></div>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold border transition-all duration-200 shadow-sm focus:outline-none ${mode === "0" ? "bg-brand-600 text-white border-brand-700" : "bg-white text-brand-700 border-brand-300 hover:bg-brand-50"}`}
            onClick={() => setMode("0")}
            type="button"
          >
            View only
          </button>
          <button
            className={`flex-1 px-6 py-3 rounded-lg font-semibold border transition-all duration-200 shadow-sm focus:outline-none ${mode === "1" ? "bg-brand-600 text-white border-brand-700" : "bg-white text-brand-700 border-brand-300 hover:bg-brand-50"}`}
            onClick={() => setMode("1")}
            type="button"
          >
            Full control
          </button>
        </div>
        <button
          className="px-8 py-3 bg-brand-600 text-white rounded-xl text-lg font-bold hover:bg-brand-700 transition shadow-lg w-full max-w-xs mb-4"
          onClick={handleGenerateLink}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Access Link"}
        </button>
        {link && (
          <div className="mt-4 p-4 border border-brand-300 rounded-xl bg-brand-50 shadow flex flex-col gap-2 w-full items-center">
            <span className="text-brand-700 font-semibold mb-1">Access Link</span>
            <div className="flex items-center gap-2 w-full justify-center">
              <span className="bg-brand-100 text-brand-900 px-3 py-1 rounded font-mono tracking-wider text-base select-all break-all">{link}</span>
              <button
                className="ml-2 px-2 py-1 bg-brand-500 hover:bg-brand-400 text-white rounded text-xs transition"
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="text-xs text-brand-700 mt-1 text-center">Share this link with the person who needs access.</div>
          </div>
        )}
        {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      </div>
    </div>
  );
} 