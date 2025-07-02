"use client"
import { useState } from "react"

export default function ConnectRemote() {
  const [link, setLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [secureMode, setSecureMode] = useState(true)

  // Use consistent API base URL
  const API_BASE_URL = "https://127.0.0.1:5000"
  const API_BASE_URL_HTTP = "http://127.0.0.1:5000"

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (!link) throw new Error("Please paste the access link")
      
      // Try HTTPS first, fallback to HTTP
      let res;
      try {
        res = await fetch(`${API_BASE_URL}/api/use-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: 'cors',
          body: JSON.stringify({ link })
        });
      } catch (httpsError) {
        console.log('HTTPS failed, trying HTTP:', httpsError);
        res = await fetch(`${API_BASE_URL_HTTP}/api/use-link`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: 'cors',
          body: JSON.stringify({ link })
        });
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Connection error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Connection successful:', data);
      window.location.href = data.url;
      
    } catch (e: any) {
      console.error('Connection error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const testLink = async () => {
    if (!link) {
      setError("Please paste a link first");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/test-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({ link })
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Test failed: ${res.status}`);
      }
      
      const data = await res.json();
      alert(`✅ Link test successful!\nIP: ${data.decrypted.ip}\nMode: ${data.decrypted.mode === '0' ? 'View Only' : 'Full Control'}`);
      
    } catch (e: any) {
      console.error('Test error:', e);
      setError(`Test failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">👥 Client: Access Remote Desktop</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Use the secure link provided by the host to connect to their desktop.
        </p>

        {/* Client Role Description */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🎯 You are the Client</h3>
          <p className="text-sm text-blue-700">
            Paste the secure link from the host to access their desktop via noVNC
          </p>
        </div>

        {/* Security Mode Toggle */}
        <div className="mb-6">
          <label className="flex items-center justify-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={secureMode}
              onChange={(e) => setSecureMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-900">
              Use TLS/SSL Encryption
            </span>
          </label>
        </div>

        {secureMode ? (
          // Secure Connection Form
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Secure Connection</h3>
              <p className="text-xs text-green-700">
                🔒 All data will be encrypted with TLS/SSL
              </p>
            </div>
            
            <form onSubmit={handleConnect} className="flex flex-col gap-4 w-full max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Paste the secure access link from the host"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold hover:bg-green-700 transition shadow-lg w-full"
                disabled={loading}
              >
                {loading ? "Connecting Securely..." : "🔗 Connect to Host Desktop"}
              </button>
            </form>
          </div>
        ) : (
          // Standard Connection Form
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Standard Connection</h3>
              <p className="text-xs text-yellow-700">
                ⚠️ Connection may not be fully encrypted
              </p>
            </div>
            
            <form onSubmit={handleConnect} className="flex flex-col gap-4 w-full max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Paste the access link from the host"
                value={link}
                onChange={e => setLink(e.target.value)}
                className="border rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg w-full"
                disabled={loading}
              >
                {loading ? "Connecting..." : "🔗 Connect to Host Desktop"}
              </button>
            </form>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">📋 How to get a link:</h3>
          <ol className="text-xs text-yellow-700 space-y-1 text-left">
            <li>1. Ask the host to go to the "Share Config" page</li>
            <li>2. They should generate a secure access link</li>
            <li>3. They will share that link with you</li>
            <li>4. Paste the link above and click "Connect"</li>
          </ol>
        </div>

        {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      </div>
    </div>
  )
} 