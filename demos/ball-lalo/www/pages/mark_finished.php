<?php
include '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);

    // ✅ Update reservation as finished
    $stmt = $conn->prepare("
        UPDATE reservations 
        SET status = 'finished', actual_end_time = CURTIME()
        WHERE id = ?
    ");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => $success]);
    exit;
}

echo json_encode(['success' => false]);
?>
