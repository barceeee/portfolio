<?php
include '../config/db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);
    $role     = $_POST['role'];

    $status = 'Active';

    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role, status, created_at) 
                            VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("sssss", $username, $email, $password, $role, $status);

    $response = [];
    if ($stmt->execute()) {
        $response = ["success" => true, "message" => "User created successfully."];
    } else {
        $response = ["success" => false, "message" => "Error: " . $conn->error];
    }
    $stmt->close();

    header('Content-Type: application/json');
    echo json_encode($response);
}
?>
