// Function to get URL parameters
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Function to connect to VNC using a token
async function connectWithToken() {
    const token = getUrlParameter('token');
    if (!token) {
        console.error('No token provided');
        return;
    }

    try {
        // Fetch connection details using the token
        const response = await fetch(`/api/novnc-connect/${token}`);
        if (!response.ok) {
            throw new Error('Failed to get connection details');
        }

        const connectionDetails = await response.json();

        // Configure noVNC connection
        const rfb = new RFB(
            document.getElementById('screen'),
            `ws${connectionDetails.encrypt === '1' ? 's' : ''}://${connectionDetails.host}:${connectionDetails.port}`,
            {
                credentials: { password: connectionDetails.password },
                wsPath: connectionDetails.path,
                autoconnect: connectionDetails.autoconnect === '1'
            }
        );

        // Add event listeners for connection status
        rfb.addEventListener('connect', () => {
            console.log('Connected to remote host');
        });

        rfb.addEventListener('disconnect', () => {
            console.log('Disconnected from remote host');
        });

        rfb.addEventListener('credentialsrequired', () => {
            console.log('Credentials required');
        });
    } catch (error) {
        console.error('Failed to establish connection:', error);
    }
}

// Initialize connection when the page loads
document.addEventListener('DOMContentLoaded', connectWithToken); 