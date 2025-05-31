from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import socket
import random
import string
import os

app = Flask(__name__)
CORS(app)

def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

@app.route('/api/start-share', methods=['POST'])
def start_share():
    password = generate_password()
    ip = get_local_ip()
    # Write password to a file for tightvnc
    with open('vncpass.txt', 'w') as f:
        f.write(password)
    # Set password for tightvnc (Linux example)
    # subprocess.run(['vncpasswd', '-f'], input=password.encode(), check=True)
    # Start tightvncserver (Linux example)
    # subprocess.Popen(['tightvncserver', ':1', '-geometry', '1280x800', '-rfbauth', 'vncpass.txt'])
    # For Windows, adapt the command to your installation
    # Example: subprocess.Popen(['C:\\Program Files\\TightVNC\\tvnserver.exe', '-run'])
    # (You may need to adjust the command for your system)
    return jsonify({'ip': ip, 'password': password})

@app.route('/api/start-novnc', methods=['POST'])
def start_novnc():
    data = request.get_json()
    ip = data.get('ip')
    if not ip:
        return jsonify({'error': 'IP manquante'}), 400
    # Exécute la commande système pour lancer noVNC
    subprocess.Popen(['novnc', '--target', f'{ip}:5900', '--listen', 'localhost:8085'])
    host_ip = request.host.split(':')[0]
    url = f'http://{host_ip}:8085'
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 