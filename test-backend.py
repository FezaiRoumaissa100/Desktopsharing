#!/usr/bin/env python3
"""
Test script to verify backend imports work correctly
"""

import sys
import os

def test_imports():
    print("🧪 Testing backend imports...")
    
    # Change to backend directory
    if os.path.exists('backend'):
        os.chdir('backend')
        print("✅ Changed to backend directory")
    else:
        print("❌ Backend directory not found")
        return False
    
    try:
        # Test importing the modules
        print("📦 Testing cert_manager import...")
        from cert_manager import cert_manager
        print("✅ cert_manager imported successfully")
        
        print("📦 Testing vnc_manager import...")
        from vnc_manager import vnc_manager
        print("✅ vnc_manager imported successfully")
        
        print("📦 Testing Flask app import...")
        from app import app
        print("✅ Flask app imported successfully")
        
        print("🎉 All imports successful!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    if success:
        print("\n🚀 Backend is ready to start!")
        print("Run: python start-backend.py")
    else:
        print("\n❌ Backend has import issues that need to be fixed")
        sys.exit(1) 