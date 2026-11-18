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

$pageTitle = "Customer Analytics";

// ✅ Check what columns exist in orders
$columnsResult = $conn->query("SHOW COLUMNS FROM orders");
$orderColumns = [];
while ($col = $columnsResult->fetch_assoc()) {
    $orderColumns[] = $col['Field'];
}

// ✅ Build query depending on table structure
if (in_array('menu_item_id', $orderColumns)) {
    $query = "
        SELECT 
            m.item_name AS item_name,
            SUM(o.quantity) AS total_sold,
            SUM(o.price * o.quantity) AS total_revenue
        FROM orders o
        JOIN menu_items m ON o.menu_item_id = m.id
        GROUP BY m.item_name
        ORDER BY total_sold DESC
        LIMIT 10
    ";
} elseif (in_array('item', $orderColumns)) {
    $query = "
        SELECT 
            o.item AS item_name,
            SUM(o.quantity) AS total_sold,
            SUM(o.price * o.quantity) AS total_revenue
        FROM orders o
        GROUP BY o.item
        ORDER BY total_sold DESC
        LIMIT 10
    ";
} else {
    $query = "";
}

$result = $query ? $conn->query($query) : false;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customer Analytics - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .analytics-container {
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
        }
        th, td {
            text-align: center;
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #d1b464;
            color: white;
        }
        h2 {
            text-align: center;
        }
        canvas {
            margin: 40px auto;
            display: block;
            max-width: 600px;
        }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>
        <div class="content analytics-container">
            <h2>📊 Best-Selling Meals</h2>
            <p>These are the top meals based on quantity sold.</p>

            <?php if ($result && $result->num_rows > 0): ?>
                <table>
                    <tr>
                        <th>Rank</th>
                        <th>Meal Name</th>
                        <th>Total Sold</th>
                        <th>Total Revenue (₱)</th>
                    </tr>
                    <?php 
                    $rank = 1;
                    $chartLabels = [];
                    $chartData = [];
                    while ($row = $result->fetch_assoc()):
                        $chartLabels[] = $row['item_name'];
                        $chartData[] = $row['total_sold'];
                    ?>
                    <tr>
                        <td><?= $rank++ ?></td>
                        <td><?= htmlspecialchars($row['item_name']) ?></td>
                        <td><?= $row['total_sold'] ?></td>
                        <td><?= number_format($row['total_revenue'], 2) ?></td>
                    </tr>
                    <?php endwhile; ?>
                </table>

                <canvas id="bestsellerChart"></canvas>

                <script>
                    const ctx = document.getElementById('bestsellerChart');
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: <?= json_encode($chartLabels) ?>,
                            datasets: [{
                                label: 'Units Sold',
                                data: <?= json_encode($chartData) ?>,
                                borderWidth: 1,
                                backgroundColor: 'rgba(209, 180, 100, 0.7)',
                                borderColor: '#b89949'
                            }]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            },
                            plugins: {
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: 'Top 10 Best-Selling Meals',
                                    font: { size: 16 }
                                }
                            }
                        }
                    });
                </script>
            <?php else: ?>
                <p>No order data available or unrecognized order structure.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
