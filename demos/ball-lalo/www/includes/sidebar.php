<?php
if (!isset($role)) {
    $role = isset($_SESSION['users'][$_SESSION['active_user_id']]['role'])
        ? $_SESSION['users'][$_SESSION['active_user_id']]['role']
        : 'staff';
}
?>

<div class="sidebar" id="sidebar">
    <div class="logo">
        <img src="../assets/images/timeoutlogo.png" alt="TimeOut Logo" class="logo-img">
    </div>
    <ul>
        <?php if ($role === 'admin'): ?>
            <li><a href="dashboard.php"><i class="fas fa-tachometer-alt"></i><span class="link-text"> Dashboard</span></a></li>
            <li><a href="manage_users.php"><i class="fas fa-users"></i><span class="link-text"> Manage Users</span></a></li>
            <li><a href="orders.php"><i class="fas fa-receipt"></i><span class="link-text"> Orders</span></a></li>
            <li><a href="manage_orders.php"><i class="fa-solid fa-clipboard-check"></i><span class="link-text"> Manage Orders</span></a></li>
            <li><a href="manage_menu.php"><i class="fas fa-solid fa-plus-minus"></i><span class="link-text"> Manage Menu</span></a></li>
            <li><a href="reservations.php"><i class="fas fa-calendar-check"></i><span class="link-text"> Reservations</span></a></li>
            <li><a href="manage_reservations.php"><i class="fas fa-calendar-alt"></i><span class="link-text"> Manage Reservations</span></a></li>
            <li><a href="manage_inventory.php"><i class="fas fa-boxes"></i><span class="link-text"> Inventory</span></a></li>
            <li><a href="customer_analytics.php"><i class="fas fa-chart-line"></i><span class="link-text"> Customer Analytics</span></a></li>
        <?php else: ?> <!-- Staff Sidebar -->
            <li><a href="orders.php"><i class="fas fa-receipt"></i><span class="link-text"> Orders</span></a></li>
            <li><a href="manage_orders.php"><i class="fa-solid fa-clipboard-check"></i><span class="link-text"> Manage Orders</span></a></li>
            <li><a href="reservations.php"><i class="fas fa-calendar-check"></i><span class="link-text"> Reservations</span></a></li>
            <li><a href="manage_reservations.php"><i class="fas fa-calendar-alt"></i><span class="link-text"> Manage Reservations</span></a></li>
            <li><a href="manage_inventory.php"><i class="fas fa-boxes"></i><span class="link-text"> Inventory</span></a></li>
        <?php endif; ?>
    </ul>
</div>

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
