<?php
// Portfolio demo: the original connected to MySQL. Here the same $conn API runs on SQLite in the browser.
require_once __DIR__ . '/../demo/db_sqlite.php';
$conn = demo_db();

// Customers only have the customer page: the staff pages (pages/*.php) send them there.
if (session_status() === PHP_SESSION_ACTIVE) {
    $demoRole = $_SESSION['users'][$_SESSION['active_user_id'] ?? 0]['role'] ?? '';
    $demoScript = str_replace(chr(92), '/', $_SERVER['SCRIPT_NAME'] ?? '');
    if (strtolower($demoRole) === 'customer' && strpos($demoScript, '/pages/') !== false && basename($demoScript) !== 'logout.php') {
        header('Location: ../customer_pages/customer_dashboard.php');
        exit;
    }
}
