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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $customer_name = $_SESSION['active_user_id'];
    $order_date    = date("Y-m-d H:i:s");

    // Generate unique order number (example: ORD20250903-1234)
    $order_number = "ORD" . date("Ymd") . "-" . rand(1000, 9999);

    // Decode the orderData array coming from billing.php
    $orderData = json_decode($_POST['orderData'], true);

    if (!empty($orderData)) {
        $stmt = $conn->prepare("INSERT INTO orders 
            (order_number, customer_name, category, product, quantity, price, total, order_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

        foreach ($orderData as $details) {
            $category = $details['category'];
            $product  = $details['item'];
            $quantity = intval($details['qty']);
            $price    = floatval($details['price']);
            $total    = $quantity * $price;

            $stmt->bind_param("ssssidds", 
                $order_number, $customer_name, $category, $product, $quantity, $price, $total, $order_date);
            $stmt->execute();
        }
        $stmt->close();

        echo "<script>alert('Order placed successfully! Order Number: $order_number'); window.location.href='orders.php';</script>";
    } else {
        echo "<script>alert('No order data received.'); window.location.href='orders.php';</script>";
    }
}

$conn->close();
?>
