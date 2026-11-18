<?php
function generateOrderNumber() {
    return 'ORD-' . date('YmdHis') . '-' . substr(md5(uniqid('', true)), 0, 6);
}

function createOrder($conn, $orderData, $tableNo = null, $customerName = null) {
    if (empty($orderData) || !is_array($orderData)) {
        return ['success' => false, 'message' => 'No order data provided.'];
    }

    $orderNumber = generateOrderNumber();
    $status = "Processing"; // default status

    foreach ($orderData as $item) {
        $category = $conn->real_escape_string($item['category']);
        $product = $conn->real_escape_string($item['item']);
        $quantity = (int)$item['qty'];
        $price = (float)$item['price'];
        $total = $quantity * $price;

        $sql = "INSERT INTO orders (order_number, customer_name, category, product, quantity, price, total, table_no, status, order_date)
                VALUES ('$orderNumber', '$customerName', '$category', '$product', '$quantity', '$price', '$total', '$tableNo', '$status', NOW())";

        if (!$conn->query($sql)) {
            return ['success' => false, 'message' => 'DB Error: ' . $conn->error];
        }
    }

    return [
        'success' => true,
        'order_number' => $orderNumber
    ];
}

function getAllOrders($conn) {
    $sql = "SELECT * FROM orders ORDER BY order_date DESC";
    return $conn->query($sql);
}

function updateOrderStatus($conn, $id, $newStatus) {
    $sql = "UPDATE orders SET status='$newStatus' WHERE id='$id'";
    return $conn->query($sql);
}
?>
