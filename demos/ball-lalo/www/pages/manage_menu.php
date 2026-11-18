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

$pageTitle = "Manage Menu";
$message = '';
$messageType = ''; // success or error

// === ADD MENU ITEM ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_menu'])) {
    $category = trim($_POST['category']);
    $item_name = trim($_POST['item_name']);
    $price = trim($_POST['price']);

    if (!empty($category) && !empty($item_name) && is_numeric($price)) {
        $stmt = $conn->prepare("INSERT INTO menu_items (category, item_name, price) VALUES (?, ?, ?)");
        $stmt->bind_param("ssd", $category, $item_name, $price);
        if ($stmt->execute()) {
            $message = "Menu item added successfully!";
            $messageType = "success";
        } else {
            $message = "Error adding item: " . $conn->error;
            $messageType = "error";
        }
        $stmt->close();
    } else {
        $message = "Please fill in all fields correctly.";
        $messageType = "error";
    }
}

// === DELETE MENU ITEM ===
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $stmt = $conn->prepare("DELETE FROM menu_items WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        $message = "Menu item deleted successfully!";
        $messageType = "success";
    } else {
        $message = "Error deleting item.";
        $messageType = "error";
    }
    $stmt->close();
}

// === UPDATE MENU ITEM ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_menu'])) {
    $id = intval($_POST['id']);
    $category = trim($_POST['category']);
    $item_name = trim($_POST['item_name']);
    $price = trim($_POST['price']);

    if (!empty($category) && !empty($item_name) && is_numeric($price)) {
        $stmt = $conn->prepare("UPDATE menu_items SET category = ?, item_name = ?, price = ? WHERE id = ?");
        $stmt->bind_param("ssdi", $category, $item_name, $price, $id);
        if ($stmt->execute()) {
            $message = "Menu item updated successfully!";
            $messageType = "success";
        } else {
            $message = "Error updating item.";
            $messageType = "error";
        }
        $stmt->close();
    } else {
        $message = "Invalid input. Please fill all fields correctly.";
        $messageType = "error";
    }
}

// === FETCH MENU ITEMS ===
$menu_items = [];
$result = $conn->query("SELECT * FROM menu_items ORDER BY category, item_name");
if ($result && $result->num_rows > 0) {
    $menu_items = $result->fetch_all(MYSQLI_ASSOC);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($pageTitle) ?> - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        /* === POPUP STYLE (from signup.php) === */
        .popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            text-align: center;
            padding: 15px 0;
            font-size: 18px;
            font-weight: bold;
            opacity: 0;
            transform: translateY(-100%);
            transition: opacity 0.5s, transform 0.5s;
            z-index: 9999;
        }
        .popup.show {
            opacity: 1;
            transform: translateY(0);
        }
        .popup.success { background: #28a745; color: white; }
        .popup.error { background: #dc3545; color: white; }

        /* === PAGE CONTENT STYLE === */
        .content { padding: 20px; }
        form.add-menu, form.edit-menu { max-width: 500px; margin-bottom: 30px; }
        form.add-menu input, form.edit-menu input {
            width: 100%; padding: 10px; margin: 5px 0;
            border-radius: 8px; border: 1px solid #ccc;
        }
        form.add-menu button, form.edit-menu button {
            background-color: #007bff; color: #fff; padding: 10px 20px;
            border: none; border-radius: 8px; cursor: pointer;
        }
        form.add-menu button:hover, form.edit-menu button:hover {
            background-color: #0056b3;
        }
        .menu-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        .menu-table th, .menu-table td {
            border: 1px solid #ddd; padding: 10px; text-align: left;
        }
        .menu-table th { background: #f4f4f4; }
        .actions button {
            margin-right: 5px; padding: 5px 10px;
            border: none; border-radius: 5px; cursor: pointer;
        }
        .actions .edit { background: #28a745; color: white; }
        .actions .delete { background: #dc3545; color: white; }
        .actions .cancel { background: #6c757d; color: white; }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>

        <!-- === POPUP MESSAGE === -->
        <?php if (!empty($message)): ?>
            <div id="popupMessage" class="popup <?= $messageType ?>"><?= htmlspecialchars($message) ?></div>
            <script>
                let popup = document.getElementById("popupMessage");
                popup.classList.add("show");
                setTimeout(() => popup.classList.remove("show"), 2000);
            </script>
        <?php endif; ?>

        <div class="content">

        <!-- ADD MENU FORM -->
            <form method="POST" class="add-menu">
                <h3>Add New Menu Item</h3>
                <input type="text" name="category" placeholder="Category (e.g., Pancit Canton)" required>
                <input type="text" name="item_name" placeholder="Menu Item Name (e.g., Pancit Canton Regular)" required>
                <input type="number" name="price" step="0.01" placeholder="Price (e.g., 99.00)" required>
                <button type="submit" name="add_menu">Add Menu</button>
            </form>

            <!-- EXISTING MENU ITEMS -->
            <h3>Existing Menu Items</h3>
            <?php if (count($menu_items) > 0): ?>
                <table class="menu-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Item Name</th>
                            <th>Price (₱)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($menu_items as $item): ?>
                            <tr id="row-<?= $item['id'] ?>">
                                <td><?= $item['id'] ?></td>
                                <td class="cat"><?= htmlspecialchars($item['category']) ?></td>
                                <td class="name"><?= htmlspecialchars($item['item_name']) ?></td>
                                <td class="price">₱<?= number_format($item['price'], 2) ?></td>
                                <td class="actions">
                                    <button class="edit" onclick="editItem(<?= $item['id'] ?>)">Edit</button>
                                    <a href="?delete=<?= $item['id'] ?>" onclick="return confirm('Delete this item?')">
                                        <button type="button" class="delete">Delete</button>
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <p>No menu items found.</p>
            <?php endif; ?>
        </div>
    </div>

    <script>
        function editItem(id) {
            const row = document.getElementById('row-' + id);
            const category = row.querySelector('.cat').textContent.trim();
            const name = row.querySelector('.name').textContent.trim();
            const price = row.querySelector('.price').textContent.replace('₱','').trim();

            row.innerHTML = `
                <td>${id}</td>
                <td><input type="text" name="category" value="${category}" required></td>
                <td><input type="text" name="item_name" value="${name}" required></td>
                <td><input type="number" name="price" step="0.01" value="${price}" required></td>
                <td>
                    <form method="POST" class="edit-menu" style="display:inline;">
                        <input type="hidden" name="id" value="${id}">
                        <input type="hidden" name="update_menu" value="1">
                        <input type="hidden" name="category" id="cat-${id}">
                        <input type="hidden" name="item_name" id="name-${id}">
                        <input type="hidden" name="price" id="price-${id}">
                        <button type="submit" class="edit">Save</button>
                    </form>
                    <button class="cancel" onclick="cancelEdit(${id}, '${category}', '${name}', '${price}')">Cancel</button>
                </td>
            `;

            const form = row.querySelector('form');
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                document.getElementById('cat-' + id).value = row.querySelector('input[name=category]').value;
                document.getElementById('name-' + id).value = row.querySelector('input[name=item_name]').value;
                document.getElementById('price-' + id).value = row.querySelector('input[name=price]').value;
                form.submit();
            });
        }

        function cancelEdit(id, category, name, price) {
            const row = document.getElementById('row-' + id);
            row.innerHTML = `
                <td>${id}</td>
                <td class="cat">${category}</td>
                <td class="name">${name}</td>
                <td class="price">₱${parseFloat(price).toFixed(2)}</td>
                <td class="actions">
                    <button class="edit" onclick="editItem(${id})">Edit</button>
                    <a href="?delete=${id}" onclick="return confirm('Delete this item?')">
                        <button type="button" class="delete">Delete</button>
                    </a>
                </td>
            `;
        }
    </script>
</body>
</html>
