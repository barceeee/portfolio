<?php
session_start();
include '../config/db.php';

if (
    !isset($_SESSION['active_user_id']) ||
    !isset($_SESSION['users'][$_SESSION['active_user_id']])
) {
    header("Location: ../index.php");
    exit;
}

$pageTitle = "Manage Inventory";
$message = "";

// === UPDATE STOCK ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_stock'])) {
    $id = intval($_POST['id']);
    $stock = intval($_POST['stock']);
    $available = isset($_POST['available']) ? 1 : 0;

    $stmt = $conn->prepare("UPDATE menu_items SET stock = ?, available = ? WHERE id = ?");
    $stmt->bind_param("iii", $stock, $available, $id);
    if ($stmt->execute()) {
        $message = "✅ Inventory updated successfully!";
    } else {
        $message = "❌ Error updating inventory.";
    }
    $stmt->close();
}

// === FETCH INVENTORY ===
$result = $conn->query("SELECT id, category, item_name, price, COALESCE(stock, 0) AS stock, COALESCE(available, 1) AS available FROM menu_items ORDER BY category, item_name");
$inventory = [];
if ($result && $result->num_rows > 0) {
    $inventory = $result->fetch_all(MYSQLI_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        .content { padding: 20px; }
        .inventory-table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        .inventory-table th, .inventory-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .inventory-table th {
            background: #f4f4f4;
        }
        .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 15px 0;
            font-size: 18px;
            font-weight: bold;
            opacity: 0;
            transform: translateY(-100%);
            transition: opacity 0.5s, transform 0.5s;
            z-index: 9999;
        }
        .popup.show {
            opacity: 1;
            transform: translateY(0);
        }
        .popup.success { background: #28a745; color: white; }
        .popup.error { background: #dc3545; color: white; }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>
        <div class="content">
            <h2>Manage Inventory</h2>
            <p>View and update stock availability for all menu items.</p>

            <?php if (!empty($message)): ?>
                <div id="popup" class="popup <?= strpos($message, '✅') !== false ? 'success' : 'error' ?>">
                    <?= htmlspecialchars($message) ?>
                </div>
                <script>
                    let popup = document.getElementById("popup");
                    popup.classList.add("show");
                    setTimeout(() => popup.classList.remove("show"), 2000);
                </script>
            <?php endif; ?>

            <?php if (count($inventory) > 0): ?>
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Item Name</th>
                            <th>Price (₱)</th>
                            <th>Stock</th>
                            <th>Available</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($inventory as $item): ?>
                            <tr>
                                <form method="POST">
                                    <td><?= $item['id'] ?></td>
                                    <td><?= htmlspecialchars($item['category']) ?></td>
                                    <td><?= htmlspecialchars($item['item_name']) ?></td>
                                    <td>₱<?= number_format($item['price'], 2) ?></td>
                                    <td>
                                        <input type="number" name="stock" value="<?= htmlspecialchars($item['stock']) ?>" min="0" style="width:80px;">
                                    </td>
                                    <td>
                                        <input type="checkbox" name="available" <?= $item['available'] ? 'checked' : '' ?>>
                                    </td>
                                    <td>
                                        <input type="hidden" name="id" value="<?= $item['id'] ?>">
                                        <button type="submit" name="update_stock" style="background:#007bff;color:#fff;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;">Update</button>
                                    </td>
                                </form>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No menu items found in inventory.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
