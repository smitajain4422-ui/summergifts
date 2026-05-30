export default async function handler(req, res) {
    const user = req.query.user;
    
    // Your live Wispbyte Node.js server
    const WISPBYTE_IP_URL = "http://93.115.101.158:12582/";

    if (!user) {
        return res.status(400).json({ error: 'No user provided' });
    }

    try {
        // Vercel's server securely asks your HTTP Wispbyte server in the background
        const response = await fetch(`${WISPBYTE_IP_URL}?action=check&user=${encodeURIComponent(user)}`);
        
        if (!response.ok) {
             throw new Error(`Wispbyte server responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Send the JSON result back to your secure frontend
        return res.status(200).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to contact Wispbyte server' });
    }
}
