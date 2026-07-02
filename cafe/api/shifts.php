<?php
// ===== SHIFTS API =====
require_once 'db.php';

// Set Pakistan timezone
$pdo->exec("SET time_zone = '+05:00'");
date_default_timezone_set('Asia/Karachi');

$method = $_SERVER['REQUEST_METHOD'];

// ===== GET — get active shift =====
if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(["success" => false, "message" => "user_id required"]);
        exit;
    }
    $stmt = $pdo->prepare("SELECT * FROM shifts WHERE user_id = ? AND clock_out IS NULL ORDER BY clock_in DESC LIMIT 1");
    $stmt->execute([$userId]);
    $shift = $stmt->fetch();
    echo json_encode(["success" => true, "shift" => $shift ?: null]);
    exit;
}

// ===== POST — clock in/out =====
if ($method === 'POST') {
    $data   = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? '';
    $userId = $data['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "user_id required"]);
        exit;
    }

    if ($action === 'clock_in') {
        $check = $pdo->prepare("SELECT id FROM shifts WHERE user_id = ? AND clock_out IS NULL");
        $check->execute([$userId]);
        if ($check->fetch()) {
            echo json_encode(["success" => false, "message" => "Already clocked in"]);
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO shifts (user_id, clock_in) VALUES (?, NOW())");
        $stmt->execute([$userId]);
        echo json_encode(["success" => true, "message" => "Clocked in!", "clock_in" => date('Y-m-d H:i:s')]);
        exit;
    }

    if ($action === 'clock_out') {
        $stmt = $pdo->prepare("UPDATE shifts SET clock_out = NOW() WHERE user_id = ? AND clock_out IS NULL");
        $stmt->execute([$userId]);
        echo json_encode(["success" => true, "message" => "Clocked out!"]);
        exit;
    }

    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

echo json_encode(["success" => false, "message" => "Only GET and POST allowed"]);
?>