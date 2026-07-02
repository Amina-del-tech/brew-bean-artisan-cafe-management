<?php
// ===== MAILER CONFIG =====
// PHPMailer se email bhejna
// Setup: apna Gmail credentials yahan daalo

// ---- APNI SETTINGS YAHAN CHANGE KARO ----
define('MAIL_HOST',     'smtp.gmail.com');
define('MAIL_PORT',     587);
define('MAIL_USERNAME', 'ruralgamesofficial@gmail.com'); // apna Gmail
define('MAIL_PASSWORD', 'YOUR_APP_PASSWORD_HERE');       // Gmail App Password (16 chars)
define('MAIL_FROM',     'ruralgamesofficial@gmail.com');
define('MAIL_FROM_NAME','Brew & Bean Cafe');
// ------------------------------------------

function sendMail(string $toEmail, string $toName, string $subject, string $htmlBody): bool {
    // PHPMailer without Composer — manual include
    $phpmailerPath = __DIR__ . '/PHPMailer/';
    
    if (!file_exists($phpmailerPath . 'PHPMailer.php')) {
        // PHPMailer nahi mila — fallback to PHP mail()
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
        // @ suppresses PHP warnings (e.g. "Failed to connect to mailserver") from
        // leaking into the output and corrupting the JSON API response.
        return @mail($toEmail, $subject, $htmlBody, $headers);
    }

    require_once $phpmailerPath . 'PHPMailer.php';
    require_once $phpmailerPath . 'SMTP.php';
    require_once $phpmailerPath . 'Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = MAIL_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = MAIL_USERNAME;
        $mail->Password   = MAIL_PASSWORD;
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = MAIL_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
        $mail->addAddress($toEmail, $toName);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;

        $mail->send();
        return true;
    } catch (\Throwable $e) {
        error_log("Mail error: " . $e->getMessage());
        return false;
    }
}

// ===== EMAIL TEMPLATES =====

function welcomeEmailTemplate(string $name): string {
    return <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Welcome to Brew & Bean</title>
</head>
<body style="margin:0;padding:0;background:#f5ead6;font-family:'DM Sans',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ead6;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(61,28,2,0.12);">

      <!-- Header -->
      <tr>
        <td style="background:linear-gradient(135deg,#1a0a00,#3d1c02);padding:48px 40px;text-align:center;">
          
          <h1 style="color:#f5ead6;font-family:Georgia,serif;font-size:2rem;margin:0 0 6px;">Brew & Bean</h1>
          <p style="color:rgba(245,234,214,0.65);font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Artisan Cafe</p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td style="padding:48px 40px;">
          <h2 style="color:#1a0a00;font-family:Georgia,serif;font-size:1.7rem;margin:0 0 16px;">Welcome, {$name}!</h2>
          <p style="color:#6b3a1f;font-size:1rem;line-height:1.7;margin:0 0 24px;">
            Thank you for joining the Brew & Bean family. Your account has been created successfully — we're thrilled to have you with us!
          </p>

          <!-- Features -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="padding:14px;background:#fdf8f0;border-radius:12px;border-left:4px solid #c07c3a;margin-bottom:10px;">
                <p style="margin:0;color:#3d1c02;font-size:0.9rem;"><strong>50 bonus points</strong> added to your account</p>
              </td>
            </tr>
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td style="padding:14px;background:#fdf8f0;border-radius:12px;border-left:4px solid #c07c3a;">
                <p style="margin:0;color:#3d1c02;font-size:0.9rem;"><strong>Free drink</strong> waiting on your birthday</p>
              </td>
            </tr>
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td style="padding:14px;background:#fdf8f0;border-radius:12px;border-left:4px solid #c07c3a;">
                <p style="margin:0;color:#3d1c02;font-size:0.9rem;"><strong>Exclusive member discounts</strong> on every order</p>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <div style="text-align:center;margin-bottom:32px;">
            <a href="http://localhost/cafe/menu.html"
               style="display:inline-block;background:#c07c3a;color:white;padding:16px 40px;border-radius:50px;font-size:1rem;font-weight:700;text-decoration:none;letter-spacing:0.03em;">
              Explore Our Menu &rarr;
            </a>
          </div>

          <p style="color:#8a6040;font-size:0.85rem;line-height:1.6;border-top:1px solid #f0e0c8;padding-top:24px;margin:0;">
            We're open <strong>7 AM – 10 PM</strong> every day at <strong>DHA Phase 5, Lahore, Punjab</strong>.<br>
            Questions? Reply to this email or call us anytime.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#1a0a00;padding:28px 40px;text-align:center;">
          <p style="color:rgba(245,234,214,0.4);font-size:0.78rem;margin:0;">
            © 2026 Brew & Bean Artisan Cafe · DHA Phase 5, Lahore<br>
            <a href="mailto:ruralgamesofficial@gmail.com" style="color:#c07c3a;text-decoration:none;">ruralgamesofficial@gmail.com</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>
HTML;
}

function contactConfirmEmailTemplate(string $name, string $subject): string {
    return <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Message Received — Brew & Bean</title>
</head>
<body style="margin:0;padding:0;background:#f5ead6;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ead6;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(61,28,2,0.12);">

      <tr>
        <td style="background:linear-gradient(135deg,#1a0a00,#3d1c02);padding:40px;text-align:center;">
          
          <h1 style="color:#f5ead6;font-family:Georgia,serif;font-size:1.6rem;margin:0;">Brew & Bean</h1>
        </td>
      </tr>

      <tr>
        <td style="padding:48px 40px;">
          <h2 style="color:#1a0a00;font-family:Georgia,serif;font-size:1.5rem;margin:0 0 16px;">We got your message!</h2>
          <p style="color:#6b3a1f;font-size:1rem;line-height:1.7;margin:0 0 20px;">
            Hi <strong>{$name}</strong>, thank you for reaching out to us.
          </p>
          <div style="background:#fdf8f0;border-left:4px solid #c07c3a;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#3d1c02;font-size:0.9rem;"><strong>Your subject:</strong> {$subject}</p>
          </div>
          <p style="color:#6b3a1f;font-size:0.95rem;line-height:1.7;margin:0 0 32px;">
            Our team will review your message and get back to you within <strong>24 hours</strong>. We appreciate your patience!
          </p>
          <div style="text-align:center;">
            <a href="http://localhost/cafe/index.html"
               style="display:inline-block;background:#c07c3a;color:white;padding:14px 36px;border-radius:50px;font-size:0.95rem;font-weight:700;text-decoration:none;">
              Back to Website &rarr;
            </a>
          </div>
        </td>
      </tr>

      <tr>
        <td style="background:#1a0a00;padding:24px 40px;text-align:center;">
          <p style="color:rgba(245,234,214,0.4);font-size:0.78rem;margin:0;">
            © 2026 Brew & Bean · <a href="mailto:ruralgamesofficial@gmail.com" style="color:#c07c3a;text-decoration:none;">ruralgamesofficial@gmail.com</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>
HTML;
}
