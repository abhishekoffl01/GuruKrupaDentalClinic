<?php
/**
 * ==============================================================================
 * Admin Action: Delete Enquiry
 * ==============================================================================
 * Method: POST only
 * Authentication: Required
 * CSRF Verification: Required
 * Permanently deletes an enquiry record from the MySQL database.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed. Destructive actions require POST.');
}

$csrfToken = $_POST['csrf_token'] ?? '';
if (!verifyCsrfToken($csrfToken)) {
    die('Security validation failed (Invalid CSRF token).');
}

$id = (int)($_POST['id'] ?? 0);
$returnUrl = $_POST['return_url'] ?? 'dashboard.php';

if ($id > 0) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare('DELETE FROM enquiries WHERE id = :id');
        $stmt->execute([':id' => $id]);
    } catch (\Throwable $e) {
        error_log('Delete Enquiry Error: ' . $e->getMessage());
    }
}

redirect($returnUrl . (strpos($returnUrl, '?') !== false ? '&' : '?') . 'msg=deleted');
