<?php
/**
 * ==============================================================================
 * Security & Common Helper Functions
 * ==============================================================================
 * Centralized security functions for CSRF verification, HTML escaping,
 * authentication checks, input sanitization, and safe redirection.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';

/**
 * Start a secure PHP session with hardened cookie parameters
 */
function startSecureSession(): void {
    if (session_status() === PHP_SESSION_NONE) {
        $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
                    (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

        session_set_cookie_params([
            'lifetime' => defined('SESSION_LIFETIME') ? SESSION_LIFETIME : 7200,
            'path'     => '/',
            'domain'   => '',
            'secure'   => $isSecure,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_start();
    }
}

/**
 * Escape HTML output to prevent Cross-Site Scripting (XSS)
 */
function e(?string $string): string {
    if ($string === null) {
        return '';
    }
    return htmlspecialchars($string, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

/**
 * Generate a cryptographically secure CSRF token
 */
function generateCsrfToken(): string {
    startSecureSession();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify a submitted CSRF token
 */
function verifyCsrfToken(?string $token): bool {
    startSecureSession();
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Render a hidden CSRF input field for HTML forms
 */
function getCsrfInput(): string {
    return '<input type="hidden" name="csrf_token" value="' . e(generateCsrfToken()) . '">';
}

/**
 * Check if an administrator is currently logged in
 */
function isAdminLoggedIn(): bool {
    startSecureSession();
    return !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true && !empty($_SESSION['admin_id']);
}

/**
 * Enforce administrator authentication on protected admin pages
 */
function requireAdminAuth(): void {
    if (!isAdminLoggedIn()) {
        redirect('login.php?redirect=' . urlencode($_SERVER['REQUEST_URI'] ?? 'dashboard.php'));
    }
}

/**
 * Get the currently logged-in administrator details
 */
function getCurrentAdmin(): ?array {
    if (!isAdminLoggedIn()) {
        return null;
    }
    return [
        'id'       => $_SESSION['admin_id'] ?? 0,
        'username' => $_SESSION['admin_username'] ?? 'Admin',
    ];
}

/**
 * Sanitize text input string
 */
function sanitizeInput(?string $input, int $maxLength = 1000): string {
    if ($input === null) {
        return '';
    }
    $trimmed = trim($input);
    // Strip control characters except newline and tab
    $clean = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $trimmed);
    return mb_substr($clean, 0, $maxLength, 'UTF-8');
}

/**
 * Sanitize phone number (remove non-digits except +)
 */
function sanitizePhone(?string $phone): string {
    if ($phone === null) {
        return '';
    }
    return preg_replace('/[^\d\+\-\s\(\)]/', '', trim($phone));
}

/**
 * Send a structured JSON response and terminate script
 */
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Perform a safe HTTP redirect
 */
function redirect(string $url): void {
    header('Location: ' . $url);
    exit;
}

/**
 * Retrieve the visitor's real client IP address safely
 */
function getClientIp(): string {
    $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            $ip = trim($ipList[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

/**
 * Generate human-friendly relative time string
 */
function timeAgo(string $datetime): string {
    $timestamp = strtotime($datetime);
    if (!$timestamp) return $datetime;

    $difference = time() - $timestamp;
    if ($difference < 60) {
        return 'Just now';
    } elseif ($difference < 3600) {
        $minutes = round($difference / 60);
        return $minutes . ' min' . ($minutes > 1 ? 's' : '') . ' ago';
    } elseif ($difference < 86400) {
        $hours = round($difference / 3600);
        return $hours . ' hr' . ($hours > 1 ? 's' : '') . ' ago';
    } elseif ($difference < 604800) {
        $days = round($difference / 86400);
        return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
    } else {
        return date('M j, Y g:i A', $timestamp);
    }
}
