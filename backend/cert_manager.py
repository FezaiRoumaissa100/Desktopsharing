"""
Centralized Certificate Management for Secure VNC Desktop Sharing
Eliminates redundancy in certificate generation and management
"""

import os
import socket
import ipaddress
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from datetime import datetime, timedelta

class CertificateManager:
    def __init__(self, cert_dir="certs"):
        self.cert_dir = cert_dir
        os.makedirs(cert_dir, exist_ok=True)
        self.cert_path = os.path.join(cert_dir, 'vnc_cert.pem')
        self.key_path = os.path.join(cert_dir, 'vnc_key.pem')
    
    def generate_certificates(self, force_regenerate=False):
        """Generate SSL certificates if they don't exist or if forced"""
        if not force_regenerate and self._certificates_exist():
            return self.cert_path, self.key_path
        
        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        
        # Create certificate
        subject = issuer = x509.Name([
            x509.NameAttribute(NameOID.COUNTRY_NAME, "US"),
            x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Development"),
            x509.NameAttribute(NameOID.LOCALITY_NAME, "Local"),
            x509.NameAttribute(NameOID.ORGANIZATION_NAME, "VNC Secure Desktop"),
            x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        ])
        
        cert = x509.CertificateBuilder().subject_name(
            subject
        ).issuer_name(
            issuer
        ).public_key(
            private_key.public_key()
        ).serial_number(
            x509.random_serial_number()
        ).not_valid_before(
            datetime.utcnow()
        ).not_valid_after(
            datetime.utcnow() + timedelta(days=365)
        ).add_extension(
            x509.SubjectAlternativeName([
                x509.DNSName("localhost"),
                x509.DNSName("127.0.0.1"),
                x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
                x509.IPAddress(ipaddress.IPv4Address("0.0.0.0")),
            ]),
            critical=False,
        ).sign(private_key, hashes.SHA256())
        
        # Save certificate and key
        with open(self.cert_path, 'wb') as f:
            f.write(cert.public_bytes(serialization.Encoding.PEM))
        
        with open(self.key_path, 'wb') as f:
            f.write(private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        print(f"✅ SSL certificates generated: {self.cert_path}, {self.key_path}")
        return self.cert_path, self.key_path
    
    def _certificates_exist(self):
        """Check if certificates already exist"""
        return os.path.exists(self.cert_path) and os.path.exists(self.key_path)
    
    def get_certificate_paths(self):
        """Get certificate paths, generate if needed"""
        if not self._certificates_exist():
            return self.generate_certificates()
        return self.cert_path, self.key_path
    
    def validate_certificates(self):
        """Validate existing certificates"""
        if not self._certificates_exist():
            return False, "Certificates do not exist"
        
        try:
            with open(self.cert_path, 'rb') as f:
                cert_data = f.read()
            cert = x509.load_pem_x509_certificate(cert_data)
            
            # Check if certificate is expired
            if cert.not_valid_after < datetime.utcnow():
                return False, "Certificate has expired"
            
            return True, "Certificates are valid"
        except Exception as e:
            return False, f"Certificate validation failed: {e}"

# Global certificate manager instance
cert_manager = CertificateManager() 