<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed');
}

$input = json_decode(file_get_contents('php://input'), true);

$name = sanitize($input['name'] ?? '');
$email = sanitize($input['email'] ?? '');
$phone = sanitize($input['phone'] ?? '');
$subject = sanitize($input['subject'] ?? '');
$message = sanitize($input['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    respond(false, 'All fields are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email format');
}

if (strlen($message) < 10) {
    respond(false, 'Message must be at least 10 characters long');
}

// Recipient email
$to = 'jaybe.gubot01@gmail.com';
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// Email body
$email_subject = "New Contact Form Submission: $subject";
$email_body = "
<html>
<head>
    <title>$email_subject</title>
</head>
<body>
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Phone:</strong> $phone</p>
    <p><strong>Subject:</strong> $subject</p>
    <hr>
    <p><strong>Message:</strong></p>
    <p>" . nl2br($message) . "</p>
</body>
</html>
";

// Send email
if (mail($to, $email_subject, $email_body, $headers)) {
    respond(true, 'Message sent successfully');
} else {
    respond(false, 'Failed to send message. Please try again later.');
}
?>
