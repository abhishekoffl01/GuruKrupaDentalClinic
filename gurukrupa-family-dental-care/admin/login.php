<?php
/**
 * ==============================================================================
 * Admin Login Page
 * ==============================================================================
 * Secure administrative authentication using PDO prepared statements,
 * password_verify(), session regeneration, and CSRF protection.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

startSecureSession();

// If already authenticated, redirect straight to dashboard
if (isAdminLoggedIn()) {
    redirect('dashboard.php');
}

$errorMessage = '';
$successMessage = '';

if (isset($_GET['logged_out'])) {
    $successMessage = 'You have been safely logged out.';
}

// Handle POST Login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($csrfToken)) {
        $errorMessage = 'Security validation failed (Invalid CSRF token). Please try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $errorMessage = 'Please enter both username and password.';
        } else {
            try {
                $pdo = getDbConnection();
                $stmt = $pdo->prepare('SELECT id, username, password_hash, full_name FROM admin_users WHERE username = :username LIMIT 1');
                $stmt->execute([':username' => $username]);
                $admin = $stmt->fetch();

                if ($admin && password_verify($password, $admin['password_hash'])) {
                    // Successful login: regenerate session ID to prevent session fixation
                    session_regenerate_id(true);
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = (int)$admin['id'];
                    $_SESSION['admin_username'] = $admin['username'];
                    $_SESSION['admin_name'] = $admin['full_name'] ?: $admin['username'];
                    $_SESSION['last_activity'] = time();

                    // Update last login timestamp
                    $updateStmt = $pdo->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = :id');
                    $updateStmt->execute([':id' => $admin['id']]);

                    $redirectTo = !empty($_GET['redirect']) ? urldecode($_GET['redirect']) : 'dashboard.php';
                    redirect($redirectTo);
                } else {
                    $errorMessage = 'Invalid username or password. Please try again.';
                }
            } catch (\Throwable $e) {
                error_log('Login Error: ' . $e->getMessage());
                $errorMessage = 'Unable to connect to the database. Please check your DB credentials in config/config.php or run database/DATABASE_SETUP.sql.';
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
  <title>Admin Login | <?php echo e(SITE_NAME); ?></title>
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
  <div class="sm:mx-auto sm:w-full sm:max-w-md px-4">
    <!-- Header Logo & Title -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-600/20 text-sky-400 border border-sky-500/30 shadow-lg mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <h1 class="text-2xl font-extrabold text-white tracking-tight">
        <?php echo e(SITE_NAME); ?>
      </h1>
      <p class="text-xs text-slate-400">
        Secure Management Portal &bull; Patient Enquiry Desk
      </p>
    </div>

    <!-- Login Box -->
    <div class="mt-8 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
      <?php if (!empty($errorMessage)): ?>
        <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
          <svg class="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="leading-relaxed"><?php echo e($errorMessage); ?></div>
        </div>
      <?php endif; ?>

      <?php if (!empty($successMessage)): ?>
        <div class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
          <svg class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <div><?php echo e($successMessage); ?></div>
        </div>
      <?php endif; ?>

      <form action="login.php" method="POST" class="space-y-5">
        <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">

        <div>
          <label for="username" class="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            Admin Username
          </label>
          <div class="relative">
            <input
              id="username"
              name="username"
              type="text"
              required
              autocomplete="username"
              placeholder="e.g. admin"
              value="<?php echo e($_POST['username'] ?? ''); ?>"
              class="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            >
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="password" class="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div class="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              autocomplete="current-password"
              placeholder="••••••••••••"
              class="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
            >
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            id="admin-login-submit-btn"
            class="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to Dashboard</span>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      <!-- First time setup note -->
      <div class="mt-6 pt-6 border-t border-slate-700/60 text-center">
        <p class="text-xs text-slate-400">
          First time configuring the website?
          <a href="setup-admin.php" class="text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 ml-1">
            Run First Admin Setup
          </a>
        </p>
      </div>
    </div>

    <!-- Back to Website Link -->
    <div class="text-center mt-6">
      <a href="../" class="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Return to Public Dental Website</span>
      </a>
    </div>
  </div>
</body>
</html>
