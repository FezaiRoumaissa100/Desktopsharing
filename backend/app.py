from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import socket
import random
import string
import os

app = Flask(__name__)
CORS(app)

def get_local_ip():
    try:
        result = subprocess.run(['ipconfig'], capture_output=True, text=True, check=True)
        output = result.stdout
        wifi_section = None
        for section in re.split(r'\r?\n\r?\n', output):
            if ("Wireless LAN adapter Wi-Fi" in section) or ("Carte réseau sans fil Wi-Fi" in section):
                wifi_section = section
                break
        if not wifi_section:
            return "Not found"
        match = re.search(r'IPv4 Address[. ]*: ([0-9.]+)', wifi_section)
        if not match:
            match = re.search(r'Adresse IPv4[. ]*: ([0-9.]+)', wifi_section)
        if match:
            return match.group(1)
        else:
            return "Not found"
    except Exception as e:
        return f"Error: {e}"

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
    # Démarrer TightVNC (le mot de passe ne sera pas appliqué)
    try:
        subprocess.Popen([
            r"C:\Program Files\TightVNC\tvnserver.exe",
            "-run"
        ])
    except Exception as e:
        print(f"Erreur lors du démarrage de TightVNC : {e}")
    return jsonify({'ip': ip, 'ips': ips, 'password': password})

@app.route('/api/start-novnc', methods=['POST'])
def start_novnc():
    data = request.get_json()
    ip = data.get('ip')
    password = data.get('password')
    if not ip or not password:
        return jsonify({'error': 'IP ou mot de passe manquant'}), 400
    # Exécute la commande système pour lancer noVNC avec SSL/TLS
    try:
        subprocess.Popen([
            'websockify',
            '--cert=cert.pem',
            '--key=key.pem',
            '8085',
            f'{ip}:5900'
        ])
    except Exception as e:
        return jsonify({'error': f'Erreur démarrage noVNC : {e}'}), 500
    host_ip = request.host.split(':')[0]
    # Redirige vers l'interface web noVNC servie par Next.js (port 3000) avec le mot de passe et autoconnect
    url = f'http://{host_ip}:3000/novnc/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&password={password}&autoconnect=1'
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 