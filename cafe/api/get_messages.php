<?php
// ===== GET CONTACT MESSAGES API =====
// URL: localhost/cafe/api/get_messages.php
// Method: GET

require_once 'db.php';

$stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
$messages = $stmt->fetchAll();

echo json_encode(["success" => true, "messages" => $messages]);
?>
