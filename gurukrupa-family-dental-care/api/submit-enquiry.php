<?php
/**
 * ==============================================================================
 * API Endpoint: Submit Patient Enquiry / Appointment
 * ==============================================================================
 * Route: /api/submit-enquiry.php
 * Handles appointment form submissions from React frontend, validates input,
 * persists enquiry to MySQL database using prepared PDO statements, and sends
 * email notification to the clinic desk.
 * ==============================================================================
 */

// Allow cross-origin requests for local dev / preview environments
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../includes/mail.php';

// Parse JSON request body if applicable, or fallback to $_POST
$rawInput = file_get_contents('php://input');
$inputData = [];

if (!empty($rawInput)) {
    $decoded = json_decode($rawInput, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $inputData = $decoded;
    }
}

if (empty($inputData)) {
    $inputData = $_POST;
}

// Extract and sanitize input parameters
$name = sanitizeInput($inputData['name'] ?? $inputData['fullName'] ?? '', 100);
$phone = sanitizePhone($inputData['phone'] ?? '');
$email = sanitizeInput($inputData['email'] ?? '', 120);
$service = sanitizeInput($inputData['service'] ?? $inputData['serviceId'] ?? 'General Dental Consultation', 150);
$preferredDate = sanitizeInput($inputData['date'] ?? $inputData['preferredDate'] ?? date('Y-m-d', strtotime('+1 day')), 40);
$preferredTime = sanitizeInput($inputData['time'] ?? $inputData['preferredTime'] ?? 'Morning (9:30 AM – 1:00 PM)', 80);
$message = sanitizeInput($inputData['message'] ?? $inputData['notes'] ?? '', 2000);
$preferredContact = sanitizeInput($inputData['preferredContact'] ?? 'phone', 30);
$csrfToken = $inputData['csrf_token'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? null);

// Server-side validation
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Please enter your valid full name.';
}

$digitsOnly = preg_replace('/[^\d]/', '', $phone);
if (empty($phone) || strlen($digitsOnly) < 8) {
    $errors[] = 'Please provide a valid contact phone number with at least 8 digits.';
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'The provided email address format is invalid.';
}

if (!empty($errors)) {
    jsonResponse([
        'success' => false,
        'message' => implode(' ', $errors),
        'errors'  => $errors,
    ], 422);
}

// Generate unique booking reference
$bookingRef = 'GFDC-' . date('ymd') . '-' . strtoupper(substr(md5(uniqid((string)mt_rand(), true)), 0, 4));
$ipAddress = getClientIp();
$userAgent = mb_substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);

$savedToDatabase = false;

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare('
        INSERT INTO enquiries (
            booking_ref,
            name,
            phone,
            email,
            service,
            preferred_date,
            preferred_time,
            message,
            preferred_contact,
            is_read,
            status,
            ip_address,
            user_agent,
            created_at
        ) VALUES (
            :booking_ref,
            :name,
            :phone,
            :email,
            :service,
            :preferred_date,
            :preferred_time,
            :message,
            :preferred_contact,
            0,
            "new",
            :ip_address,
            :user_agent,
            NOW()
        )
    ');

    $stmt->execute([
        ':booking_ref'        => $bookingRef,
        ':name'               => $name,
        ':phone'              => $phone,
        ':email'              => !empty($email) ? $email : null,
        ':service'            => $service,
        ':preferred_date'     => $preferredDate,
        ':preferred_time'     => $preferredTime,
        ':message'            => !empty($message) ? $message : null,
        ':preferred_contact'  => $preferredContact,
        ':ip_address'         => $ipAddress,
        ':user_agent'         => $userAgent,
    ]);

    $savedToDatabase = true;
} catch (\Throwable $e) {
    error_log('Database insertion error for enquiry: ' . $e->getMessage());
    // Note: Do not leak DB error to user
}

// Dispatch Email Notification in background (non-blocking failure)
$enquiryPayload = [
    'booking_ref'    => $bookingRef,
    'name'           => $name,
    'phone'          => $phone,
    'email'          => $email,
    'service'        => $service,
    'preferred_date' => $preferredDate,
    'preferred_time' => $preferredTime,
    'message'        => $message,
    'ip_address'     => $ipAddress,
];

sendEnquiryNotificationEmail($enquiryPayload);

// Return professional success response
jsonResponse([
    'success'     => true,
    'message'     => 'Thank you. Your enquiry has been received. We will get back to you shortly.',
    'booking_ref' => $bookingRef,
    'details'     => [
        'name'           => $name,
        'phone'          => $phone,
        'service'        => $service,
        'preferred_date' => $preferredDate,
        'preferred_time' => $preferredTime,
    ],
], 200);
