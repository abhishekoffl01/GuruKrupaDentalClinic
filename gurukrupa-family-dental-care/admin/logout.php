<?php
/**
 * ==============================================================================
 * Admin Logout Action
 * ==============================================================================
 * Safely destroys the active administrator session and redirects to login.php.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/helpers.php';

startSecureSession();

// Unset all session variables
$_SESSION = [];

// Delete session cookie if set
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Destroy session
session_destroy();

redirect('login.php?logged_out=1');
