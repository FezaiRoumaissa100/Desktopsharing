"""
Centralized VNC Management for Secure Desktop Sharing with noVNC
Simplified approach using noVNC web client
"""

import subprocess
import time
import socket
import os
import random
from typing import Optional, Tuple
from cert_manager import cert_manager

class VNCManager:
    def __init__(self):
        # Set novnc_path to the absolute path at the project root
        self.novnc_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "noVNC"))
        self.active_sessions = {}
    
    def get_local_ip(self) -> str:
        """Get local IP address"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            print(f"Detected local IP: {ip}")
            return ip
        except Exception:
            return "127.0.0.1"
    
    
    def start_websockify_proxy(self, target_ip: str, target_port: int, proxy_port: int = 8085) -> Optional[subprocess.Popen]:
        """Start websockify proxy for noVNC with SSL and secure VNC connection (TLS/SSL)"""
        try:
            # Check if websockify is available
            try:
                subprocess.run(['websockify', '--help'], capture_output=True, check=True)
            except (subprocess.CalledProcessError, FileNotFoundError):
                print("Error: websockify command not found. Please install websockify.")
                print("Install with: pip install websockify")
                return None
            
            # Get certificates
            try:
                cert_path, key_path = cert_manager.get_certificate_paths()
                print(f"Using certificates for websockify: {cert_path}, {key_path}")
            except Exception as e:
                print(f"Error getting certificates for websockify: {e}")
                return None
            
            # Start websockify with SSL for noVNC and secure VNC connection
            websockify_cmd = [
                'websockify',
                '--cert', cert_path,
                '--key', key_path,
                '--ssl-only',
                '--web', self.novnc_path,
                '--ssl-target',
                f'{target_ip}:{target_port}'
            ]
            
            print(f"Starting websockify for noVNC with command: {' '.join(websockify_cmd)}")
            
            proxy_process = subprocess.Popen(
                websockify_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait a moment and check if it started successfully
            time.sleep(2)
            if proxy_process.poll() is not None:
                stdout, stderr = proxy_process.communicate()
                print(f"Websockify failed to start. stdout: {stdout}, stderr: {stderr}")
                return None
            
            print(f"Websockify proxy started successfully on port {proxy_port}")
            return proxy_process
            
        except Exception as e:
            print(f"Error starting websockify: {e}")
            return None
    
    def stop_vnc_server(self, display_number: int) -> bool:
        """Stop VNC session for given display"""
        try:
            if display_number in self.active_sessions:
                # Remove session info
                del self.active_sessions[display_number]
                print(f"Stopped noVNC session for display :{display_number}")
                return True
        except Exception as e:
            print(f"Error stopping noVNC session: {e}")
        return False
    
    def get_session_info(self, display_number: int) -> Optional[dict]:
        """Get information about noVNC session"""
        if display_number in self.active_sessions:
            session = self.active_sessions[display_number]
            return {
                'display': display_number,
                'port': session['port'],
                'ip': self.get_local_ip(),
                'secure': session.get('secure', True),
                'tls_enabled': True,
                'cert_path': session['cert_path'],
                'key_path': session['key_path'],
                'novnc_path': session.get('novnc_path', self.novnc_path)
            }
        return None
    
    def list_active_sessions(self) -> list:
        """List all active noVNC sessions"""
        return [self.get_session_info(display) for display in self.active_sessions.keys()]
    
    def cleanup_all_sessions(self):
        """Stop all active noVNC sessions"""
        for display_number in list(self.active_sessions.keys()):
            self.stop_vnc_server(display_number)
    
    def get_novnc_url(self, display_number: int, host_ip: str = None) -> Optional[str]:
        """Generate noVNC URL for a session"""
        if host_ip is None:
            host_ip = self.get_local_ip()
        
        session_info = self.get_session_info(display_number)
        if session_info:
            # Generate noVNC URL with SSL
            url = f'https://{host_ip}:8085/vnc.html?host={host_ip}&port=8085&encrypt=1&path=/&autoconnect=1&ssl=1'
            return url
        return None

# Global VNC manager instance
vnc_manager = VNCManager() 