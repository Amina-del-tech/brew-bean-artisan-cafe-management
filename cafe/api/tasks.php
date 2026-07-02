<?php
// ===== TASKS API =====
// GET  -> get all tasks
// POST { action: 'toggle', task_id: 1 } -> toggle task done/undone

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ===== GET =====
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM tasks ORDER BY FIELD(priority,'high','med','low'), id ASC");
    $tasks = $stmt->fetchAll();
    echo json_encode(["success" => true, "tasks" => $tasks]);
    exit;
}

// ===== POST — toggle =====
if ($method === 'POST') {
    $data   = json_decode(file_get_contents("php://input"), true);
    $action  = $data['action'] ?? '';
    $taskId  = $data['task_id'] ?? null;

    if ($action === 'toggle' && $taskId) {
        // Get current status
        $stmt = $pdo->prepare("SELECT is_done FROM tasks WHERE id = ?");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch();
        if ($task) {
            $newStatus = $task['is_done'] ? 0 : 1;
            $upd = $pdo->prepare("UPDATE tasks SET is_done = ? WHERE id = ?");
            $upd->execute([$newStatus, $taskId]);
            echo json_encode(["success" => true, "is_done" => $newStatus]);
            exit;
        }
    }

    echo json_encode(["success" => false, "message" => "Invalid action"]);
    exit;
}

echo json_encode(["success" => false, "message" => "Only GET and POST allowed"]);
?>