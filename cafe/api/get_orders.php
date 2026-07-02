<?php
// ===== GET ORDERS API =====
// URL: localhost/cafe/api/get_orders.php?user_id=1
// Method: GET

require_once 'db.php';

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    // Admin -- All orderd
    $stmt = $pdo->query("
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 100
    ");
} else {
    // Customer -- Only his/her orders
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
}

$orders = $stmt->fetchAll();

//  convert Items JSON to array 
foreach ($orders as &$order) {
    $order['items'] = json_decode($order['items'], true);
}

echo json_encode(["success" => true, "orders" => $orders]);
?>
