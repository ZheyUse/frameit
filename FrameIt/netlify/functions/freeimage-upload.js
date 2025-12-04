const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { base64Image, apiKey } = JSON.parse(event.body);

    if (!base64Image || !apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing base64Image or apiKey' })
      };
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

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Freeimage proxy error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
