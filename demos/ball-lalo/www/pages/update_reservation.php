<?php
session_start();
include '../config/db.php';

if (!isset($_SESSION['active_user_id']) || !isset($_SESSION['users'][$_SESSION['active_user_id']])) {
    header("Location: ../index.php");
    exit;
}

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$role       = $activeUser['role'];

if ($role !== 'admin') {
    echo "<script>
            alert('❌ Access denied. Only admins can update reservations.');
            window.location.href = 'manage_reservations.php';
          </script>";
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'], $_POST['action'])) {
    $reservationId = intval($_POST['id']);
    $action        = strtolower(trim($_POST['action']));

    $status = null;
    if ($action === 'approve') {
        $status = 'approved';
    } elseif ($action === 'cancel') {
        $status = 'cancelled';
    }

    if ($status) {
        $stmt = $conn->prepare("UPDATE reservations SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $reservationId);

        if ($stmt->execute()) {
            echo "<script>
                    alert('✅ Reservation has been " . ucfirst($status) . "!');
                    window.location.href = 'manage_reservations.php';
                  </script>";
        } else {
            echo "<script>
                    alert('❌ Failed to update reservation.');
                    window.history.back();
                  </script>";
        }

        $stmt->close();
    } else {
        echo "<script>
                alert('⚠️ Invalid action.');
                window.history.back();
              </script>";
    }
}

$conn->close();
?>
