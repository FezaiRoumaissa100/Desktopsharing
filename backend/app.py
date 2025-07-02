
from flask import Flask, request, jsonify
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import subprocess
import socket
import random
import string
import os
import re
import ssl
import tempfile
from cryptography.fernet import Fernet
from datetime import datetime, timedelta
import pyotp
import qrcode
import io

# Import centralized managers
from cert_manager import cert_manager
from vnc_manager import vnc_manager

app = Flask(__name__)
CORS(app)

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        print(f"Detected local IP: {ip}")
        return ip
    except Exception:
        return "127.0.0.1"
# Configure CORS to allow requests from the frontend
CORS(app, origins=['https://127.0.0.1:3000', 'https://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3000'], 
     supports_credentials=True)

# Single user credentials and MFA secret (for demo purposes)
SINGLE_USER = {
    "username": "demo",
    "password": "password123",
    "mfa_secret": None
}

@app.route('/api/get-ip', methods=['GET'])
def get_ip():
    """Get local IP address"""
    try:
        ip = vnc_manager.get_local_ip()
        return jsonify({'ip': ip})
    except Exception as e:
        return jsonify({'error': f'Failed to get IP: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """Simple test endpoint for debugging"""
    return jsonify({
        'message': 'Backend is accessible',
        'timestamp': datetime.now().isoformat(),
        'ip': vnc_manager.get_local_ip()
    })

@app.route('/api/test-link', methods=['POST'])
def test_link():
    """Test endpoint to debug link functionality"""
    data = request.get_json()
    link = data.get('link')
    
    if not link:
        return jsonify({'error': 'Missing link'}), 400
    
    try:
        # Test decryption
        encrypted, key_str = link.split(':')
        fernet = Fernet(key_str.encode())
        decrypted = fernet.decrypt(encrypted.encode()).decode()
        ip, mode = decrypted.split(',')
        
        return jsonify({
            'success': True,
            'decrypted': {
                'ip': ip,
                'mode': mode
            },
            'message': 'Link decryption successful'
        })
        
    except Exception as e:
        return jsonify({'error': f'Link test failed: {str(e)}'}), 400

@app.route('/api/generate-link', methods=['POST'])
def generate_link():
    """Generate encrypted sharing link"""
    data = request.get_json()
    mode = data.get('mode', '0')
    ip = data.get('ip', get_local_ip())

    mode = data.get('mode', '0')
    ip = data.get('ip', vnc_manager.get_local_ip())

    if not ip or mode not in ['0', '1']:
        return jsonify({'error': 'Missing IP or mode'}), 400

    # Generate Fernet key and encrypt the payload
    key = Fernet.generate_key()
    print(key)
    fernet = Fernet(key)

    raw = f'{ip},{mode}'
    # Generate Fernet key and encrypt the payload
    key = Fernet.generate_key()
    fernet = Fernet(key)

    raw = f'{ip},{mode}'
    encrypted = fernet.encrypt(raw.encode()).decode()

    # Encode key for transport (base64 to make it URL-safe)
    key_str = key.decode()
    print(f"Generated key: {key_str}")

    # Combine encrypted data and key into a single URL-safe string
    payload = f"{encrypted}:{key_str}"

    return jsonify({'link': payload})


    # Encode key for transport
    key_str = key.decode()

    # Combine encrypted data and key into a single URL-safe string
    payload = f"{encrypted}:{key_str}"

    return jsonify({'link': payload})

@app.route('/api/use-link', methods=['POST'])
def use_link():
    """Use encrypted sharing link to establish noVNC connection"""
    data = request.get_json()
    link = data.get('link')


    if not link:
        return jsonify({'error': 'Missing link'}), 400


    try:
        encrypted, key_str = link.split(':')
        fernet = Fernet(key_str.encode())
        decrypted = fernet.decrypt(encrypted.encode()).decode()
        ip, mode = decrypted.split(',')
        
        # Decrypt the link
        encrypted, key_str = link.split(':')
        fernet = Fernet(key_str.encode())
        decrypted = fernet.decrypt(encrypted.encode()).decode()
        ip, mode = decrypted.split(',')
        
        print(f"Decrypted link - IP: {ip}, Mode: {mode}")
        
    except Exception as e:
        print(f"Error decrypting link: {e}")
        return jsonify({'error': f'Invalid link format: {e}'}), 400

    # Start websockify
    try:
        subprocess.Popen([
            'websockify',
            '--cert=cert.pem',
            '--key=key.pem',
            '8085',
            f'{ip}:5900'
        ])
        print(f"Started websockify for {ip}:5900 on port 8085")
    except Exception as e:
        return jsonify({'error': f'Error starting noVNC: {e}'}), 500
        # Check if websockify is available
        try:
            import subprocess
            subprocess.run(['websockify', '--help'], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            return jsonify({'error': 'Websockify not found. Please install it with: pip install websockify'}), 500
        
        # For noVNC, we need to start a websockify proxy
        # The IP from the link is the host's IP, and we'll proxy to a VNC port
        proxy_process = vnc_manager.start_websockify_proxy(ip, 5900)
        
        if not proxy_process:
            return jsonify({'error': 'Failed to start noVNC proxy server. Check if websockify is installed and working.'}), 500

    host_ip = request.host.split(':')[0]
    view_only_param = '&view_only=1' if mode == '0' else ''
    url = f'http://{host_ip}:3000/novnc/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&autoconnect=1{view_only_param}'
    print(f"Generated URL: {url}")

    return jsonify({'url': url})
        host_ip = request.host.split(':')[0]
        view_only_param = '&view_only=1' if mode == '0' else ''
        
        # Generate noVNC URL with SSL
        url = f'https://{host_ip}:8085/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&autoconnect=1&ssl=1{view_only_param}'
        
        print(f"Generated noVNC URL: {url}")
        
        return jsonify({
            'url': url,
            'success': True,
            'message': f'noVNC proxy started successfully. Mode: {"View Only" if mode == "0" else "Full Control"}'
        })
        
    except Exception as e:
        print(f"Error in use-link: {e}")
        return jsonify({'error': f'Connection error: {str(e)}'}), 500

@app.route('/api/sessions', methods=['GET'])
def list_sessions():
    """List all active VNC sessions"""
    try:
        sessions = vnc_manager.list_active_sessions()
        return jsonify({'sessions': sessions})
    except Exception as e:
        return jsonify({'error': f'Error listing sessions: {str(e)}'}), 500

@app.route('/api/sessions/<int:display_number>', methods=['DELETE'])
def stop_session(display_number):
    """Stop a specific VNC session"""
    try:
        success = vnc_manager.stop_vnc_server(display_number)
        if success:
            return jsonify({'message': f'Session :{display_number} stopped successfully'})
        else:
            return jsonify({'error': f'Failed to stop session :{display_number}'}), 500
    except Exception as e:
        return jsonify({'error': f'Error stopping session: {str(e)}'}), 500

@app.route('/api/certificates/validate', methods=['GET'])
def validate_certificates():
    """Validate SSL certificates"""
    try:
        is_valid, message = cert_manager.validate_certificates()
        return jsonify({
            'valid': is_valid,
            'message': message
        })
    except Exception as e:
        return jsonify({'error': f'Certificate validation error: {str(e)}'}), 500

@app.route('/api/certificates/regenerate', methods=['POST'])
def regenerate_certificates():
    """Regenerate SSL certificates"""
    try:
        cert_path, key_path = cert_manager.generate_certificates(force_regenerate=True)
        return jsonify({
            'message': 'Certificates regenerated successfully',
            'cert_path': cert_path,
            'key_path': key_path
        })
    except Exception as e:
        return jsonify({'error': f'Certificate generation error: {str(e)}'}), 500

@app.route('/api/mfa/setup', methods=['POST'])
def mfa_setup():
    # For demo, no authentication, just set up MFA for the single user
    # In production, check authentication here
    secret = pyotp.random_base32()
    SINGLE_USER['mfa_secret'] = secret
    otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(name=SINGLE_USER['username'], issuer_name="DesktopSharingApp")
    img = qrcode.make(otp_uri)
    buf = io.BytesIO()
    img.save(buf)
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

@app.route('/api/mfa/verify', methods=['POST'])
def mfa_verify():
    data = request.get_json()
    code = data.get('code')
    secret = SINGLE_USER['mfa_secret']
    if not secret:
        return jsonify({"error": "MFA not set up"}), 400
    totp = pyotp.TOTP(secret)
    if totp.verify(code):
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Invalid code"}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    import sys
    
    # Check if HTTP mode is requested
    if len(sys.argv) > 1 and sys.argv[1] == '--http':
        print("🚀 Starting Flask server in HTTP mode (for testing)")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("🔒 Starting Flask server in HTTPS mode (secure)")
        app.run(host='0.0.0.0', port=5000, ssl_context='adhoc', debug=True)