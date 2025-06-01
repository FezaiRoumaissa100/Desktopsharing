from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import socket
import random
import string
import psutil  # Added import
import os

app = Flask(__name__)
CORS(app)

def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def get_wifi_ip():
    addrs = psutil.net_if_addrs()
    for interface_name, addr_list in addrs.items():
        if "Wi-Fi" in interface_name or "wlan" in interface_name.lower():
            for addr in addr_list:
                if addr.family == socket.AF_INET:
                    return addr.address
    # Fallback to default method if Wi-Fi not found
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    except Exception:
        return '127.0.0.1'
    finally:
        s.close()

@app.route('/api/start-share', methods=['POST'])
def start_share():
    password = generate_password()
    ip = get_wifi_ip()
    print(ip)
    with open('vncpass.txt', 'w') as f:
        f.write(password)
    # Windows TightVNC example (update path if needed):
    # subprocess.Popen(['C:\\Program Files\\TightVNC\\tvnserver.exe', '-run'])
    return jsonify({'ip': ip, 'password': password})

@app.route('/api/start-novnc', methods=['POST'])
def start_novnc():
    data = request.get_json()
    ip = get_wifi_ip()
    if not ip:
        return jsonify({'error': 'IP manquante'}), 400
    subprocess.Popen(['novnc', '--target', f'{ip}:5900', '--listen', 'localhost:8085'])
    host_ip = request.host.split(':')[0]
    url = f'http://{host_ip}:8085'
    return jsonify({'url': url})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
