<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "POST only"]);
    exit;
}

$data   = json_decode(file_get_contents("php://input"), true);
$id     = intval($data['id'] ?? 0);
$status = $data['status'] ?? '';

if (!$id || !in_array($status, ['confirmed', 'cancelled', 'pending'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE reservations SET status = ? WHERE id = ?");
$stmt->execute([$status, $id]);

echo json_encode(["success" => true, "message" => "Status updated to $status"]);
?>
