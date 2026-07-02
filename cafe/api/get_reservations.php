<?php
// ===== GET RESERVATIONS API =====
require_once 'db.php';

$userId = $_GET['user_id'] ?? null;
$role   = $_GET['role'] ?? null;

if ($userId) {
    // Customer: sirf apni reservations
    $stmt = $pdo->prepare("SELECT * FROM reservations WHERE user_id = ? ORDER BY date DESC, time DESC");
    $stmt->execute([$userId]);
} else {
    // Admin / Staff: saari reservations, koi limit nahi
    $stmt = $pdo->query("SELECT r.*, u.name as customer_name 
                         FROM reservations r 
                         LEFT JOIN users u ON r.user_id = u.id 
                         ORDER BY r.date ASC, r.time ASC");
}

$reservations = $stmt->fetchAll();
echo json_encode(["success" => true, "reservations" => $reservations]);
?>
