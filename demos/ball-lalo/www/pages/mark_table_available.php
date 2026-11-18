<?php
session_start();
include '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reservation_id = $_POST['reservation_id'];
    $actual_end_time = date("H:i:s"); // mark current time as finish

    $stmt = $conn->prepare("UPDATE reservations SET actual_end_time = ? WHERE id = ?");
    $stmt->bind_param("si", $actual_end_time, $reservation_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
    $stmt->close();
    $conn->close();
}
?>
