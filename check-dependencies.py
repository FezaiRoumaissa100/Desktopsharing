#!/usr/bin/env python3
"""
Check if all required dependencies are installed for Desktop Sharing
"""

import subprocess
import sys
import os

def check_command(command, description):
    """Check if a command is available"""
    try:
        result = subprocess.run([command, '--help'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} ({command}) - Available")
            return True
        else:
            print(f"❌ {description} ({command}) - Not working properly")
            return False
    except FileNotFoundError:
        print(f"❌ {description} ({command}) - Not found")
        return False
    except Exception as e:
        print(f"❌ {description} ({command}) - Error: {e}")
        return False

def check_python_package(package, description):
    """Check if a Python package is installed"""
    try:
        __import__(package)
        print(f"✅ {description} ({package}) - Installed")
        return True
    except ImportError:
        print(f"❌ {description} ({package}) - Not installed")
        return False

def main():
    print("🔍 Desktop Sharing Dependency Checker (noVNC)")
    print("=" * 50)
    
    all_good = True
    
    # Check Python packages
    print("\n📦 Python Packages:")
    packages = [
        ('flask', 'Flask Web Framework'),
        ('flask_cors', 'Flask CORS Extension'),
        ('cryptography', 'Cryptography Library'),
    ]
    
    for package, description in packages:
        if not check_python_package(package, description):
            all_good = False
    
    # Check system commands
    print("\n🛠️  System Commands:")
    commands = [
        ('websockify', 'WebSocket Proxy (for noVNC)'),
    ]
    
    for command, description in commands:
        if not check_command(command, description):
            all_good = False
    
    # Check noVNC installation
    print("\n🌐 noVNC Installation:")
    novnc_path = "public/noVNC"
    if os.path.exists(novnc_path):
        print(f"✅ noVNC - Found at {novnc_path}")
    else:
        print(f"❌ noVNC - Not found at {novnc_path}")
        print("   Please ensure noVNC is installed in the public directory")
        all_good = False
    
    # Check certificates
    print("\n🔐 Certificates:")
    cert_dir = "backend/certs"
    cert_path = os.path.join(cert_dir, "vnc_cert.pem")
    key_path = os.path.join(cert_dir, "vnc_key.pem")
    
    if os.path.exists(cert_path) and os.path.exists(key_path):
        print(f"✅ SSL Certificates - Found in {cert_dir}")
    else:
        print(f"❌ SSL Certificates - Not found in {cert_dir}")
        print("   They will be generated automatically when needed")
    
    # Summary
    print("\n" + "=" * 50)
    if all_good:
        print("🎉 All dependencies are available!")
        print("   You can now run: python start-backend.py")
    else:
        print("⚠️  Some dependencies are missing.")
        print("\n📋 Installation Instructions:")
        print("1. Install Python packages: pip install -r backend/requirements.txt")
        print("2. Install websockify: pip install websockify")
        print("3. Install noVNC:")
        print("   - Download from https://github.com/novnc/noVNC")
        print("   - Extract to public/noVNC directory")
        print("   - Or run: git clone https://github.com/novnc/noVNC.git public/noVNC")
    
    return all_good

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 