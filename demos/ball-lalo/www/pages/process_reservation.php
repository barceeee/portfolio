<?php
session_start();
include '../config/db.php';

if (!isset($_SESSION['active_user_id']) || !isset($_SESSION['users'][$_SESSION['active_user_id']])) {
    header("Location: ../index.php");
    exit;
}

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$userId     = $activeUser['id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name        = trim($_POST['name']);
    $phone       = trim($_POST['phone']);
    $date        = $_POST['reservation_date'];
    $start_time  = $_POST['reservation_time'];
    $end_time    = $_POST['reservation_end_time'];
    $persons     = $_POST['persons'];
    $table_no    = $_POST['table_no'];
    $user_id     = $_POST['user_id'];

    // --- Basic validation ---
    if (empty($name) || empty($phone) || empty($date) || empty($start_time) || empty($end_time) || empty($table_no)) {
        $_SESSION['popup'] = [
            'type' => 'error',
            'message' => '⚠️ Please fill out all required fields.'
        ];
        header("Location: reservations.php");
        exit;
    }

    // --- Time logic validation ---
    if (strtotime($end_time) <= strtotime($start_time)) {
        $_SESSION['popup'] = [
            'type' => 'error',
            'message' => '⚠️ End time must be later than start time.'
        ];
        header("Location: reservations.php");
        exit;
    }

    // --- Conflict check (same table, date, and overlapping time range) ---
    $conflictQuery = $conn->prepare("
        SELECT * FROM reservations
        WHERE reservation_date = ?
          AND table_no = ?
          AND status != 'cancelled'
          AND (
              (? < reservation_end_time AND ? > reservation_time)
          )
    ");
    $conflictQuery->bind_param("ssss", $date, $table_no, $start_time, $end_time);
    $conflictQuery->execute();
    $conflicts = $conflictQuery->get_result();

    if ($conflicts->num_rows > 0) {
        $conflict = $conflicts->fetch_assoc();
        $_SESSION['popup'] = [
            'type' => 'error',
            'message' => "⚠️ Reservation conflict! Table {$conflict['table_no']} is already reserved from " .
                         date('g:i A', strtotime($conflict['reservation_time'])) . " to " .
                         date('g:i A', strtotime($conflict['reservation_end_time'])) . "."
        ];
        header("Location: reservations.php");
        exit;
    }

    // --- Automatically approve reservation if no conflicts ---
    $status = 'approved';
    $insert = $conn->prepare("
        INSERT INTO reservations 
        (user_id, name, phone, reservation_date, reservation_time, reservation_end_time, persons, table_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $insert->bind_param(
        "issssssss",
        $user_id, $name, $phone, $date, $start_time, $end_time, $persons, $table_no, $status
    );

    if ($insert->execute()) {
        $_SESSION['popup'] = [
            'type' => 'success',
            'message' => '✅ Reservation successfully created and automatically approved!'
        ];
    } else {
        $_SESSION['popup'] = [
            'type' => 'error',
            'message' => '❌ Failed to create reservation. Please try again.'
        ];
    }

    // --- Redirect back to form ---
    header("Location: reservations.php");
    exit;
}
?>
