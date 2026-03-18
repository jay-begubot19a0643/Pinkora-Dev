<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed');
}

$input = json_decode(file_get_contents('php://input'), true);

$email = sanitize($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validation
if (empty($email) || empty($password)) {
    respond(false, 'Email and password are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email format');
}

// Get user by email
$stmt = $connect->prepare("SELECT id, name, email, password, photo_url FROM users WHERE email = ?");
if (!$stmt) {
    respond(false, 'Database error');
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows === 0) {
    respond(false, 'Invalid email or password');
}

$user = $result->fetch_assoc();

// Verify password
if (!verifyPassword($password, $user['password'])) {
    respond(false, 'Invalid email or password');
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['user_email'] = $user['email'];
$_SESSION['user_name'] = $user['name'];

// Update last login
$now = date('Y-m-d H:i:s');
$update_stmt = $connect->prepare("UPDATE users SET last_login = ? WHERE id = ?");
if ($update_stmt) {
    $update_stmt->bind_param("si", $now, $user['id']);
    $update_stmt->execute();
    $update_stmt->close();
}

respond(true, 'Login successful', [
    'user_id' => $user['id'],
    'name' => $user['name'],
    'email' => $user['email'],
    'photo_url' => $user['photo_url']
]);
?>
