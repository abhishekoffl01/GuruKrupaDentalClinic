<?php
/**
 * ==============================================================================
 * Database Connection Helper (PDO)
 * ==============================================================================
 * Connects securely to the Hostinger MySQL database using PHP Data Objects (PDO)
 * with strict prepared statements, UTF-8 charset, and safe error suppression.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';

function getDbConnection(): PDO {
    static $pdoInstance = null;

    if ($pdoInstance !== null) {
        return $pdoInstance;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES ' . DB_CHARSET,
    ];

    try {
        $pdoInstance = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdoInstance;
    } catch (PDOException $e) {
        // Log the error internally without exposing credentials to visitors
        error_log('Database Connection Error: ' . $e->getMessage());

        if (defined('APP_ENV') && APP_ENV === 'development') {
            throw new Exception('Database connection failed: ' . $e->getMessage());
        } else {
            throw new Exception('Database service is currently unavailable. Please verify configuration.');
        }
    }
}
