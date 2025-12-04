const functions = require('firebase-functions');
const fetch = require('node-fetch');

// CORS-enabled Freeimage upload proxy
exports.freeimageUpload = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { base64Image, apiKey } = req.body;

    if (!base64Image || !apiKey) {
      res.status(400).json({ error: 'Missing base64Image or apiKey' });
      return;
    }

    // Build form data for Freeimage API
    const params = new URLSearchParams();
    params.append('key', apiKey);
    params.append('action', 'upload');
    params.append('source', base64Image);
    params.append('format', 'json');

    // Call Freeimage API
    const response = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Freeimage proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});
