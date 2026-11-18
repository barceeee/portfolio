<?php
session_start();
include '../config/db.php';
include '../includes/orders_functions.php';

if (!isset($_SESSION['active_user_id'])) {
    header("Location: ../index.php");
    exit;
}

$pageTitle = "Manage Orders";

$success = "";
$error = "";

// Update status
if (isset($_POST['update_status'])) {
    $id = $_POST['id'];
    $newStatus = $_POST['status'];

    if (updateOrderStatus($conn, $id, $newStatus)) {
        $success = "Order updated.";
    } else {
        $error = "Failed to update order.";
    }
}

$orders = getAllOrders($conn);
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Manage Orders - Time-Out</title>
<link rel="stylesheet" href="../assets/css/sidebar.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
.order-box {
    width: 90%;
    margin: auto;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
}
.status-processing {
    color: #d69300;
    font-weight: bold;
}
.status-served {
    color: #28a745;
    font-weight: bold;
}
</style>
</head>
<body>

<?php include '../includes/sidebar.php'; ?>
<div class="main">

<?php include '../includes/header.php'; ?>

<div class="content">
    <div class="order-box">
        <h2>Manage Orders</h2>

        <?php if ($success): ?>
            <p style="color:green;"><?= $success ?></p>
        <?php endif; ?>

        <?php if ($error): ?>
            <p style="color:red;"><?= $error ?></p>
        <?php endif; ?>

        <table border="1" cellpadding="8" width="100%">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Table</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $orders->fetch_assoc()): ?>
                <tr>
                    <td><?= $row['order_number'] ?></td>
                    <td><?= $row['customer_name'] ?></td>
                    <td><?= $row['table_no'] ?></td>
                    <td><?= $row['product'] ?></td>
                    <td><?= $row['quantity'] ?></td>
                    <td>₱<?= number_format($row['total'], 2) ?></td>

                    <td>
                        <span class="status-<?= strtolower($row['status']) ?>">
                            <?= $row['status'] ?>
                        </span>
                    </td>

                    <td>
                        <form method="POST">
                            <input type="hidden" name="id" value="<?= $row['id'] ?>">

                            <select name="status">
                                <option <?= $row['status']=="Processing" ? "selected" : "" ?>>Processing</option>
                                <option <?= $row['status']=="Served" ? "selected" : "" ?>>Served</option>
                            </select>

                            <button type="submit" name="update_status">Update</button>
                        </form>
                    </td>

                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>

    </div>
</div>
</div>
</body>
</html>
