<?php
include '../config/db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id       = intval($_POST['id']);
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $role     = $_POST['role'];

    $stmt = $conn->prepare("UPDATE users SET username=?, email=?, role=? WHERE id=?");
    $stmt->bind_param("sssi", $username, $email, $role, $id);

    $response = [];
    if ($stmt->execute()) {
        $response = ["success" => true, "message" => "User updated successfully."];
    } else {
        $response = ["success" => false, "message" => "Error: " . $conn->error];
    }
    $stmt->close();

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
