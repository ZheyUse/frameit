<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the base64 image data and API key from the request
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['base64Image']) || !isset($input['apiKey'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing base64Image or apiKey']);
    exit();
}

$base64Image = $input['base64Image'];
$apiKey = $input['apiKey'];

// Prepare the data for Freeimage.host API
$postData = [
    'key' => $apiKey,
    'action' => 'upload',
    'source' => $base64Image,
    'format' => 'json'
];

// Initialize cURL
$ch = curl_init('https://freeimage.host/api/1/upload');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/x-www-form-urlencoded',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
]);

// Execute the request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . $curlError]);
    exit();
}

// Return the response from Freeimage.host
http_response_code($httpCode);
echo $response;
?>
