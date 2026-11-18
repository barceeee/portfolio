<?php
include '../config/db.php';

$year = isset($_GET['year']) ? (int)$_GET['year'] : date("Y");
$month = isset($_GET['month']) ? (int)$_GET['month'] : date("m");

$query = "SELECT DAY(order_date) AS day, 
                 SUM(total) AS sales, 
                 SUM(quantity) AS orders
          FROM orders
          WHERE YEAR(order_date) = $year 
          AND MONTH(order_date) = $month
          GROUP BY DAY(order_date)
          ORDER BY day";
$result = $conn->query($query);

$daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

$labels = [];
$salesData = [];
$orderData = [];

for ($d = 1; $d <= $daysInMonth; $d++) {
    $labels[$d] = $d;
    $salesData[$d] = 0;
    $orderData[$d] = 0;
}

$hasData = false;
while ($row = $result->fetch_assoc()) {
    $day = (int)$row['day'];
    $salesData[$day] = (float)$row['sales'];
    $orderData[$day] = (int)$row['orders'];
    if ($row['sales'] > 0 || $row['orders'] > 0) {
        $hasData = true;
    }
}

// ✅ Today’s summary
$today = date("Y-m-d");
$todayQuery = "SELECT SUM(total) AS todaySales, SUM(quantity) AS todayOrders 
               FROM orders WHERE DATE(order_date) = '$today'";
$todayResult = $conn->query($todayQuery);
$todayData = $todayResult->fetch_assoc();

echo json_encode([
    "labels" => array_values($labels),
    "sales" => array_values($salesData),
    "orders" => array_values($orderData),
    "hasData" => $hasData,
    "todaySales" => $todayData['todaySales'] ?? 0,
    "todayOrders" => $todayData['todayOrders'] ?? 0
]);
?>
