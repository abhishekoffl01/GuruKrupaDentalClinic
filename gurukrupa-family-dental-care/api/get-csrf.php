<?php
/**
 * ==============================================================================
 * API Endpoint: Retrieve CSRF Token
 * ==============================================================================
 * Route: /api/get-csrf.php
 * Returns an active CSRF token for secure state-changing POST operations.
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/helpers.php';

startSecureSession();
$token = generateCsrfToken();

jsonResponse([
    'success'    => true,
    'csrf_token' => $token,
]);
