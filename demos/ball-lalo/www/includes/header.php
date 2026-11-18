<div class="header">
    <h1>
        <?php 
        echo isset($pageTitle) ? $pageTitle : "Untitled Page"; 
        ?>
    </h1>
    <div class="user-info" style="position: relative; display: flex; align-items: center; gap: 15px;">
        <?php 
        if (isset($_SESSION['active_user_id']) && isset($_SESSION['users'][$_SESSION['active_user_id']])): 
            $activeUser = $_SESSION['users'][$_SESSION['active_user_id']]; 

            // ✅ Query for low stock items
            include '../config/db.php';
            $lowStockQuery = $conn->query("SELECT item_name, stock FROM menu_items WHERE stock < 10 ORDER BY stock ASC");
            $lowStockCount = $lowStockQuery->num_rows;
        ?>
        
        <!-- 🔔 Notification Bell -->
        <div class="notification" style="position: relative;">
            <i class="fa-solid fa-bell" style="font-size: 22px; cursor: pointer; color: <?= $lowStockCount > 0 ? '#d9534f' : '#777'; ?>;"
                onclick="toggleNotificationDropdown()"></i>
            <?php if ($lowStockCount > 0): ?>
                <span class="notif-count" 
                    style="position: absolute; top: -6px; right: -6px; background: #d9534f; color: white; 
                           border-radius: 50%; font-size: 12px; padding: 2px 6px;">
                    <?= $lowStockCount ?>
                </span>
            <?php endif; ?>

            <!-- Dropdown List -->
            <div id="notifDropdown" 
                style="display: none; position: absolute; right: 0; top: 30px; background: white; border: 1px solid #ddd;
                       border-radius: 8px; width: 220px; max-height: 250px; overflow-y: auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1); z-index: 9999;">
                <div style="padding: 8px; font-weight: bold; background: #f9f9f9; border-bottom: 1px solid #eee;">Low Stock Items</div>
                <?php if ($lowStockCount > 0): ?>
                    <?php while ($item = $lowStockQuery->fetch_assoc()): ?>
                        <div style="padding: 8px; border-bottom: 1px solid #eee; font-size: 14px;">
                            <?= htmlspecialchars($item['item_name']) ?> 
                            <span style="float: right; color: <?= $item['stock'] <= 3 ? '#b30000' : '#ff9800'; ?>">
                                <?= $item['stock'] ?> left
                            </span>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div style="padding: 10px; font-size: 14px; text-align: center;">All stocks are sufficient ✅</div>
                <?php endif; ?>
            </div>
        </div>

        <!-- User Info -->
        <div>
            Hi, <?= htmlspecialchars($activeUser['username']) ?> (<?= htmlspecialchars($activeUser['role']) ?>) | 
            <a href="../pages/logout.php" class="logout-link" 
               onclick="return confirm('Are you sure you want to logout?');">Logout</a>
        </div>
        <?php else: ?>
            <a href="../index.php">Login</a>
        <?php endif; ?>
    </div>
</div>

<script>
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notifDropdown');
    dropdown.style.display = (dropdown.style.display === 'block') ? 'none' : 'block';
}

// Hide dropdown if user clicks outside
window.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notifDropdown');
    const bell = document.querySelector('.fa-bell');
    if (!bell.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});
</script>
