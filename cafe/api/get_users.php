<?php
// ===== GET USERS API =====
require_once 'db.php';

$stmt = $pdo->query("SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
$users = $stmt->fetchAll();

echo json_encode(["success" => true, "users" => $users]);
?>
