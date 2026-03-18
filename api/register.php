<?php
require_once 'config.php';

// Only POST requests allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed');
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$name = sanitize($input['name'] ?? '');
$email = sanitize($input['email'] ?? '');
$password = $input['password'] ?? '';

// Validation
if (empty($name)) {
    respond(false, 'Name is required');
}

if (empty($email)) {
    respond(false, 'Email is required');
}

if (empty($password)) {
    respond(false, 'Password is required');
}

if (strlen($password) < 6) {
    respond(false, 'Password must be at least 6 characters long');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email format');
}

if (strlen($name) < 2) {
    respond(false, 'Name must be at least 2 characters long');
}

// Check if email already exists
$stmt = $connect->prepare("SELECT id FROM users WHERE email = ?");
if (!$stmt) {
    respond(false, 'Database error');
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

if ($result->num_rows > 0) {
    respond(false, 'Email already registered');
}

// Hash password
$hashed_password = hashPassword($password);

// Insert new user
$stmt = $connect->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
if (!$stmt) {
    respond(false, 'Database error');
}

$stmt->bind_param("sss", $name, $email, $hashed_password);

if ($stmt->execute()) {
    $new_user_id = $connect->insert_id;
    
    // Set session
    $_SESSION['user_id'] = $new_user_id;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_name'] = $name;
    
    $stmt->close();
    
    respond(true, 'Account created successfully', [
        'user_id' => $new_user_id,
        'name' => $name,
        'email' => $email
    ]);
} else {
    $stmt->close();
    respond(false, 'Registration failed: ' . $connect->error);
}
?>
