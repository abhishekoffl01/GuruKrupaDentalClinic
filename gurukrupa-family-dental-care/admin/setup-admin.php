<?php
/**
 * ==============================================================================
 * Initial One-Time Admin Setup Script
 * ==============================================================================
 * Use this page ONLY ONCE to create the first administrative account.
 * For maximum security, this script checks if an administrator already exists
 * in the database. If so, creation is strictly blocked.
 *
 * IMPORTANT: Delete or rename this file immediately after creating your account.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

startSecureSession();

$alreadyExists = false;
$errorMessage = '';
$successMessage = '';
$pdoConnected = false;

try {
    $pdo = getDbConnection();
    $pdoConnected = true;

    // Check if any admin account already exists
    $stmt = $pdo->query('SELECT COUNT(*) AS total FROM admin_users');
    $row = $stmt->fetch();
    if ($row && (int)$row['total'] > 0) {
        $alreadyExists = true;
    }
} catch (\Throwable $e) {
    $errorMessage = 'Database Connection Failed: ' . $e->getMessage() . '. Please ensure database/DATABASE_SETUP.sql was imported into Hostinger phpMyAdmin and credentials in config/config.php are correct.';
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$alreadyExists && $pdoConnected) {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($csrfToken)) {
        $errorMessage = 'Security validation failed (Invalid CSRF token). Please try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        $fullName = trim($_POST['full_name'] ?? 'Hospital Admin');
        $email = trim($_POST['email'] ?? '');

        if (empty($username) || strlen($username) < 3) {
            $errorMessage = 'Username must be at least 3 characters long.';
        } elseif (empty($password) || strlen($password) < 8) {
            $errorMessage = 'Password must be at least 8 characters long for security.';
        } elseif ($password !== $confirmPassword) {
            $errorMessage = 'Passwords do not match. Please re-enter.';
        } else {
            try {
                $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
                $insertStmt = $pdo->prepare('
                    INSERT INTO admin_users (username, password_hash, email, full_name, created_at)
                    VALUES (:username, :password_hash, :email, :full_name, NOW())
                ');
                $insertStmt->execute([
                    ':username'      => $username,
                    ':password_hash' => $passwordHash,
                    ':email'         => !empty($email) ? $email : null,
                    ':full_name'     => $fullName,
                ]);

                $successMessage = 'Primary administrator account created successfully! You can now log in.';
                $alreadyExists = true;
            } catch (\Throwable $e) {
                $errorMessage = 'Error creating admin user: ' . $e->getMessage();
            }
        }
    }
}

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>First-Time Admin Setup | <?php echo e(SITE_NAME); ?></title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
  <div class="sm:mx-auto sm:w-full sm:max-w-lg px-4">
    <!-- Header -->
    <div class="text-center space-y-2 mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <h1 class="text-2xl font-extrabold text-white">
        First-Time Administrator Setup
      </h1>
      <p class="text-xs text-slate-400">
        <?php echo e(SITE_NAME); ?> &bull; Hostinger Initial Configuration
      </p>
    </div>

    <div class="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      <?php if ($alreadyExists): ?>
        <div class="text-center space-y-5 py-4">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div class="space-y-2">
            <h2 class="text-lg font-bold text-white">Administrator Account Configured</h2>
            <p class="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              <?php if (!empty($successMessage)): ?>
                <?php echo e($successMessage); ?>
              <?php else: ?>
                An administrator account already exists in your database. Setup is locked to prevent unauthorized changes.
              <?php endif; ?>
            </p>
          </div>

          <div class="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left text-xs text-amber-200 space-y-2">
            <div class="font-bold flex items-center gap-1.5 text-amber-300">
              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Security Recommendation:</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              For production security on Hostinger, please delete this file (<code class="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">admin/setup-admin.php</code>) from your File Manager.
            </p>
          </div>

          <div class="pt-2">
            <a
              href="login.php"
              class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all"
            >
              <span>Go to Admin Login</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      <?php else: ?>
        <?php if (!empty($errorMessage)): ?>
          <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <svg class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="leading-relaxed"><?php echo e($errorMessage); ?></div>
          </div>
        <?php endif; ?>

        <form action="setup-admin.php" method="POST" class="space-y-4">
          <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Admin Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="e.g. Dr. Dinesh K / Hospital Manager"
              value="<?php echo e($_POST['full_name'] ?? ''); ?>"
              class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Admin Username <span class="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="username"
              required
              placeholder="e.g. admin or drdinesh"
              value="<?php echo e($_POST['username'] ?? ''); ?>"
              class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">
              Notification Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="care@moneyandmeaning.in"
              value="<?php echo e($_POST['email'] ?? ''); ?>"
              class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                Password <span class="text-rose-400">* (Min 8 chars)</span>
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password <span class="text-rose-400">*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                required
                placeholder="••••••••••••"
                class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Initial Administrator</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </form>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
