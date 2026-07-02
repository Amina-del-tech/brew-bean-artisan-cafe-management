<?php
// ===== NOTIFICATIONS API =====
// GET  ?user_id=1         -> get notifications for user (global + user-specific)
// POST { action: 'read', notification_id: 1 } -> mark as read

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ===== GET — fetch notifications =====
if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;

    if (!$userId) {
        echo json_encode(["success" => false, "message" => "user_id is required"]);
        exit;
    }

    // Get global (user_id NULL) + user-specific notifications
    $stmt = $pdo->prepare("
        SELECT * FROM notifications
        WHERE user_id = ? OR user_id IS NULL
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll();

    echo json_encode(["success" => true, "notifications" => $notifications]);
    exit;
}

// ===== POST — mark as read =====
if ($method === 'POST') {
    $data   = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? '';
    $notifId = $data['notification_id'] ?? null;

    if ($action === 'read' && $notifId) {
        $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
        $stmt->execute([$notifId]);
        echo json_encode(["success" => true, "message" => "Marked as read"]);
        exit;
    }

    // Mark all as read for a user
    if ($action === 'read_all') {
        $userId = $data['user_id'] ?? null;
        if ($userId) {
            $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL");
            $stmt->execute([$userId]);
            echo json_encode(["success" => true, "message" => "All marked as read"]);
            exit;
        }
    }

    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

echo json_encode(["success" => false, "message" => "Only GET and POST requests are allowed"]);
?>