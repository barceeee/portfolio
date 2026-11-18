<?php
include '../config/db.php';

header('Content-Type: application/json');

$sql = "SELECT id, username, email, role, 
               IFNULL(created_at, '') AS created_at, 
               IFNULL(last_logged_in, '') AS last_logged_in 
        FROM users 
        ORDER BY id DESC";

$result = $conn->query($sql);

$users = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

echo json_encode($users);
