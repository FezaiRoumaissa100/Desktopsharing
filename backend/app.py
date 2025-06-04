from flask import Flask, request, jsonify, session
from flask_cors import CORS
import socket
import random
import string
import subprocess
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(32))

# Store connection details temporarily (in production, use Redis or a proper database)
connection_tokens = {}

# Clean up expired tokens periodically
def cleanup_expired_tokens():
    current_time = datetime.now()
    expired_tokens = [token for token, details in connection_tokens.items() 
                     if current_time > details['expires_at']]
    for token in expired_tokens:
        del connection_tokens[token]

# Clean cross-platform Wi-Fi/local IP detection
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

def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def get_all_local_ips():
    ips = set()
    hostname = socket.gethostname()
    try:
        for ip in socket.gethostbyname_ex(hostname)[2]:
            if not ip.startswith("127."):
                ips.add(ip)
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(hostname, None):
            ip = info[4][0]
            if "." in ip and not ip.startswith("127."):
                ips.add(ip)
    except Exception:
        pass
    return list(ips)

@app.route('/api/start-share', methods=['POST'])
def start_share():
    password = generate_password()
    ips = get_all_local_ips()
    ip = ips[0] if ips else '127.0.0.1'
    try:
        subprocess.Popen([
            r"C:\Program Files\TightVNC\tvnserver.exe",
            "-run"
        ])
    except Exception as e:
        print(f"Error starting TightVNC: {e}")
    return jsonify({'ip': ip, 'ips': ips, 'password': password})

@app.route('/api/start-novnc', methods=['POST'])
def start_novnc():
    data = request.get_json()
    ip = data.get('ip')
    password = data.get('password')
    if not ip or not password:
        return jsonify({'error': 'Missing IP or password'}), 400
    
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
    
    # Generate a secure token and store connection details
    token = str(uuid.uuid4())
    connection_tokens[token] = {
        'ip': ip,
        'password': password,
        'expires_at': datetime.now() + timedelta(hours=24)  # Token expires in 24 hours
    }
    
    # Clean up expired tokens
    cleanup_expired_tokens()
    
    host_ip = request.host.split(':')[0]
    # Return URL with only the token
    url = f'http://{host_ip}:3000/novnc/vnc.html?token={token}'
    return jsonify({'url': url})

@app.route('/api/novnc-connect/<token>', methods=['GET'])
def get_connection_details(token):
    # Clean up expired tokens first
    cleanup_expired_tokens()
    
    # Check if token exists and is valid
    if token not in connection_tokens:
        return jsonify({'error': 'Invalid or expired token'}), 404
    
    connection = connection_tokens[token]
    host_ip = request.host.split(':')[0]
    
    # Return connection details
    return jsonify({
        'host': host_ip,
        'port': '8085',
        'password': connection['password'],
        'encrypt': '1',
        'path': '/',
        'autoconnect': '1'
    })

def caesar_shift(s, shift):
    result = []
    for c in s:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            result.append(chr((ord(c) - base + shift) % 26 + base))
        elif c.isdigit():
            result.append(str((int(c) + shift) % 10))
        else:
            result.append(c)
    return ''.join(result)

@app.route('/api/generate-link', methods=['POST'])
def generate_link():
    data = request.get_json()
    mode = data.get('mode', '0')  # '0' = view only, '1' = full control
    ip = get_local_ip()
    print(f"Generated link for IP: {ip}, Mode: {mode}")
    password = "achour"
    if not ip or mode not in ['0', '1']:
        return jsonify({'error': 'Missing IP or mode'}), 400
    raw = f'{ip}{password}{mode}'
    link = caesar_shift(raw, 3)
    return jsonify({'link': link})

@app.route('/api/use-link', methods=['POST'])
def use_link():
    data = request.get_json()
    link = data.get('link')
    if not link:
        return jsonify({'error': 'Missing link'}), 400
    try:
        decoded = caesar_shift(link, -3)
        mode = decoded[-1]
        password = 'achour'
        ip = decoded[:-1].replace(password, '')
        print(ip)   
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
    url = f'http://{host_ip}:3000/novnc/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&password={password}&autoconnect=1{view_only_param}'
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
