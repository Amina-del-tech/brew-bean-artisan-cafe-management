<?php
// ===== CONTACT FORM API =====
require_once 'db.php';
require_once 'mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

$data    = json_decode(file_get_contents("php://input"), true);
$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? 'General Inquiry');
$message = trim($data['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(["success" => false, "message" => "Name, email and message are required"]);
    exit;
}

// Save to DB
$stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
$stmt->execute([$name, $email, $subject, $message]);

// Send confirmation email to user
$mailSent = sendMail(
    $email,
    $name,
    "We received your message — Brew & Bean",
    contactConfirmEmailTemplate($name, $subject ?: 'General Inquiry')
);

// Also notify cafe (optional — sends copy to cafe email)
sendMail(
    MAIL_FROM,
    MAIL_FROM_NAME,
    "New Contact Form: {$subject} — from {$name}",
    "<h3>New message from {$name} ({$email})</h3><p><strong>Subject:</strong> {$subject}</p><p><strong>Message:</strong><br>" . nl2br(htmlspecialchars($message)) . "</p>"
);

echo json_encode([
    "success"   => true,
    "message"   => "Your message has been received! We'll reply within 24 hours.",
    "mail_sent" => $mailSent
]);
?>
