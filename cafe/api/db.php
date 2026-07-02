<?php
// ===== DATABASE CONNECTION =====

// Safety net: prevent stray PHP warnings/notices from any API file (e.g. mail()
// connection failures) from being printed into the output and corrupting the
// JSON response sent to the frontend. Errors are still logged, just not echoed.
ini_set('display_errors', '0');
error_reporting(E_ALL);

$host     = "localhost";
$dbname   = "cafe_db";
$username = "root";       // XAMPP default username
$password = "";           // In XAMPP default password will be empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Pakistan timezone set karo
    $pdo->exec("SET time_zone = '+05:00'");
    date_default_timezone_set('Asia/Karachi');

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database is not connected : " . $e->getMessage()]);
    exit;
}

// CORS headers — localhost par kaam karne ke liye
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// OPTIONS preflight request handle karo
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>