<?php
/**
 * ==============================================================================
 * Admin Action: Mark Enquiry as Unread
 * ==============================================================================
 * Method: POST only
 * Authentication: Required
 * CSRF Verification: Required
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed. POST is required.');
}

$csrfToken = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($csrfToken)) {
    die('Security validation error (Invalid CSRF token).');
}

$id = (int)($_POST['id'] ?? 0);
$returnUrl = $_POST['return_url'] ?? 'dashboard.php';

if ($id > 0) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare('UPDATE enquiries SET is_read = 0 WHERE id = :id');
        $stmt->execute([':id' => $id]);
    } catch (\Throwable $e) {
        error_log('Mark Unread Error: ' . $e->getMessage());
    }
}

redirect($returnUrl . (strpos($returnUrl, '?') !== false ? '&' : '?') . 'msg=read_updated');
