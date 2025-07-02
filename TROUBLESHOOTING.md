# Troubleshooting Guide

## Backend Import Issues

If you see `ModuleNotFoundError: No module named 'cert_manager'` or `ImportError: attempted relative import with no known parent package`, use one of these methods:

### Method 1: Test Imports First
```bash
# Test if all imports work correctly
python test-backend.py
```

### Method 2: Use the Starter Script (Recommended)
```bash
# Python script
python start-backend.py

# Windows batch file
start-backend.bat
```

### Method 3: Manual Backend Start
```bash
# Navigate to backend directory first
cd backend

# For HTTPS (secure mode)
python app.py

# For HTTP (testing mode)
python app.py --http
```

### Method 4: Install Dependencies
```bash
# Make sure all dependencies are installed
cd backend
pip install -r requirements.txt
```

### Method 5: Run as Module
```bash
# From project root directory
python -m backend.app

# For HTTP mode (add --http argument to app.py first)
```

## SSL Certificate Issues

If you're seeing "unable to fetch" errors in the `/share-config` page, it's likely due to SSL certificate issues. Here are several solutions:

### Solution 1: Accept the Self-Signed Certificate (Recommended)

1. Open your browser and navigate to: `https://127.0.0.1:5000/api/get-ip`
2. You'll see a security warning about the certificate
3. Click "Advanced" or "Show Details"
4. Click "Proceed to 127.0.0.1 (unsafe)" or similar option
5. Return to the share-config page and try again

### Solution 2: Use HTTP Mode for Testing

1. Stop the current backend server (Ctrl+C)
2. Run the starter script: `python start-backend.py` or `start-backend.bat`
3. Choose option 2 (HTTP mode)
4. The frontend will automatically fallback to HTTP if HTTPS fails

### Solution 3: Check Backend Status

Use the "Test Backend Connection" button on the share-config page to verify the backend is running and accessible.

## Common Issues

### Backend Not Running
- Make sure the backend is started using one of the methods above
- Check if port 5000 is available
- Look for error messages in the terminal

### CORS Issues
- The backend is configured to accept requests from `localhost:3000` and `127.0.0.1:3000`
- Make sure your frontend is running on one of these addresses

### Network Issues
- Ensure both frontend and backend are running on the same machine
- Check firewall settings
- Verify no antivirus is blocking the connections

## Debug Information

The share-config page now includes:
- Automatic HTTPS/HTTP fallback
- Better error messages
- Connection testing functionality
- Detailed troubleshooting steps

If you continue to have issues, check the browser's developer console (F12) for detailed error messages.

## noVNC Issues

If you see "internal server error" when trying to start the secure VNC server, it's likely due to missing noVNC dependencies.

### Step 1: Check Dependencies
```bash
python check-dependencies.py
```

### Step 2: Install Missing Dependencies

#### noVNC Installation:
```bash
# Clone noVNC to the public directory
git clone https://github.com/novnc/noVNC.git public/noVNC

# Or download and extract manually to public/noVNC
```

#### WebSocket Proxy Installation:
```bash
pip install websockify
```

### Step 3: Verify Installation
After installing, run the dependency checker again:
```bash
python check-dependencies.py
```

### Common noVNC Issues:
- **noVNC not found**: Ensure noVNC is in `public/noVNC` directory
- **Websockify not found**: Install with `pip install websockify`
- **Port already in use**: Change the proxy port in the code
- **SSL certificate issues**: Certificates are generated automatically 