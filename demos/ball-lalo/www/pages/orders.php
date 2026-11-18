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

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$pageTitle  = "Orders";
$username   = $activeUser['username'];
$role       = $activeUser['role'];
$userId     = $activeUser['id'];

// ✅ AUTO-UPDATE AVAILABILITY BASED ON STOCK
$conn->query("UPDATE menu_items SET available = 0 WHERE stock <= 0");
$conn->query("UPDATE menu_items SET available = 1 WHERE stock > 0");

// ✅ Fetch all unique categories dynamically from menu_items
$categories = [];
$result = $conn->query("SELECT DISTINCT category FROM menu_items ORDER BY category ASC");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['category'];
    }
}

// ✅ Fetch all menu items grouped by category (only available ones)
$menuItems = [];
$stmt = $conn->prepare("SELECT * FROM menu_items WHERE available = 1 ORDER BY category, item_name");
$stmt->execute();
$res = $stmt->get_result();
while ($row = $res->fetch_assoc()) {
    $menuItems[$row['category']][] = $row;
}
$stmt->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/orders.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        .card.disabled {
            opacity: 0.6;
            pointer-events: none;
        }
        .card small {
            display: block;
            margin-top: 5px;
            font-size: 12px;
            color: #555;
        }
        .card button[disabled] {
            background-color: #ccc;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>

    <div class="main">
        <?php include '../includes/header.php'; ?>
        
        <div class="content">
            <!-- Category Buttons -->
            <div class="categories">
                <?php if (count($categories) > 0): ?>
                    <?php foreach ($categories as $i => $cat): ?>
                        <button class="<?= $i === 0 ? 'active' : '' ?>" onclick="showCategory('cat<?= $i ?>', event)">
                            <?= htmlspecialchars($cat) ?>
                        </button>
                    <?php endforeach; ?>
                <?php else: ?>
                    <p>No categories found. Add some in Manage Orders.</p>
                <?php endif; ?>
            </div>

            <div class="orders-container">
                <!-- Items Section -->
                <div class="items">
                    <?php foreach ($categories as $i => $cat): ?>
                        <div class="category" id="cat<?= $i ?>" style="<?= $i === 0 ? '' : 'display:none;' ?>">
                            <?php if (!empty($menuItems[$cat])): ?>
                                <?php foreach ($menuItems[$cat] as $item): ?>
                                    <div class="card <?= $item['available'] ? '' : 'disabled' ?>">
                                        <h4><?= htmlspecialchars($item['item_name']) ?></h4>
                                        <p>₱<?= number_format($item['price'], 2) ?></p>
                                        
                                        <?php if ($item['available'] && $item['stock'] > 0): ?>
                                            <button onclick="addOrder('<?= addslashes($cat) ?>','<?= addslashes($item['item_name']) ?>', <?= $item['price'] ?>)">Add</button>
                                            <small>Stock: <?= $item['stock'] ?></small>
                                        <?php else: ?>
                                            <button disabled>Out of Stock</button>
                                            <small>Stock: 0</small>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <p>No items available in this category.</p>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>

                <!-- Order Summary -->
                <div class="order-summary">
                    <h3>Your Order</h3>
                    <div class="order-list" id="orderList">
                        <p>No items yet.</p>
                    </div>
                    <div class="order-footer">
                        <div class="order-total">
                            <strong>Total: ₱<span id="orderTotal">0.00</span></strong>
                        </div>
                        <form id="billForm" method="POST" action="billing.php">
                            <input type="hidden" name="orderData" id="orderData">
                            <button type="submit" class="bill-btn" onclick="prepareBill()">Bill</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Order Script -->
    <script>
        let orderList = {};

        function showCategory(category, event) {
            document.querySelectorAll('.category').forEach(cat => cat.style.display = 'none');
            document.getElementById(category).style.display = 'grid';
            document.querySelectorAll('.categories button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function addOrder(category, item, price) {
            let key = category + " - " + item;
            if (orderList[key]) {
                orderList[key].qty += 1;
            } else {
                orderList[key] = { category, item, qty: 1, price };
            }
            renderOrderList();
        }

        function removeOrder(key) {
            if (orderList[key]) {
                orderList[key].qty -= 1;
                if (orderList[key].qty <= 0) delete orderList[key];
            }
            renderOrderList();
        }

        function renderOrderList() {
            let container = document.getElementById("orderList");
            let total = 0;
            container.innerHTML = "";
            let hasItems = false;

            for (let key in orderList) {
                hasItems = true;
                let row = document.createElement("div");
                row.classList.add("order-row");

                let itemTotal = orderList[key].qty * orderList[key].price;
                total += itemTotal;

                let cleanItem = orderList[key].item.replace(/\s*\([^)]*\)/, "");
                let displayKey = orderList[key].category + " - " + cleanItem;

                row.innerHTML = `
                    <div class="order-info">
                        <span>${displayKey}</span> = ₱${itemTotal.toFixed(2)}
                    </div>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="removeOrder('${key}')">-</button>
                        <span class="qty-val">${orderList[key].qty}</span>
                        <button class="qty-btn" onclick="addOrder('${orderList[key].category}','${orderList[key].item}', ${orderList[key].price})">+</button>
                    </div>
                `;
                container.appendChild(row);
            }

            if (!hasItems) {
                container.innerHTML = "<p>No items yet.</p>";
            }

            document.getElementById("orderTotal").textContent = total.toFixed(2);
        }

        function prepareBill() {
            document.getElementById("orderData").value = JSON.stringify(orderList);
        }
    </script>
</body>
</html>
