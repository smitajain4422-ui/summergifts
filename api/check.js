export default async function handler(req, res) {
    const user = req.query.user;
    const WISPBYTE_IP_URL = "http://93.115.101.158:12582/";

    if (!user) {
        return res.status(400).json({ error: 'No user provided' });
    }

    try {
        // We added &t=... to the end so Vercel is forced to make a fresh request to Wispbyte every time
        const response = await fetch(`${WISPBYTE_IP_URL}?action=check&user=${encodeURIComponent(user)}&t=${Date.now()}`, {
            cache: 'no-store', // Forces Vercel not to cache
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) throw new Error(`Wispbyte error: ${response.status}`);
        const data = await response.json();
        
        // Tells the user's web browser NOT to cache this response
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        return res.status(200).json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: 'Failed to contact Wispbyte' });
    }
}
