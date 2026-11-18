<?php
include '../config/db.php';

$date = $_GET['date'] ?? null;

if (!$date) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT table_no, reservation_time, reservation_end_time FROM reservations 
        WHERE reservation_date = ? AND status != 'cancelled'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$unavailable = [];
while ($row = $result->fetch_assoc()) {
    $unavailable[] = [
        'table_no' => $row['table_no'],
        'start'    => $row['reservation_time'],
        'end'      => $row['reservation_end_time']
    ];
}

echo json_encode($unavailable);
