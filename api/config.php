<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'your_db_username');
define('DB_PASS', 'your_db_password');
define('DB_NAME', 'pinkora_db');

// Session Configuration
session_start();
define('SESSION_TIMEOUT', 60 * 60 * 24); // 24 hours

// Create connection
$connect = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($connect->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false, 
        'message' => 'Database connection failed: ' . $connect->connect_error
    ]));
}

// Set charset to utf8
$connect->set_charset("utf8");

// Helper function: Return JSON response
function respond($success, $message = '', $data = []) {
    header('Content-Type: application/json');
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Helper function: Hash password
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
}

// Helper function: Verify password
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Helper function: Get user data
function getUserData($userId) {
    global $connect;
    $stmt = $connect->prepare("SELECT id, name, email, photo_url, account_status FROM users WHERE id = ?");
    
    if (!$stmt) {
        return null;
    }
    
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    
    return $user;
}

// Helper function: Sanitize input
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}
?>
