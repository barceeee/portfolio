<?php
include '../config/db.php';
session_start();

if (
    !isset($_SESSION['active_user_id']) ||
    !isset($_SESSION['users'][$_SESSION['active_user_id']])
) {
    header("Location: ../index.php");
    exit;
}

$pageTitle    = "Dashboard";
$currentYear  = date("Y");
$currentMonth = date("m");

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$username   = $activeUser['username'];
$role       = $activeUser['role'];
$email      = $activeUser['email'];
$userId     = $activeUser['id'];
?>



<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .summary-cards {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .summary-card {
            flex: 1;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-card h3 {
            margin: 0;
            font-size: 18px;
            color: #555;
        }
        .summary-card p {
            font-size: 26px;
            font-weight: bold;
            margin: 10px 0 0;
        }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>
        <div class="content">
            <h2>Sales Overview</h2>

            <div class="summary-cards">
                <div class="summary-card">
                    <h3>Total Sales (Today)</h3>
                    <p id="totalSales">₱0</p>
                </div>
                <div class="summary-card">
                    <h3>Total Orders (Today)</h3>
                    <p id="totalOrders">0</p>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label for="year">Select Year:</label>
                <select name="year" id="year">
                    <?php
                    for ($y = $currentYear; $y >= $currentYear - 5; $y--) {
                        echo "<option value='$y' ".($y == $currentYear ? "selected" : "").">$y</option>";
                    }
                    ?>
                </select>

                <label for="month">Select Month:</label>
                <select name="month" id="month">
                    <?php
                    for ($m = 1; $m <= 12; $m++) {
                        $monthName = date("F", mktime(0, 0, 0, $m, 1));
                        echo "<option value='$m' ".($m == $currentMonth ? "selected" : "").">$monthName</option>";
                    }
                    ?>
                </select>
            </div>

            <div id="chartContainer" style="display:none;">
                <canvas id="salesChart" width="400" height="150"></canvas>
            </div>
            <p id="noDataMessage" style="color: gray; display:none;">No sales data available for this period.</p>
        </div>
    </div>

    <script>
        let salesChart;

        function loadChart(year, month) {
            $.get("get_sales_data.php", { year: year, month: month }, function(data) {
                const response = JSON.parse(data);

                $("#totalSales").text("₱" + response.todaySales);
                $("#totalOrders").text(response.todayOrders);

                if (response.hasData) {
                    $("#chartContainer").show();
                    $("#noDataMessage").hide();

                    if (salesChart) {
                        salesChart.destroy();
                    }

                    const ctx = document.getElementById('salesChart').getContext('2d');
                    salesChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: response.labels,
                            datasets: [
                                {
                                    label: 'Sales (₱)',
                                    data: response.sales,
                                    borderColor: 'rgba(0, 180, 255, 1)',
                                    backgroundColor: 'rgba(0, 180, 255, 0.2)',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.3
                                },
                                {
                                    label: 'Orders',
                                    data: response.orders,
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.3
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: { legend: { display: true } },
                            scales: {
                                y: { beginAtZero: true },
                                x: { title: { display: true, text: 'Day of Month' } }
                            }
                        }
                    });
                } else {
                    $("#chartContainer").hide();
                    $("#noDataMessage").show();
                }
            });
        }

        $(document).ready(function() {
            let year = $("#year").val();
            let month = $("#month").val();

            loadChart(year, month);

            $("#year, #month").on("change", function() {
                year = $("#year").val();
                month = $("#month").val();
                loadChart(year, month);
            });
        });
    </script>

    <script>
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.add("collapsed");
        sidebar.addEventListener("mouseenter", () => {
            sidebar.classList.remove("collapsed");
        });
        sidebar.addEventListener("mouseleave", () => {
            sidebar.classList.add("collapsed");
        });
    </script>
</body>
</html>
