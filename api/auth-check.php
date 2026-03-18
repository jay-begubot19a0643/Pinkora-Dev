<?php
require_once 'config.php';

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    $user = getUserData($_SESSION['user_id']);
    
    if ($user) {
        respond(true, 'User authenticated', $user);
    } else {
        session_destroy();
        respond(false, 'User not found');
    }
} else {
    respond(false, 'Not authenticated');
}
?>
