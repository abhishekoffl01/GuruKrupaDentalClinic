<?php
/**
 * ==============================================================================
 * Admin Index Controller
 * ==============================================================================
 * Redirects authenticated administrators to dashboard.php and unauthenticated
 * users to login.php.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/helpers.php';

startSecureSession();

if (isAdminLoggedIn()) {
    redirect('dashboard.php');
} else {
    redirect('login.php');
}
