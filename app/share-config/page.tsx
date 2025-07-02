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
  const [secureMode, setSecureMode] = useState(true)
  const [vncServerStarted, setVncServerStarted] = useState(false)
  const [connectionData, setConnectionData] = useState<any>(null)

  // Use consistent API base URL
  const API_BASE_URL = "https://127.0.0.1:5000"
  const API_BASE_URL_HTTP = "http://127.0.0.1:5000"

  useEffect(() => {
    const getConfig = async () => {
      try {
        // Try HTTPS first
        const res = await fetch(`${API_BASE_URL}/api/get-ip`, {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error(`Error fetching IP from Flask: ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (data.ip) setIp(data.ip);
      } catch (e: any) {
        console.error('HTTPS failed, trying HTTP:', e);
        try {
          // Fallback to HTTP
          const res = await fetch(`${API_BASE_URL_HTTP}/api/get-ip`, {
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) throw new Error(`Error fetching IP from Flask: ${res.status} ${res.statusText}`);
          const data = await res.json();
          if (data.ip) setIp(data.ip);
        } catch (httpError: any) {
          console.error('HTTP also failed:', httpError);
          setError(`Unable to fetch IP address: ${e.message}. This might be due to SSL certificate issues or the backend not running. Try accepting the certificate in your browser first or check if the backend is running.`);
        }
      }
    };
    getConfig();
  }, []);

  const handleStartSecureVNC = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/start-secure-vnc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
      });
      if (!res.ok) throw new Error(`Error starting secure VNC server: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setConnectionData(data);
      setVncServerStarted(true);
    } catch (e: any) {
      console.error('Error starting VNC:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    setLoading(true);
    setError("");
    setLink("");
    try {
      if (!ip) throw new Error("Unable to fetch IP address");
      console.log("Generating link with IP:", ip, "Mode:", mode);
      const res = await fetch(`${API_BASE_URL}/api/generate-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: 'cors',
        body: JSON.stringify({ ip, mode })
      });
      if (!res.ok) throw new Error(`Error generating access link: ${res.status} ${res.statusText}`);
      const data = await res.json();
      console.log("Generated link data:", data);
      setLink(data.link);
      console.log("Link set to:", data.link);
    } catch (e: any) {
      console.error('Error generating link:', e);
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

  const testConnection = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/test`, {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Connection test failed: ${res.status} ${res.statusText}`);
      const data = await res.json();
      alert(`✅ Connection successful!\nMessage: ${data.message}\nIP: ${data.ip}`);
    } catch (e: any) {
      console.error('Connection test failed:', e);
      setError(`Connection test failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card text-card-foreground shadow-xl rounded-xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-foreground mb-6">🖥️ Host: Share Your Desktop</h1>
        
        {/* Host Role Description */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">🎯 You are the Host</h3>
          <p className="text-sm text-green-700">
            Generate a secure link and share it with others to let them access your desktop
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
              Enable TLS/SSL Encryption
            </span>
          </label>
        </div>

        {/* Connection Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Permissions
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">View Only (Read-only access)</option>
            <option value="1">Full Control (Read/Write access)</option>
          </select>
        </div>

        {/* Generate Link Button */}
        <button
          onClick={handleGenerateLink}
          disabled={loading}
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Generating..." : "🔗 Generate Secure Access Link"}
        </button>

        {/* Generated Link Display */}
        {link && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-lg font-bold text-blue-800 mb-3">🔗 Your Secure Access Link</h3>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-4 py-3 text-sm border border-blue-300 rounded-lg bg-white font-mono"
              />
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>🔒 This encrypted link contains secure connection parameters</p>
              <p>📱 Share this link with others to grant them access to your desktop</p>
              <p>⚡ Mode: {mode === "0" ? "View Only" : "Full Control"}</p>
              <p>💡 Recipients should use this link in the "Connect Remote" page</p>
            </div>
          </div>
        )}

        {/* Instructions for Recipients */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">📋 Instructions for Recipients:</h3>
          <ol className="text-xs text-yellow-700 space-y-1 text-left">
            <li>1. Share the generated link with the person who needs access</li>
            <li>2. They should go to the "Connect Remote" page</li>
            <li>3. Paste the link and click "Connect Securely"</li>
            <li>4. They will be redirected to your desktop via noVNC</li>
          </ol>
        </div>

        {/* Test Connection Button */}
        <button
          onClick={testConnection}
          disabled={loading}
          className="w-full mt-4 px-8 py-3 bg-gray-600 text-white rounded-xl text-lg font-bold hover:bg-gray-700 transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Testing..." : "🔧 Test Backend Connection"}
        </button>

        {/* Debug Information */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <p>Debug: IP={ip}, Link={link ? "Set" : "Not set"}, Loading={loading.toString()}</p>
        </div>

        {/* Security Information */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Security Features:</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>✅ TLS/SSL encryption for all connections</li>
            <li>✅ Self-signed certificates for VNC server</li>
            <li>✅ Encrypted sharing links</li>
            <li>✅ Secure WebSocket proxy</li>
            <li>✅ HTTPS for web interface</li>
          </ul>
        </div>

        {/* Troubleshooting Section */}
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Troubleshooting SSL Issues:</h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>🔧 If you see SSL certificate errors, visit <a href="https://127.0.0.1:5000/api/get-ip" target="_blank" className="underline">https://127.0.0.1:5000/api/get-ip</a> first</li>
            <li>🔧 Click "Advanced" and "Proceed to 127.0.0.1 (unsafe)" in your browser</li>
            <li>🔧 This accepts the self-signed certificate for this session</li>
            <li>🔧 Then return to this page and try again</li>
            <li>🔧 Alternative: Run <code className="bg-gray-200 px-1 rounded">python start-backend.py</code> or <code className="bg-gray-200 px-1 rounded">start-backend.bat</code> and choose HTTP mode for testing</li>
          </ul>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 