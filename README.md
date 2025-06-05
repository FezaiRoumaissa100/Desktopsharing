# VNCConnect

A modern web-based VNC (Virtual Network Computing) application that allows remote desktop access through a web browser.

## Features

- Secure remote desktop access  
- Permission management  
- Browser-based  
- Cross-platform  
- End-to-end encryption  

## Architecture

VNCConnect uses the following technologies:

- **Next.js**: React framework for the frontend  
- **Flask (Python)**: Backend handling system commands for TightVNC and noVNC  
- **WebRTC**: For direct peer-to-peer connections  
- **Socket.IO**: For signaling and establishing WebRTC connections  
- **Tailwind CSS**: For styling  
- **shadcn/ui**: For UI components  

The application is composed of the following main components:

- **Frontend (Next.js)**: Manages UI, navigation, and API calls  
- **Backend (Flask)**: Executes system commands (e.g., TightVNC, noVNC)  
- **Socket Server**: Handles signaling for WebRTC connections  
- **VNC Host**: Captures and shares the screen  
- **VNC Client**: Receives and displays the remote screen  

## Usage Scenario

1. **Start Session Page**: Offers two buttons  
   - "Share My Screen"  
   - "Access a Screen"  
2. **Sharing a Screen**:  
   - The backend generates an encrypted link using Fernet encryption  
3. **Accessing a Screen**:  
   - The user inputs the shared link  
   - The backend launches noVNC and redirects the user to the noVNC interface  

## Running the Project

1. Start the Flask backend:  
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py

2. Start the Next.js frontend:
   ```bash
   npm install
   npm run dev


## Security
- The backend executes system-level commands — it must be used in a controlled testing environment only.
- A new Fernet encryption key is generated randomly on every server startup.
- Support for SSL/TLS certificates.
