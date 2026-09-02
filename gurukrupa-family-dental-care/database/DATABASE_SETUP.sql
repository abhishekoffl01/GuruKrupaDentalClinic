-- ==============================================================================
-- Gurukrupa Family Dental Care - MySQL Database Setup Script
-- Compatible with Hostinger Shared Hosting (phpMyAdmin / MySQL 5.7+ / MariaDB 10.3+)
-- ==============================================================================
--
-- INSTRUCTIONS:
-- 1. Log in to your Hostinger hPanel -> Databases -> phpMyAdmin.
-- 2. Select your newly created dental hospital database.
-- 3. Click the "Import" tab (or "SQL" tab) at the top.
-- 4. Upload or paste this file content and click "Go".
--
-- NOTE: Do not create the database here; create the database first in Hostinger.
-- ==============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- Table 1: admin_users (Stores administrative login accounts with hashed passwords)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `email` VARCHAR(120) NULL DEFAULT NULL,
  `full_name` VARCHAR(100) NULL DEFAULT NULL,
  `last_login` DATETIME NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Table 2: enquiries (Stores patient appointment requests & contact messages)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_ref` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(120) NULL DEFAULT NULL,
  `service` VARCHAR(150) NULL DEFAULT 'General Dental Consultation',
  `preferred_date` VARCHAR(30) NULL DEFAULT NULL,
  `preferred_time` VARCHAR(80) NULL DEFAULT NULL,
  `message` TEXT NULL DEFAULT NULL,
  `preferred_contact` VARCHAR(30) NULL DEFAULT 'phone',
  `is_read` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('new', 'contacted', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'new',
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `user_agent` VARCHAR(255) NULL DEFAULT NULL,
  `admin_notes` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_booking_ref` (`booking_ref`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- Note: Passwords must always be generated via PHP password_hash().
-- To create your initial admin account, visit https://yourdomain.com/admin/setup-admin.php
-- ------------------------------------------------------------------------------
