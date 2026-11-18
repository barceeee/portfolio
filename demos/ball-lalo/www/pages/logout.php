<?php
session_start();
include '../config/db.php';

if (isset($_SESSION['active_user_id'])) {
    $userId = $_SESSION['active_user_id'];

    $stmt = $conn->prepare("UPDATE users SET status='Inactive' WHERE id=?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();

    unset($_SESSION['users'][$userId]);
    unset($_SESSION['active_user_id']);
}

if (empty($_SESSION['users'])) {
    session_destroy();
}

header("Location: ../index.php");
exit();
?>