#!/usr/bin/env python3
"""
Install dependencies for the Desktop Sharing project
"""

import subprocess
import sys
import os

def install_dependencies():
    print("📦 Installing Desktop Sharing Dependencies")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('backend/requirements.txt'):
        print("❌ Error: Please run this script from the project root directory")
        print("   (where backend/requirements.txt is located)")
        return False
    
    try:
        # Install backend dependencies
        print("🔧 Installing backend dependencies...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "backend/requirements.txt"])
        print("✅ Backend dependencies installed successfully")
        
        # Check if frontend dependencies need to be installed
        if os.path.exists('package.json'):
            print("🔧 Installing frontend dependencies...")
            subprocess.check_call(["npm", "install"])
            print("✅ Frontend dependencies installed successfully")
        elif os.path.exists('pnpm-lock.yaml'):
            print("🔧 Installing frontend dependencies with pnpm...")
            subprocess.check_call(["pnpm", "install"])
            print("✅ Frontend dependencies installed successfully")
        else:
            print("⚠️  No frontend package manager files found, skipping frontend dependencies")
        
        print("\n🎉 All dependencies installed successfully!")
        print("\nNext steps:")
        print("1. Test backend: python test-backend.py")
        print("2. Start backend: python start-backend.py")
        print("3. Start frontend: npm run dev (or pnpm dev)")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False
    except FileNotFoundError:
        print("❌ Error: pip or npm not found. Please install Python and Node.js first.")
        return False

if __name__ == "__main__":
    success = install_dependencies()
    if not success:
        sys.exit(1) 