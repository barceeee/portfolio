<?php
include '../config/db.php';

$id = intval($_GET['id']);
$status = $conn->real_escape_string($_GET['status']);

$conn->query("UPDATE reservations SET status='$status' WHERE id=$id");
echo "Status updated to $status";
?>
