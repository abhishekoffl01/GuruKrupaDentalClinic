<?php
/**
 * ==============================================================================
 * Admin Dashboard - Patient Enquiries & Appointment Management
 * ==============================================================================
 * Responsive administrative control panel for managing dental consultations,
 * filtering unread requests, toggling status, calling patients directly,
 * and deleting completed records securely.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/helpers.php';

requireAdminAuth();

$currentAdmin = getCurrentAdmin();
$csrfToken = generateCsrfToken();

$searchQuery = trim($_GET['q'] ?? '');
$filterStatus = trim($_GET['status'] ?? 'all');
$filterRead = trim($_GET['read'] ?? 'all');

$pdo = null;
$enquiries = [];
$totalCount = 0;
$unreadCount = 0;
$todayCount = 0;
$dbError = '';

try {
    $pdo = getDbConnection();

    // Aggregated stats
    $totalCount = (int)$pdo->query('SELECT COUNT(*) FROM enquiries')->fetchColumn();
    $unreadCount = (int)$pdo->query('SELECT COUNT(*) FROM enquiries WHERE is_read = 0')->fetchColumn();
    $todayCount = (int)$pdo->query('SELECT COUNT(*) FROM enquiries WHERE DATE(created_at) = CURDATE()')->fetchColumn();

    // Query with dynamic filters
    $sql = 'SELECT * FROM enquiries WHERE 1=1';
    $params = [];

    if ($filterRead === 'unread') {
        $sql .= ' AND is_read = 0';
    } elseif ($filterRead === 'read') {
        $sql .= ' AND is_read = 1';
    }

    if ($filterStatus !== 'all' && in_array($filterStatus, ['new', 'contacted', 'confirmed', 'completed', 'cancelled'])) {
        $sql .= ' AND status = :status';
        $params[':status'] = $filterStatus;
    }

    if (!empty($searchQuery)) {
        $sql .= ' AND (name LIKE :q1 OR phone LIKE :q2 OR email LIKE :q3 OR booking_ref LIKE :q4 OR message LIKE :q5)';
        $qWild = '%' . $searchQuery . '%';
        $params[':q1'] = $qWild;
        $params[':q2'] = $qWild;
        $params[':q3'] = $qWild;
        $params[':q4'] = $qWild;
        $params[':q5'] = $qWild;
    }

    $sql .= ' ORDER BY created_at DESC LIMIT 100';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $enquiries = $stmt->fetchAll();

} catch (\Throwable $e) {
    error_log('Dashboard Query Error: ' . $e->getMessage());
    $dbError = 'Database Connection Issue. Please verify config/config.php database settings.';
}

// Handle Export to CSV
if (isset($_GET['export']) && $_GET['export'] === 'csv' && $pdo) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=dental_enquiries_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Ref ID', 'Name', 'Phone', 'Email', 'Service', 'Date', 'Slot', 'Status', 'Read', 'Message', 'Created At']);

    $exportStmt = $pdo->query('SELECT booking_ref, name, phone, email, service, preferred_date, preferred_time, status, is_read, message, created_at FROM enquiries ORDER BY created_at DESC');
    while ($row = $exportStmt->fetch(PDO::FETCH_NUM)) {
        fputcsv($output, $row);
    }
    fclose($output);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard | <?php echo e(SITE_NAME); ?></title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 min-h-screen text-slate-100 antialiased flex flex-col">

  <!-- Top Navigation Bar -->
  <header class="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Clinic Brand -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
          GD
        </div>
        <div>
          <h1 class="text-sm font-bold text-white leading-tight"><?php echo e(SITE_NAME); ?></h1>
          <p class="text-[11px] text-slate-400">Reception Enquiry Portal</p>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <a
          href="../"
          target="_blank"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>View Live Site</span>
        </a>

        <div class="h-4 w-px bg-slate-800 hidden sm:block"></div>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400 hidden md:inline">
            Logged in as <strong class="text-white"><?php echo e($currentAdmin['username']); ?></strong>
          </span>
          <a
            href="logout.php"
            class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <?php if (!empty($dbError)): ?>
      <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
        <svg class="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <strong class="font-bold">Database Warning:</strong> <?php echo e($dbError); ?>
        </div>
      </div>
    <?php endif; ?>

    <!-- Flash Notifications from Action Redirects -->
    <?php if (isset($_GET['msg'])): ?>
      <?php if ($_GET['msg'] === 'deleted'): ?>
        <div class="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <span>✓ Enquiry record deleted successfully.</span>
        </div>
      <?php elseif ($_GET['msg'] === 'read_updated'): ?>
        <div class="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-300 text-xs flex items-center gap-2">
          <span>✓ Enquiry status updated successfully.</span>
        </div>
      <?php endif; ?>
    <?php endif; ?>

    <!-- Metric Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <!-- Total Enquiries -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enquiries</span>
          <div class="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-extrabold text-white mt-2"><?php echo number_format($totalCount); ?></div>
        <p class="text-[11px] text-slate-500 mt-1">Lifetime web appointments & messages</p>
      </div>

      <!-- Unread Enquiries -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-amber-400 uppercase tracking-wider">Unread / Pending</span>
          <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-extrabold text-amber-400 mt-2"><?php echo number_format($unreadCount); ?></div>
        <p class="text-[11px] text-slate-500 mt-1">Awaiting receptionist call / reply</p>
      </div>

      <!-- Today's Enquiries -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Today's Leads</span>
          <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="text-3xl font-extrabold text-emerald-400 mt-2"><?php echo number_format($todayCount); ?></div>
        <p class="text-[11px] text-slate-500 mt-1">Submitted in the past 24 hours</p>
      </div>
    </div>

    <!-- Search, Filter & Export Toolbar -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <form method="GET" action="dashboard.php" class="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <!-- Search input -->
        <div class="sm:col-span-6 relative">
          <input
            type="text"
            name="q"
            value="<?php echo e($searchQuery); ?>"
            placeholder="Search by patient name, phone, ref ID..."
            class="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Read status filter -->
        <div class="sm:col-span-3">
          <select
            name="read"
            onchange="this.form.submit()"
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="all" <?php echo $filterRead === 'all' ? 'selected' : ''; ?>>All Read Statuses</option>
            <option value="unread" <?php echo $filterRead === 'unread' ? 'selected' : ''; ?>>Unread Only (Pending)</option>
            <option value="read" <?php echo $filterRead === 'read' ? 'selected' : ''; ?>>Read Only</option>
          </select>
        </div>

        <!-- Filter buttons -->
        <div class="sm:col-span-3 flex items-center gap-2">
          <button
            type="submit"
            class="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition-colors text-center"
          >
            Filter
          </button>
          <?php if (!empty($searchQuery) || $filterRead !== 'all' || $filterStatus !== 'all'): ?>
            <a
              href="dashboard.php"
              class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
              title="Reset Filters"
            >
              Reset
            </a>
          <?php endif; ?>
          <a
            href="dashboard.php?export=csv"
            class="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
            title="Export to CSV"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="hidden md:inline">CSV</span>
          </a>
        </div>
      </form>
    </div>

    <!-- Enquiries Table & Card List -->
    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
      <div class="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-white">Patient Enquiries List</h2>
          <p class="text-xs text-slate-400">Showing <?php echo count($enquiries); ?> most recent consultation requests</p>
        </div>
      </div>

      <?php if (empty($enquiries)): ?>
        <div class="text-center py-16 px-4 space-y-3">
          <div class="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-slate-300">No enquiries found</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            When patients submit appointment requests on the website, they will appear here in real-time.
          </p>
        </div>
      <?php else: ?>
        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Ref & Patient</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Treatment / Slot</th>
                <th class="py-3.5 px-4">Symptoms / Notes</th>
                <th class="py-3.5 px-4">Submitted</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-slate-300">
              <?php foreach ($enquiries as $item): ?>
                <tr class="hover:bg-slate-800/50 transition-colors <?php echo $item['is_read'] == 0 ? 'bg-sky-950/10 font-medium' : ''; ?>">
                  <!-- Status Pill -->
                  <td class="py-3.5 px-4 whitespace-nowrap">
                    <?php if ($item['is_read'] == 0): ?>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        NEW UNREAD
                      </span>
                    <?php else: ?>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                        READ
                      </span>
                    <?php endif; ?>
                  </td>

                  <!-- Patient Name & Ref -->
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-white text-sm"><?php echo e($item['name']); ?></div>
                    <div class="font-mono text-[11px] text-sky-400"><?php echo e($item['booking_ref']); ?></div>
                  </td>

                  <!-- Contact Links -->
                  <td class="py-3.5 px-4 space-y-1">
                    <a
                      href="tel:<?php echo e(preg_replace('/[^\d\+]/', '', $item['phone'])); ?>"
                      class="text-sky-400 hover:text-sky-300 font-semibold block flex items-center gap-1"
                    >
                      <svg class="w-3 h-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span><?php echo e($item['phone']); ?></span>
                    </a>
                    <?php if (!empty($item['email'])): ?>
                      <div class="text-[11px] text-slate-400 truncate max-w-[150px]"><?php echo e($item['email']); ?></div>
                    <?php endif; ?>
                  </td>

                  <!-- Treatment & Slot -->
                  <td class="py-3.5 px-4">
                    <div class="font-semibold text-slate-200"><?php echo e($item['service'] ?: 'General Consultation'); ?></div>
                    <div class="text-[11px] text-slate-400"><?php echo e($item['preferred_date']); ?> &bull; <?php echo e($item['preferred_time']); ?></div>
                  </td>

                  <!-- Notes -->
                  <td class="py-3.5 px-4">
                    <div class="max-w-xs truncate text-slate-400 text-xs" title="<?php echo e($item['message']); ?>">
                      <?php echo !empty($item['message']) ? e($item['message']) : '<span class="text-slate-600 italic">None</span>'; ?>
                    </div>
                  </td>

                  <!-- Date -->
                  <td class="py-3.5 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                    <?php echo e(timeAgo($item['created_at'])); ?>
                  </td>

                  <!-- Actions -->
                  <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                    <!-- View single enquiry -->
                    <a
                      href="view-enquiry.php?id=<?php echo (int)$item['id']; ?>"
                      class="inline-block p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="View Full Details"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>

                    <!-- Direct WhatsApp -->
                    <a
                      href="https://wa.me/<?php echo e(preg_replace('/[^\d]/', '', $item['phone'])); ?>?text=Hello%20<?php echo urlencode($item['name']); ?>%2C%20thank%20you%20for%20contacting%20Gurukrupa%20Family%20Dental%20Care."
                      target="_blank"
                      class="inline-block p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                      title="Reply via WhatsApp"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                      </svg>
                    </a>

                    <!-- Toggle Read / Unread POST Form -->
                    <?php if ($item['is_read'] == 0): ?>
                      <form action="mark-read.php" method="POST" class="inline">
                        <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">
                        <input type="hidden" name="id" value="<?php echo (int)$item['id']; ?>">
                        <input type="hidden" name="return_url" value="dashboard.php">
                        <button
                          type="submit"
                          class="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 transition-colors"
                          title="Mark as Read"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </form>
                    <?php else: ?>
                      <form action="mark-unread.php" method="POST" class="inline">
                        <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">
                        <input type="hidden" name="id" value="<?php echo (int)$item['id']; ?>">
                        <input type="hidden" name="return_url" value="dashboard.php">
                        <button
                          type="submit"
                          class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                          title="Mark as Unread"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </form>
                    <?php endif; ?>

                    <!-- Delete Button Form (POST with confirm) -->
                    <form action="delete-enquiry.php" method="POST" class="inline" onsubmit="return confirm('Are you sure you want to delete this enquiry from <?php echo addslashes($item['name']); ?>?');">
                      <input type="hidden" name="csrf_token" value="<?php echo e($csrfToken); ?>">
                      <input type="hidden" name="id" value="<?php echo (int)$item['id']; ?>">
                      <input type="hidden" name="return_url" value="dashboard.php">
                      <button
                        type="submit"
                        class="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Enquiry"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden divide-y divide-slate-800">
          <?php foreach ($enquiries as $item): ?>
            <div class="p-4 space-y-3 <?php echo $item['is_read'] == 0 ? 'bg-sky-950/20' : ''; ?>">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <div class="font-bold text-white text-sm"><?php echo e($item['name']); ?></div>
                  <div class="font-mono text-[10px] text-sky-400"><?php echo e($item['booking_ref']); ?></div>
                </div>
                <div>
                  <?php if ($item['is_read'] == 0): ?>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                      NEW
                    </span>
                  <?php endif; ?>
                </div>
              </div>

              <div class="text-xs text-slate-300 space-y-1">
                <div class="flex items-center gap-1.5 text-sky-400">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:<?php echo e(preg_replace('/[^\d\+]/', '', $item['phone'])); ?>" class="font-bold underline">
                    <?php echo e($item['phone']); ?>
                  </a>
                </div>
                <div><strong>Treatment:</strong> <?php echo e($item['service'] ?: 'General Consultation'); ?></div>
                <div><strong>Slot:</strong> <?php echo e($item['preferred_date']); ?> &bull; <?php echo e($item['preferred_time']); ?></div>
                <?php if (!empty($item['message'])): ?>
                  <div class="p-2 bg-slate-950/60 rounded-lg text-slate-400 text-xs italic">
                    "<?php echo e($item['message']); ?>"
                  </div>
                <?php endif; ?>
              </div>

              <!-- Action Bar -->
              <div class="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <span class="text-[11px] text-slate-500"><?php echo e(timeAgo($item['created_at'])); ?></span>
                <div class="flex items-center gap-2">
                  <a
                    href="view-enquiry.php?id=<?php echo (int)$item['id']; ?>"
                    class="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg font-semibold"
                  >
                    View
                  </a>
                  <a
                    href="https://wa.me/<?php echo e(preg_replace('/[^\d]/', '', $item['phone'])); ?>"
                    target="_blank"
                    class="px-2.5 py-1 bg-emerald-600/30 text-emerald-300 rounded-lg font-semibold"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </div>
  </main>

  <footer class="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-600">
    <?php echo e(SITE_NAME); ?> &bull; Designed for Hostinger Shared Hosting
  </footer>
</body>
</html>
