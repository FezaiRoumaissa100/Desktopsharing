
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import socket
import random
import string
import os
import re
from cryptography.fernet import Fernet

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
@app.route('/api/get-ip', methods=['GET'])
def get_ip():
    ip = get_local_ip()
    return jsonify({'ip': ip})



@app.route('/api/generate-link', methods=['POST'])
def generate_link():
    data = request.get_json()
    mode = data.get('mode', '0')
    ip = data.get('ip', get_local_ip())

    if not ip or mode not in ['0', '1']:
        return jsonify({'error': 'Missing IP or mode'}), 400

    # Generate Fernet key and encrypt the payload
    key = Fernet.generate_key()
    print(key)
    fernet = Fernet(key)

    raw = f'{ip},{mode}'
    encrypted = fernet.encrypt(raw.encode()).decode()

    # Encode key for transport (base64 to make it URL-safe)
    key_str = key.decode()
    print(f"Generated key: {key_str}")

    # Combine encrypted data and key into a single URL-safe string
    payload = f"{encrypted}:{key_str}"

    return jsonify({'link': payload})


@app.route('/api/use-link', methods=['POST'])
def use_link():
    data = request.get_json()
    link = data.get('link')

    if not link:
        return jsonify({'error': 'Missing link'}), 400

    try:
        encrypted, key_str = link.split(':')
        fernet = Fernet(key_str.encode())
        decrypted = fernet.decrypt(encrypted.encode()).decode()
        ip, mode = decrypted.split(',')
        
    except Exception as e:
        return jsonify({'error': f'Invalid link: {e}'}), 400

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

    host_ip = request.host.split(':')[0]
    view_only_param = '&view_only=1' if mode == '0' else ''
    url = f'http://{host_ip}:3000/novnc/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&autoconnect=1{view_only_param}'
    print(f"Generated URL: {url}")

    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)