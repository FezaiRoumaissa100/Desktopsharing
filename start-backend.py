#!/usr/bin/env python3
"""
Simple script to start the backend server
"""

import sys
import os
import subprocess

def main():
    print("🚀 Desktop Sharing Backend Starter")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('backend/app.py'):
        print("❌ Error: Please run this script from the project root directory")
        print("   (where backend/app.py is located)")
        sys.exit(1)
    
    print("Choose server mode:")
    print("1. HTTPS (Secure - recommended)")
    print("2. HTTP (Testing - for SSL certificate issues)")
    
    choice = input("\nEnter your choice (1 or 2): ").strip()
    
    if choice == "1":
        print("\n🔒 Starting secure HTTPS server...")
        print("   If you see SSL certificate warnings, accept them in your browser")
        print("   Server will be available at: https://127.0.0.1:5000")
        # Change to backend directory and run the app
        os.chdir('backend')
        subprocess.run([sys.executable, "app.py"])
    elif choice == "2":
        print("\n🚀 Starting HTTP server for testing...")
        print("   Server will be available at: http://127.0.0.1:5000")
        # Change to backend directory and run the app
        os.chdir('backend')
        subprocess.run([sys.executable, "app.py", "--http"])
    else:
        print("❌ Invalid choice. Please run the script again.")
        sys.exit(1)

if __name__ == "__main__":
    main() 