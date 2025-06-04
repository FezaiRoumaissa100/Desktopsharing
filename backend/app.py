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
key = Fernet.generate_key()
with open('fernet.key', 'wb') as f:
    f.write(key)
with open('fernet.key', 'rb') as f:
    fernet = Fernet(f.read())
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
    mode = data.get('mode', '0')  # '0' = view only, '1' = full control
    ip = data.get('ip', get_local_ip())  # Use provided IP if given, else local IP
    if not ip or mode not in ['0', '1']:
        return jsonify({'error': 'Missing IP or mode'}), 400

    raw = f'{ip},{mode}'  # Now comma-separated
    encrypted = fernet.encrypt(raw.encode()).decode()
    return jsonify({'link': encrypted})


@app.route('/api/use-link', methods=['POST'])
def use_link():
    data = request.get_json()
    link = data.get('link')
    if not link:
        return jsonify({'error': 'Missing link'}), 400
    try:
        decrypted = fernet.decrypt(link.encode()).decode()
        ip,mode = decrypted.split(',')
        print(f"Decoded IP: {ip}, Mode: {mode}")
    except Exception as e:
        return jsonify({'error': f'Invalid link: {e}'}), 400

    try:
        subprocess.Popen([
            'websockify',
            '--cert=cert.pem',
            '--key=key.pem',
            '8085',
            f'{ip}:5900'
        ])
    except Exception as e:
        return jsonify({'error': f'Error starting noVNC: {e}'}), 500

    host_ip = request.host.split(':')[0]
    view_only_param = '&view_only=1' if mode == '0' else ''
    url = f'http://{host_ip}:3000/novnc/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&autoconnect=1{view_only_param}'
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 