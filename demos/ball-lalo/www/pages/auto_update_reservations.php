<?php
include '../config/db.php';

date_default_timezone_set('Asia/Manila');
$currentDateTime = date('Y-m-d H:i:s');

$sql = "
    UPDATE reservations 
    SET status = 'Finished'
    WHERE status = 'Approved'
      AND CONCAT(reservation_date, ' ', reservation_time) < '$currentDateTime'
";
$conn->query($sql);

echo json_encode(['success' => true]);
?>
