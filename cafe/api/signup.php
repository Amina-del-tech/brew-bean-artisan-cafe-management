<?php
// ===== SIGNUP API =====
require_once 'db.php';
require_once 'mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$name     = trim($data['name'] ?? '');
$email    = trim(strtolower($data['email'] ?? ''));
$password = $data['password'] ?? '';
$phone    = trim($data['phone'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Name, email and password are required"]);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Check duplicate
$check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$check->execute([$email]);
if ($check->fetch()) {
    echo json_encode(["success" => false, "message" => "This email is already registered"]);
    exit;
}

// Save user
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'customer')");
$stmt->execute([$name, $email, $hashedPassword, $phone]);
$newId = $pdo->lastInsertId();

// Send welcome email (non-blocking — if it fails, signup still succeeds)
$firstName = explode(' ', $name)[0];
$mailSent  = sendMail(
    $email,
    $name,
    "Welcome to Brew & Bean, {$firstName}!",
    welcomeEmailTemplate($firstName)
);

echo json_encode([
    "success"    => true,
    "message"    => "Account created successfully! Please log in.",
    "mail_sent"  => $mailSent,
    "user"       => [
        "id"    => $newId,
        "name"  => $name,
        "email" => $email,
        "phone" => $phone,
        "role"  => "customer"
    ]
]);
?>
