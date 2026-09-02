<?php
/**
 * ==============================================================================
 * Gurukrupa Family Dental Care - Central Configuration File
 * ==============================================================================
 * This configuration file contains all core business details, database settings,
 * email parameters, and security tokens for the website on Hostinger shared hosting.
 *
 * IMPORTANT SECURITY NOTES:
 * 1. Update the DB_* settings with your Hostinger MySQL database credentials.
 * 2. Set a unique random string for APP_SECRET.
 * 3. Never commit real production passwords to public repositories.
 * ==============================================================================
 */

// Prevent direct script execution from non-PHP contexts
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__));
}

// ------------------------------------------------------------------------------
// 1. BUSINESS & CLINIC INFORMATION
// ------------------------------------------------------------------------------
define('SITE_NAME', 'Gurukrupa Family Dental Care');
define('SITE_TAGLINE', 'Precision Dentistry with a Gentle, Caring Touch');
define('SITE_SUBTITLE', 'Advanced Multi-Speciality Dental Hospital & Smile Care Centre');
define('SITE_URL', 'https://moneyandmeaning.in'); // Replace with your live domain
define('SITE_DOMAIN', 'moneyandmeaning.in');

// Contact Details
define('SITE_PHONE', '096117 11884');
define('SITE_PHONE_CLEAN', '09611711884');
define('SITE_PHONE_INTERNATIONAL', '+919611711884');
define('WHATSAPP_NUMBER', '919611711884');
define('WHATSAPP_DEFAULT_MESSAGE', 'Hello Gurukrupa Family Dental Care, I would like to book a dental appointment.');

// Address & Maps
define('SITE_ADDRESS', '72, Service Road, Laggere, Kempegowda Layout, Bengaluru, Karnataka 560057');
define('SITE_AREA', 'Laggere, Kempegowda Layout, Bengaluru');
define('SITE_PINCODE', '560057');
define('SITE_MAPS_URL', 'https://maps.google.com/?q=Gurukrupa+Family+Dental+Care+72+Service+Road+Laggere+Bengaluru+560057');
define('SITE_MAPS_EMBED_SRC', 'https://maps.google.com/maps?q=72%20Service%20Road%20Laggere%20Kempegowda%20Layout%20Bengaluru%20560057&t=&z=15&ie=UTF8&iwloc=&output=embed');

// ------------------------------------------------------------------------------
// 2. DATABASE SETTINGS (Hostinger MySQL Database)
// ------------------------------------------------------------------------------
// Replace these with your database credentials from Hostinger cPanel / hPanel
define('DB_HOST', 'localhost'); // Usually 'localhost' on Hostinger
define('DB_NAME', 'u345864284_GuruKrupa'); // Your Hostinger Database Name
define('DB_USER', 'u345864284_GuruKrupa'); // Your Hostinger Database Username
define('DB_PASS', 'Guruk@9845'); // Your Hostinger Database Password
define('DB_CHARSET', 'utf8mb4');

// ------------------------------------------------------------------------------
// 3. EMAIL NOTIFICATION SETTINGS
// ------------------------------------------------------------------------------
define('BUSINESS_EMAIL', 'care@moneyandmeaning.in'); // Enquiries will be sent here
define('MAIL_FROM_ADDRESS', 'notifications@moneyandmeaning.in');
define('MAIL_FROM_NAME', 'Gurukrupa Dental Website');

// Optional SMTP Configuration (Default is PHP native mail())
define('USE_SMTP', false); // Set to true if using PHPMailer / SMTP on Hostinger
define('SMTP_HOST', 'smtp.hostinger.com');
define('SMTP_PORT', 465);
define('SMTP_SECURE', 'ssl'); // 'ssl' or 'tls'
define('SMTP_USER', 'notifications@moneyandmeaning.in');
define('SMTP_PASS', 'YOUR_EMAIL_ACCOUNT_PASSWORD_HERE');

// ------------------------------------------------------------------------------
// 4. SECURITY & SESSION SETTINGS
// ------------------------------------------------------------------------------
// Secret key used for signing CSRF tokens and internal security hashes
define('APP_SECRET', 'gfdc_hostinger_secure_key_b94e3189a74c7283c749103c80');
define('SESSION_LIFETIME', 7200); // 2 hours in seconds
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_TIME', 900); // 15 minutes

// ------------------------------------------------------------------------------
// 5. ERROR REPORTING & ENVIRONMENT
// ------------------------------------------------------------------------------
// Change to 'production' before public deployment
define('APP_ENV', 'production'); // 'development' or 'production'

if (APP_ENV === 'development') {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(0);
}
