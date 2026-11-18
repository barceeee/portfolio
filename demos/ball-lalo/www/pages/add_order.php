<?php
include '../config/db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_SESSION['username'])) {
        echo json_encode(["success" => false, "message" => "You must be logged in to place an order."]);
        exit;
    }

    $customer_name = $_SESSION['username'];
    $product       = $_POST['product'];
    $quantity      = intval($_POST['quantity']);
    $price         = floatval($_POST['price']);
    $total         = $quantity * $price;
    $order_date    = date("Y-m-d H:i:s");

    $stmt = $conn->prepare("INSERT INTO orders (customer_name, product, quantity, price, total, order_date) 
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssidds", $customer_name, $product, $quantity, $price, $total, $order_date);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Order added successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>
