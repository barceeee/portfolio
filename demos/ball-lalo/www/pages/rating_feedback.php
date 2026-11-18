<?php
session_start();

$pageTitle = "Rating and Feedback";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Rating & Feedback - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>
        <div class="content">
            <p>Check customer ratings and feedback for your restaurant.</p>
        </div>
    </div>
</body>
</html>
