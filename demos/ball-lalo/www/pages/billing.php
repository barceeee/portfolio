<?php
session_start();
include '../config/db.php';
include '../includes/orders_functions.php';

if (
    !isset($_SESSION['active_user_id']) ||
    !isset($_SESSION['users'][$_SESSION['active_user_id']])
) {
    header("Location: ../index.php");
    exit;
}

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$pageTitle = "Billing";
$username = $activeUser['username'];
$role = $activeUser['role'];

$success = $error = "";
$orderData = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['orderData'])) {
    $orderData = json_decode($_POST['orderData'], true);
    $tableNo = isset($_POST['table_no']) ? trim($_POST['table_no']) : null;
    $customerName = isset($_POST['customer_name']) ? trim($_POST['customer_name']) : null;

    if (empty($orderData) || !is_array($orderData)) {
        $error = "Invalid order data.";
    } else {
        $result = createOrder($conn, $orderData, $tableNo, $customerName);
        if ($result['success']) {
            $success = "✅ Order processed. Order #: " . htmlspecialchars($result['order_number']);

            $_SESSION['last_order_number'] = $result['order_number'];
        } else {
            $error = "❌ " . $result['message'];
        }
    }
} else {
    if (isset($_GET['orderData'])) {
        $orderData = json_decode($_GET['orderData'], true) ?: [];
    }
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Billing - Time-Out</title>
<link rel="stylesheet" href="../assets/css/sidebar.css">
<link rel="stylesheet" href="../assets/css/dashboard.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<style>
.bill-box { border: 2px solid #000; border-radius:10px; padding:20px; width:600px; margin:auto; background:#fff; max-height:80vh; display:flex; flex-direction:column; }
.table-wrapper { flex:1; overflow-y:auto; margin:15px 0; }
th { position: sticky; top: 0; background: #fff; z-index:1; }
.popup { position: fixed; top: 0; left: 0; width: 100%; text-align:center; padding:15px 0; font-size:18px; font-weight:bold; opacity:0; transform:translateY(-100%); transition:opacity .5s, transform .5s; z-index:9999; }
.popup.show { opacity:1; transform:translateY(0); }
.popup.success { background:#28a745; color:#fff; }
.popup.error { background:#dc3545; color:#fff; }
.order-btn { background:#d1b464; padding:10px 20px; border:none; border-radius:15px; cursor:pointer; font-weight:bold; }
</style>
</head>
<body>
<?php include '../includes/sidebar.php'; ?>
<div class="main">
    <?php include '../includes/header.php'; ?>

    <?php if (!empty($success)): ?>
        <div id="successPopup" class="popup success"><?= htmlspecialchars($success) ?></div>
        <script>
            const successPopup = document.getElementById('successPopup');
            successPopup.classList.add('show');
            setTimeout(() => {
                successPopup.classList.remove('show');
                window.location.href = "manage_orders.php"; 
            }, 1600);
        </script>
    <?php endif; ?>

    <?php if (!empty($error)): ?>
        <div id="errorPopup" class="popup error"><?= htmlspecialchars($error) ?></div>
        <script>
            const errorPopup = document.getElementById('errorPopup');
            errorPopup.classList.add('show');
            setTimeout(() => { errorPopup.classList.remove('show'); }, 3000);
        </script>
    <?php endif; ?>

    <div class="content">
        <div class="bill-box">
            <div class="bill-header">
                <h2>Confirm Order</h2>
                <p>Order #: --</p>
            </div>

            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Item</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $grandTotal = 0;
                    if (!empty($orderData)) :
                        foreach ($orderData as $details):
                            $lineTotal = (float)$details['price'] * (int)$details['qty'];
                            $grandTotal += $lineTotal;
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($details['category']) ?></td>
                            <td><?= htmlspecialchars($details['item']) ?></td>
                            <td>₱<?= number_format($details['price'], 2) ?></td>
                            <td><?= (int)$details['qty'] ?></td>
                            <td>₱<?= number_format($lineTotal, 2) ?></td>
                        </tr>
                    <?php
                        endforeach;
                    else: ?>
                        <tr><td colspan="5">No items in order.</td></tr>
                    <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <div class="bill-footer">
                <h3>Total: ₱<?= number_format($grandTotal, 2) ?></h3>

                <form method="POST" action="">
                    <input type="hidden" name="orderData" value='<?= htmlspecialchars(json_encode($orderData), ENT_QUOTES | ENT_SUBSTITUTE) ?>'>

                    <label>Customer name (optional):</label><br>
                    <input type="text" name="customer_name" placeholder="Customer"><br><br>

                    <label>Select Table:</label>
                    <select name="table_no" required>
                        <option value="">Select Table</option>
                        <option value="Table 1">Table 1</option>
                        <option value="Table 2">Table 2</option>
                        <option value="Table 3">Table 3</option>
                        <option value="Table 4">Table 4</option>
                    </select>
                    <br><br>
                    <button type="submit" class="order-btn">Order Now</button>
                </form>
            </div>
        </div>
    </div>
</div>
</body>
</html>
