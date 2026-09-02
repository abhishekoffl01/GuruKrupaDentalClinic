<?php
/**
 * ==============================================================================
 * Admin - View Single Enquiry Details
 * ==============================================================================
 * Comprehensive patient lead profile with instant Call / WhatsApp / Email actions,
 * status transitions, reception notes, and secure delete capabilities.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdminAuth();

$id = (int)($_GET['id'] ?? 0);
if ($id <= 0) {
    redirect('dashboard.php');
}

$csrfToken = generateCsrfToken();
$enquiry = null;
$messageNotice = '';

try {
    $pdo = getDbConnection();

    // Handle Status / Admin Notes Update Form
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_notes') {
        if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
            $messageNotice = 'Invalid security token. Please try again.';
        } else {
            $newStatus = sanitizeInput($_POST['status'] ?? 'new', 30);
            $adminNotes = sanitizeInput($_POST['admin_notes'] ?? '', 2000);
            $isRead = isset($_POST['is_read']) ? 1 : 0;

            $updateStmt = $pdo->prepare('UPDATE enquiries SET status = :status, admin_notes = :admin_notes, is_read = :is_read WHERE id = :id');
            $updateStmt->execute([
                ':status'      => $newStatus,
                ':admin_notes' => $adminNotes,
                ':is_read'     => $isRead,
                ':id'          => $id,
            ]);
            $messageNotice = 'Enquiry updated successfully!';
        }
    }

    // Automatically mark as read when viewed directly
    $markReadStmt = $pdo->prepare('UPDATE enquiries SET is_read = 1 WHERE id = :id AND is_read = 0');
    $markReadStmt->execute([':id' => $id]);

    // Fetch full enquiry details
    $stmt = $pdo->prepare('SELECT * FROM enquiries WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $enquiry = $stmt->fetch();

    if (!$enquiry) {
        redirect('dashboard.php?error=not_found');
    }
} catch (\Throwable $e) {
    error_log('View Enquiry Error: ' . $e->getMessage());
    redirect('dashboard.php?error=db_error');
}

$cleanPhone = preg_replace('/[^\d\+]/', '', $enquiry['phone']);
$cleanPhoneDigits = preg_replace('/[^\d]/', '', $enquiry['phone']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enquiry #<?php echo e($enquiry['booking_ref']); ?> | <?php echo e(SITE_NAME); ?></title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 min-h-screen text-slate-100 antialiased py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl mx-auto space-y-6">

    <!-- Top Navigation Header -->
    <div class="flex items-center justify-between">
      <a
        href="dashboard.php"
        class="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to All Enquiries</span>
      </a>

      <div class="flex items-center gap-2">
        <span class="font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
          ID: <?php echo e($enquiry['booking_ref']); ?>
        </span>
      </div>
    </div>

    <?php if (!empty($messageNotice)): ?>
      <div class="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span><?php echo e($messageNotice); ?></span>
      </div>
    <?php endif; ?>

    <!-- Main Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
      <!-- Title & Quick Communication Buttons -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-extrabold text-white font-heading"><?php echo e($enquiry['name']); ?></h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
              <?php echo e($enquiry['status']); ?>
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-1">
            Submitted on <?php echo date('d M Y \a\t h:i A', strtotime($enquiry['created_at'])); ?> (<?php echo timeAgo($enquiry['created_at']); ?>)
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Call Button -->
          <a
            href="tel:<?php echo e($cleanPhone); ?>"
            class="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 transition-all flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Call Patient</span>
          </a>

          <!-- WhatsApp Button -->
          <a
            href="https://wa.me/<?php echo e($cleanPhoneDigits); ?>?text=Hello%20<?php echo urlencode($enquiry['name']); ?>%2C%20thank%20you%20for%20contacting%20Gurukrupa%20Family%20Dental%20Care.%20Regarding%20your%20appointment%20request%20(Ref%3A%20<?php echo urlencode($enquiry['booking_ref']); ?>)..."
            target="_blank"
            class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          <?php if (!empty($enquiry['email'])): ?>
            <a
              href="mailto:<?php echo e($enquiry['email']); ?>?subject=Appointment%20Confirmation%20-%20Gurukrupa%20Family%20Dental%20Care"
              class="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email</span>
            </a>
          <?php endif; ?>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Contact Information -->
        <div class="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-4">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Contact</h2>

          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <span class="text-slate-500 block text-xs">Full Name</span>
              <strong class="text-white text-base"><?php echo e($enquiry['name']); ?></strong>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Phone Number</span>
              <strong class="text-sky-400 font-mono text-base"><?php echo e($enquiry['phone']); ?></strong>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Email Address</span>
              <span class="text-slate-300"><?php echo !empty($enquiry['email']) ? e($enquiry['email']) : '<em class="text-slate-500">Not provided</em>'; ?></span>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Preferred Contact Mode</span>
              <span class="text-slate-300 capitalize"><?php echo e($enquiry['preferred_contact'] ?? 'Phone'); ?></span>
            </div>
          </div>
        </div>

        <!-- Consultation Request Details -->
        <div class="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-4">
          <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Consultation Request</h2>

          <div class="space-y-3 text-xs sm:text-sm">
            <div>
              <span class="text-slate-500 block text-xs">Treatment Requested</span>
              <strong class="text-emerald-400 text-sm"><?php echo e($enquiry['service'] ?: 'General Dental Consultation'); ?></strong>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Preferred Date</span>
              <strong class="text-white"><?php echo e($enquiry['preferred_date']); ?></strong>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Preferred Time Window</span>
              <span class="text-slate-300"><?php echo e($enquiry['preferred_time']); ?></span>
            </div>

            <div>
              <span class="text-slate-500 block text-xs">Visitor IP / Device</span>
              <span class="text-slate-400 font-mono text-xs"><?php echo e($enquiry['ip_address'] ?? '127.0.0.1'); ?></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Symptoms / Message Box -->
      <div class="space-y-2">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Symptoms / Request Notes</h2>
        <div class="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          <?php echo !empty($enquiry['message']) ? e($enquiry['message']) : '<em class="text-slate-500">No additional symptoms entered by patient.</em>'; ?>
        </div>
      </div>

      <!-- Reception Status & Notes Management Form -->
      <form action="view-enquiry.php?id=<?php echo $id; ?>" method="POST" class="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">
        <input type="hidden" name="action" value="update_notes">

        <h2 class="text-xs font-bold text-sky-400 uppercase tracking-wider">Reception Status & Follow-Up Notes</h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-slate-400 mb-1 font-semibold">Appointment Status</label>
            <select
              name="status"
              class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="new" <?php echo $enquiry['status'] === 'new' ? 'selected' : ''; ?>>New Request</option>
              <option value="contacted" <?php echo $enquiry['status'] === 'contacted' ? 'selected' : ''; ?>>Contacted Patient</option>
              <option value="confirmed" <?php echo $enquiry['status'] === 'confirmed' ? 'selected' : ''; ?>>Slot Confirmed</option>
              <option value="completed" <?php echo $enquiry['status'] === 'completed' ? 'selected' : ''; ?>>Consultation Completed</option>
              <option value="cancelled" <?php echo $enquiry['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled / No Show</option>
            </select>
          </div>

          <div class="flex items-center pt-6">
            <label class="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                name="is_read"
                value="1"
                <?php echo $enquiry['is_read'] == 1 ? 'checked' : ''; ?>
                class="w-4 h-4 rounded text-sky-600 bg-slate-900 border-slate-700 focus:ring-sky-500"
              >
              <span>Mark as Read (Handled)</span>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs text-slate-400 mb-1 font-semibold">Internal Reception Notes</label>
          <textarea
            name="admin_notes"
            rows="3"
            placeholder="Add internal notes (e.g. 'Patient called at 10 AM, scheduled for Tuesday with Dr. Dinesh')..."
            class="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-sky-500 resize-none"
          ><?php echo e($enquiry['admin_notes'] ?? ''); ?></textarea>
        </div>

        <div class="flex justify-between items-center pt-2">
          <button
            type="submit"
            class="py-2.5 px-5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Save Status & Notes
          </button>

          <!-- Delete Action Form -->
          <form action="delete-enquiry.php" method="POST" onsubmit="return confirm('Are you sure you want to permanently delete this enquiry?');">
            <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">
            <input type="hidden" name="id" value="<?php echo $id; ?>">
            <input type="hidden" name="return_url" value="dashboard.php">
            <button
              type="submit"
              class="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
            >
              Delete Record
            </button>
          </form>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
