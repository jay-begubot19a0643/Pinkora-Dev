<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed');
}

$input = json_decode(file_get_contents('php://input'), true);

$feedback_type = sanitize($input['type'] ?? 'general');
$message = sanitize($input['message'] ?? '');

// Validation
if (empty($message)) {
    respond(false, 'Message is required');
}

if (strlen($message) < 10) {
    respond(false, 'Message must be at least 10 characters long');
}

$user_id = $_SESSION['user_id'] ?? null;
$email = $_SESSION['user_email'] ?? '';

// Insert feedback
$stmt = $connect->prepare("INSERT INTO feedback (user_id, email, feedback_type, message) VALUES (?, ?, ?, ?)");

if (!$stmt) {
    respond(false, 'Database error');
}

$stmt->bind_param("isss", $user_id, $email, $feedback_type, $message);

if ($stmt->execute()) {
    $stmt->close();
    respond(true, 'Feedback submitted successfully');
} else {
    $stmt->close();
    respond(false, 'Failed to submit feedback: ' . $connect->error);
}
?>
