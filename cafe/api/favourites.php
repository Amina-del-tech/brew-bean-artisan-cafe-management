<?php
// ===== FAVOURITES API =====
// GET  ?user_id=1          -> get all favourites
// POST { user_id, item_name, item_price, item_img } -> toggle favourite

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ===== GET — fetch favourites =====
if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(["success" => false, "message" => "user_id is required"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM favourites WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $favs = $stmt->fetchAll();

    echo json_encode(["success" => true, "favourites" => $favs]);
    exit;
}

// ===== POST — toggle favourite =====
if ($method === 'POST') {
    $data      = json_decode(file_get_contents("php://input"), true);
    $userId    = $data['user_id']    ?? null;
    $itemName  = trim($data['item_name']  ?? '');
    $itemPrice = $data['item_price'] ?? 0;
    $itemImg   = trim($data['item_img']   ?? '');

    if (!$userId || empty($itemName)) {
        echo json_encode(["success" => false, "message" => "user_id and item_name are required"]);
        exit;
    }

    // Check if already favourited
    $check = $pdo->prepare("SELECT id FROM favourites WHERE user_id = ? AND item_name = ?");
    $check->execute([$userId, $itemName]);
    $existing = $check->fetch();

    if ($existing) {
        // Remove from favourites
        $del = $pdo->prepare("DELETE FROM favourites WHERE id = ?");
        $del->execute([$existing['id']]);
        echo json_encode(["success" => true, "action" => "removed", "message" => "Removed from favourites"]);
    } else {
        // Add to favourites
        $ins = $pdo->prepare("INSERT INTO favourites (user_id, item_name, item_price, item_img) VALUES (?, ?, ?, ?)");
        $ins->execute([$userId, $itemName, $itemPrice, $itemImg]);
        echo json_encode(["success" => true, "action" => "added", "message" => "Added to favourites!"]);
    }
    exit;
}

echo json_encode(["success" => false, "message" => "Only GET and POST requests are allowed"]);
?>