# Gurukrupa Family Dental Care — Production Website & Management System

> **Premier Multi-Speciality Dental Hospital & Smile Care Centre**  
> **Location:** 72, Service Road, Laggere, Kempegowda Layout, Bengaluru, Karnataka 560057  
> **Contact:** 096117 11884 | WhatsApp: +91 96117 11884 | Email: care@moneyandmeaning.in  

---

## 📋 System Architecture

This project is architected for **Hostinger Shared Hosting / cPanel / LiteSpeed / Apache** with a lightweight, secure, and modern stack:

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (compiled into high-speed static assets).
- **Backend:** Native PHP 8.x / 7.4 (Zero Node.js dependency on production server).
- **Database:** MySQL / MariaDB via secure PDO with prepared statements.
- **Security:**
  - Strict CSRF validation on all state-changing endpoints
  - BCRYPT password hashing (`password_hash()` / `password_verify()`)
  - Session hijacking protection (HttpOnly, SameSite=Lax, cookie parameters, timeout)
  - Apache `.htaccess` rules preventing directory listing and protecting `/config`, `/includes`, and `/database`
  - Input sanitization and XSS escaping (`htmlspecialchars`)

---

## 🗂️ Project Directory Structure

```text
├── admin/                     # Admin Portal (PHP)
│   ├── index.php              # Router & Auth Check
│   ├── login.php              # Secure Admin Login
│   ├── dashboard.php          # Real-time Enquiries Dashboard & CSV Export
│   ├── view-enquiry.php       # Lead Details, Call/WhatsApp, Reception Notes
│   ├── mark-read.php          # Mark as Read Action (POST + CSRF)
│   ├── mark-unread.php        # Mark as Unread Action (POST + CSRF)
│   ├── delete-enquiry.php     # Delete Record Action (POST + CSRF)
│   ├── logout.php             # Safe Session Destroyer
│   └── setup-admin.php        # First-Time Admin Account Initializer
│
├── api/                       # Public API Endpoints (PHP)
│   ├── submit-enquiry.php     # Appointment Submission, Email Alert, DB Insert
│   └── get-csrf.php           # CSRF Token Generator for Client
│
├── config/                    # Configuration Files
│   └── config.php             # Database Credentials & Clinic Settings
│
├── includes/                  # Core PHP Utilities
│   ├── db.php                 # PDO Connection Factory with Exception Handling
│   ├── helpers.php            # CSRF, Auth, Sanitization, Time Formatting
│   └── mail.php               # HTML Email Dispatcher for New Enquiries
│
├── database/                  # MySQL Database Scripts
│   └── DATABASE_SETUP.sql     # Tables: enquiries, admin_users, and indexes
│
├── public/                    # Static Assets & Organized Media Folders
│   ├── assets/
│   │   ├── logo/              # logo.png, favicon.png
│   │   ├── hero/              # hero.jpg (Homepage banner)
│   │   ├── doctor/            # doctor.jpg (Dr. Dinesh K portrait)
│   │   ├── clinic/            # clinic-01.jpg, clinic-02.jpg (Operatory & Lounge)
│   │   ├── gallery/           # gallery-01.jpg to gallery-08.jpg
│   │   ├── services/          # service-01.jpg to service-08.jpg
│   │   ├── certificates/      # certificate-01.jpg, certificate-02.jpg
│   │   ├── reviews/           # review-01.jpg, review-02.jpg
│   │   └── icons/             # Custom SVG / PNG dental icons
│   └── favicon.svg
│
├── src/                       # React Frontend Source Code
│   ├── components/            # Reusable UI, Nav, Footer, Modals
│   ├── pages/                 # Home, Services, About, Gallery, Contact
│   ├── data/dentalData.ts     # Clinic Data, Services, Doctor Profile, Media
│   └── types/                 # TypeScript Interfaces
│
├── .htaccess                  # Apache Rewrite, Security Headers & Caching
└── package.json               # Frontend Build Tooling
```

---

## 🚀 Step-by-Step Hostinger Deployment Guide

### Step 1: Build Frontend Assets
On your local machine or build environment, run:
```bash
npm run build
```
This generates optimized production files inside the `dist/` directory (e.g. `dist/index.html`, `dist/assets/...`).

---

### Step 2: Create MySQL Database on Hostinger
1. Log in to your **Hostinger hPanel** (or cPanel).
2. Go to **Databases** -> **MySQL Databases**.
3. Create a new database:
   - **Database Name:** e.g., `u123456789_dental`
   - **Database Username:** e.g., `u123456789_admin`
   - **Database Password:** e.g., `StrongPassword123#`
4. Note down these credentials.

---

### Step 3: Import Database Schema
1. Open **phpMyAdmin** from Hostinger hPanel for your new database.
2. Click the **Import** tab.
3. Choose the file `database/DATABASE_SETUP.sql` from this repository and click **Go**.
4. This creates:
   - `enquiries` table with optimized indexes on `booking_ref`, `status`, `is_read`, and `created_at`.
   - `admin_users` table with secure password fields.

---

### Step 4: Configure Database & Clinic Settings
Open `config/config.php` and update the database settings:

```php
// ==========================================
// 1. MySQL Database Configuration
// ==========================================
define('DB_HOST', 'localhost');                    // Typically 'localhost' on Hostinger
define('DB_NAME', 'u123456789_dental');           // Your Hostinger DB Name
define('DB_USER', 'u123456789_admin');            // Your Hostinger DB User
define('DB_PASS', 'StrongPassword123#');           // Your Hostinger DB Password
define('DB_PORT', 3306);
define('DB_CHARSET', 'utf8mb4');

// ==========================================
// 2. Business & Notification Settings
// ==========================================
define('NOTIFICATION_EMAIL', 'care@moneyandmeaning.in'); // Receives appointment alerts
define('ADMIN_EMAIL', 'care@moneyandmeaning.in');
```

---

### Step 5: Upload Files to Hostinger `public_html`
Using Hostinger **File Manager** or **FTP** (FileZilla):

1. Upload the contents of the `dist/` directory directly into your `public_html/` root (including `index.html` and assets).
2. Upload the following backend folders into `public_html/`:
   - `api/`
   - `admin/`
   - `config/`
   - `includes/`
   - `database/`
   - `assets/` (from `public/assets/`)
   - `.htaccess` (make sure hidden files are visible)

---

### Step 6: Create or Reset Initial Admin Account
1. In your browser, navigate to:
   ```text
   https://yourdomain.com/admin/setup-admin.php
   ```
2. Enter your desired Admin Username, Password, and Email.
3. Click **Initialize / Update Admin Account**.
4. **Security Best Practice:** Delete or rename `admin/setup-admin.php` after your initial account is created.

---

### Step 7: Access the Admin Dashboard
Navigate to:
```text
https://yourdomain.com/admin/login.php
```
Enter your username and password. You will have full access to:
- Real-time enquiry counter (Total, Unread, Today)
- Search by patient name, phone, or reference ID
- Filter by unread status
- One-click **Call Patient** and **Direct WhatsApp** buttons
- Updating enquiry status (`New`, `Contacted`, `Confirmed`, `Completed`, `Cancelled`)
- Adding internal reception notes
- Exporting enquiries to CSV spreadsheet for reception/clinic records

---

## 📸 Media Files Guide (`/public/assets/`)

Upload your clinic photographs directly into the respective folders:

| Folder | Recommended File Name | Description |
|---|---|---|
| `assets/logo/` | `logo.png`, `favicon.png` | Clinic brand logo with transparent background |
| `assets/hero/` | `hero.jpg` | High-resolution homepage banner photo |
| `assets/doctor/` | `doctor.jpg` | Professional portrait of Dr. Dinesh K |
| `assets/clinic/` | `clinic-01.jpg` to `clinic-04.jpg` | Dental operatory, reception, and autoclave sterilization |
| `assets/gallery/` | `gallery-01.jpg` to `gallery-08.jpg` | Clinic smile cases & equipment |
| `assets/services/` | `service-01.jpg` to `service-08.jpg` | RCT, Implants, Braces, Whitening, etc. |
| `assets/certificates/` | `certificate-01.jpg`, `certificate-02.jpg` | KSDC Registration & MDS Degrees |

---

## 🔒 Security Best Practices Implemented

1. **Prepared SQL Statements:** All MySQL queries use PDO prepared statements with parameterized inputs to eliminate SQL injection risks.
2. **CSRF Tokens:** All state-modifying actions (enquiry deletion, mark as read, login) require unique session tokens.
3. **Session Hardening:** Cookies configured with `HttpOnly=true`, `SameSite=Lax`, and `Secure=true` (over HTTPS).
4. **Directory Shielding:** `.htaccess` blocks public web browsing of `/config/`, `/includes/`, `/database/`, and `.sql` or `.log` files.
5. **Input Cleansing:** All inputs are trimmed, sanitized, length-limited, and escaped using `htmlspecialchars()` before HTML output.
