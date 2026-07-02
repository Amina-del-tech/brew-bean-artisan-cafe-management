<?php
// ===== RESERVATION API =====
// URL: localhost/cafe/api/reservation.php
// Method: POST

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$userId   = $data['user_id'] ?? null;
$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$phone    = trim($data['phone'] ?? '');
$guests   = intval($data['guests'] ?? 1);
$date     = $data['date'] ?? '';
$time     = $data['time'] ?? '';
$occasion = $data['occasion'] ?? '';
$notes    = trim($data['notes'] ?? '');

// Basic validation
if (empty($name) || empty($email) || empty($date) || empty($time)) {
    echo json_encode(["success" => false, "message" => "Name, email, date and time are required"]);
    exit;
}

$stmt = $pdo->prepare("
    INSERT INTO reservations (user_id, name, email, phone, guests, date, time, occasion, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$userId, $name, $email, $phone, $guests, $date, $time, $occasion, $notes]);
$resId = '#RES-' . (400 + $pdo->lastInsertId());

echo json_encode([
    "success" => true,
    "message" => "Reservation confirmed successfully!",
    "res_id"  => $resId
]);
?>