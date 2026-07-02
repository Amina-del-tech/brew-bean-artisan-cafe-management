<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "POST only"]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$order_id = $data['order_id'] ?? null;
$status   = $data['status'] ?? null;

$allowed = ['pending', 'preparing', 'completed', 'cancelled'];

if (!$order_id || !in_array($status, $allowed)) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->execute([$status, $order_id]);

echo json_encode(["success" => true, "message" => "Status updated!"]);
?>