<?php
// ===== LOGIN API =====
// URL: localhost/cafe/api/login.php
// Method: POST
// Body: { "email": "...", "password": "..." }

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

// Read request body
$data     = json_decode(file_get_contents("php://input"), true);
$email    = trim(strtolower($data['email'] ?? ''));
$password = $data['password'] ?? '';

// Validation
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit;
}

// Find email in database
$stmt = $pdo->prepare("SELECT id, name, email, password, role, phone FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

// Check password
if ($user && password_verify($password, $user['password'])) {
    // Password match — login successful
    unset($user['password']); // do not send password in response
    echo json_encode([
        "success" => true,
        "message" => "Login successful!",
        "user"    => $user
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
}
?>