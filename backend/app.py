from flask import Flask, request, jsonify
from flask_cors import CORS
import socket
import random
import string
import subprocess
import base64
from cryptography.fernet import Fernet

app = Flask(__name__)
CORS(app)


fernet_key = Fernet.generate_key()
fernet = Fernet(fernet_key)
with open("fernet.key", "wb") as f:
    f.write(fernet_key)
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
    encrypted_url = fernet.encrypt(url.encode()).decode()
    print(f"Encrypted URL: {encrypted_url}")    
    return jsonify({'url': url})

@app.route('/api/decrypt-url', methods=['POST'])
def decrypt_url():
    data = request.get_json()
    encrypted_url = data.get('url')
    if not encrypted_url:
        return jsonify({'error': 'Missing encrypted URL'}), 400
    try:
        decrypted_url = fernet.decrypt(encrypted_url.encode()).decode()
        print(f"Decrypted URL: {decrypted_url}")
        return jsonify({'url': decrypted_url})
    except Exception as e:
        return jsonify({'error': f'Decryption failed: {e}'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
