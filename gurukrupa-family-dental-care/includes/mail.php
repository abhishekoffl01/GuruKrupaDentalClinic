<?php
/**
 * ==============================================================================
 * Email Notification Service
 * ==============================================================================
 * Sends professional HTML email notifications to the clinic reception team
 * when a new appointment enquiry is submitted on the website.
 * Note: Database saving is primary; email failures are logged gracefully
 * without breaking user submission confirmation.
 * ==============================================================================
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/helpers.php';

/**
 * Send an HTML notification email to the clinic reception
 */
function sendEnquiryNotificationEmail(array $enquiry): bool {
    $to = defined('BUSINESS_EMAIL') ? BUSINESS_EMAIL : 'care@moneyandmeaning.in';
    $fromAddress = defined('MAIL_FROM_ADDRESS') ? MAIL_FROM_ADDRESS : 'notifications@' . (defined('SITE_DOMAIN') ? SITE_DOMAIN : 'moneyandmeaning.in');
    $fromName = defined('MAIL_FROM_NAME') ? MAIL_FROM_NAME : 'Gurukrupa Dental Website';

    $subject = '🦷 New Dental Appointment Enquiry: ' . e($enquiry['name']) . ' (' . e($enquiry['booking_ref'] ?? 'Web') . ')';

    $name = e($enquiry['name']);
    $phone = e($enquiry['phone']);
    $email = !empty($enquiry['email']) ? e($enquiry['email']) : 'Not provided';
    $service = e($enquiry['service'] ?? 'General Consultation');
    $preferredDate = e($enquiry['preferred_date'] ?? 'As soon as possible');
    $preferredTime = e($enquiry['preferred_time'] ?? 'Flexible');
    $message = !empty($enquiry['message']) ? nl2br(e($enquiry['message'])) : '<em>No specific symptoms described.</em>';
    $bookingRef = e($enquiry['booking_ref'] ?? 'GFDC-' . time());
    $ip = e($enquiry['ip_address'] ?? 'Unknown');
    $timestamp = date('d M Y, h:i A');

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
  .header { background: linear-gradient(135deg, #0369a1, #0f172a); color: #ffffff; padding: 24px; text-align: center; }
  .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
  .header p { margin: 4px 0 0 0; font-size: 13px; color: #bae6fd; }
  .content { padding: 24px; }
  .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 6px; font-weight: 700; font-size: 12px; margin-bottom: 16px; }
  .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
  .table th { text-align: left; padding: 10px 12px; background: #f8fafc; color: #64748b; font-weight: 600; width: 35%; border-bottom: 1px solid #e2e8f0; }
  .table td { padding: 10px 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; }
  .highlight { font-weight: 700; color: #0284c7; }
  .message-box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; border-radius: 4px; margin-top: 12px; font-size: 14px; line-height: 1.5; color: #334155; }
  .actions { margin-top: 24px; text-align: center; }
  .btn { display: inline-block; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; margin: 4px; }
  .btn-call { background: #0284c7; color: #ffffff !important; }
  .btn-whatsapp { background: #16a34a; color: #ffffff !important; }
  .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Gurukrupa Family Dental Care</h1>
    <p>New Online Appointment Enquiry Notification</p>
  </div>
  <div class="content">
    <div class="badge">Reference ID: {$bookingRef}</div>

    <table class="table">
      <tr>
        <th>Patient Name</th>
        <td><strong style="font-size: 15px;">{$name}</strong></td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td><span class="highlight">{$phone}</span></td>
      </tr>
      <tr>
        <th>Email Address</th>
        <td>{$email}</td>
      </tr>
      <tr>
        <th>Requested Treatment</th>
        <td><strong>{$service}</strong></td>
      </tr>
      <tr>
        <th>Preferred Date</th>
        <td>{$preferredDate}</td>
      </tr>
      <tr>
        <th>Preferred Slot</th>
        <td>{$preferredTime}</td>
      </tr>
      <tr>
        <th>Submission Time</th>
        <td>{$timestamp}</td>
      </tr>
      <tr>
        <th>Visitor IP</th>
        <td><small style="color: #94a3b8;">{$ip}</small></td>
      </tr>
    </table>

    <div style="font-size: 13px; font-weight: 600; color: #475569; margin-top: 16px;">Patient Symptoms / Notes:</div>
    <div class="message-box">
      {$message}
    </div>

    <div class="actions">
      <a href="tel:{$phone}" class="btn btn-call">📞 Call Patient Now</a>
      <a href="https://wa.me/{$phone}?text=Hello%20{$name}%2C%20thank%20you%20for%20contacting%20Gurukrupa%20Family%20Dental%20Care.%20Regarding%20your%20appointment%20request..." class="btn btn-whatsapp">💬 Reply via WhatsApp</a>
    </div>
  </div>
  <div class="footer">
    Gurukrupa Family Dental Care &bull; 72, Service Road, Laggere, Bengaluru - 560057<br>
    This automated notification was generated securely from moneyandmeaning.in
  </div>
</div>
</body>
</html>
HTML;

    // Plain text alternative
    $textBody = "New Dental Appointment Enquiry - Gurukrupa Family Dental Care\n\n"
        . "Reference ID: {$bookingRef}\n"
        . "Patient Name: {$name}\n"
        . "Phone: {$phone}\n"
        . "Email: {$email}\n"
        . "Treatment: {$service}\n"
        . "Preferred Date: {$preferredDate}\n"
        . "Preferred Slot: {$preferredTime}\n"
        . "Submitted: {$timestamp}\n\n"
        . "Notes:\n" . strip_tags($enquiry['message'] ?? 'None') . "\n";

    // Headers
    $headers = [];
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=UTF-8';
    $headers[] = 'From: ' . $fromName . ' <' . $fromAddress . '>';
    if (!empty($enquiry['email']) && filter_var($enquiry['email'], FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $enquiry['name'] . ' <' . $enquiry['email'] . '>';
    }
    $headers[] = 'X-Mailer: PHP/' . phpversion();

    try {
        // Native mail() invocation on Hostinger
        $sent = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
        return (bool)$sent;
    } catch (\Throwable $e) {
        error_log('Failed to dispatch notification email: ' . $e->getMessage());
        return false;
    }
}
