<?php
// ===== ORDER PLACE API =====
// URL: localhost/cafe/api/place_order.php
// Method: POST
// Body: { "user_id": 1, "items": [...], "subtotal": 1200, "delivery": 150, "tax": 60, "total": 1410, "address": "..." }

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed"]);
    exit;
}

$data     = json_decode(file_get_contents("php://input"), true);
$userId   = $data['user_id'] ?? null;
$items    = $data['items'] ?? [];
$subtotal = $data['subtotal'] ?? 0;
$delivery = $data['delivery'] ?? 0;
$tax      = $data['tax'] ?? 0;
$total    = $data['total'] ?? 0;
$address  = trim($data['address'] ?? '');

if (empty($items)) {
    echo json_encode(["success" => false, "message" => "Cart is empty"]);
    exit;
}

// Generate unique order number
$orderNo = '#ORD-' . strtoupper(substr(uniqid(), -6));

$stmt = $pdo->prepare("
    INSERT INTO orders (user_id, order_no, items, subtotal, delivery, tax, total, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([
    $userId,
    $orderNo,
    json_encode($items),
    $subtotal,
    $delivery,
    $tax,
    $total,
    $address
]);

echo json_encode([
    "success"  => true,
    "message"  => "Order placed successfully!",
    "order_no" => $orderNo
]);
?>