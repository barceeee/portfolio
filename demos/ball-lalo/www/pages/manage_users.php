<?php
include '../config/db.php';
session_start();

if (!isset($_SESSION['active_user_id']) || !isset($_SESSION['users'][$_SESSION['active_user_id']])) {
    echo "<script>
            alert('Please log in first.');
            window.location.href = '../index.php';
          </script>";
    exit;
}

$currentUser = $_SESSION['users'][$_SESSION['active_user_id']];

if ($currentUser['role'] !== 'admin') {
    echo "<script>
            alert('Access Denied. Only admins can access this page.');
            window.location.href = '../pages/dashboard.php';
          </script>";
    exit;
}

$pageTitle = "Manage Users";
$sql = "SELECT COUNT(*) AS total FROM users";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$userCount = $row['total'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Users - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/sidebar.css">
    <link rel="stylesheet" href="../assets/css/manage_users.css">
    <link rel="stylesheet" href="../assets/css/dashboard.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); justify-content: center; align-items: center; }
        .modal form { background: white; padding: 20px; border-radius: 10px; width: 350px; }
        .modal h3 { margin-top: 0; }
    </style>
</head>
<body>
<?php include '../includes/sidebar.php'; ?>
<div class="main">
    <?php include '../includes/header.php'; ?>
    <div class="content">
        <h2>
            Users (<?= htmlspecialchars($userCount); ?>)
            <div>
                <button class="btn btn-export" id="exportBtn">Export</button>
                <button class="btn btn-create" id="createBtn">+ Create New</button>
            </div>
        </h2>

        <input type="text" id="searchBox" placeholder="Search users...">

        <table id="usersTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    <th>Last Logged In</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>

<!-- Create User Modal -->
<div id="createModal" class="modal">
    <form id="createForm">
        <h3>Create User</h3>
        <label>Username:</label>
        <input type="text" name="username" required><br><br>
        <label>Email:</label>
        <input type="email" name="email" required><br><br>
        <label>Password:</label>
        <input type="password" name="password" required><br><br>
        <label>Role:</label>
        <select name="role">
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="cashier">Cashier</option>
        </select><br><br>
        <button type="submit" class="btn btn-create">Create</button>
        <button type="button" class="btn btn-delete closeModal">Cancel</button>
    </form>
</div>

<!-- Edit User Modal -->
<div id="editModal" class="modal">
    <form id="editForm">
        <h3>Edit User</h3>
        <input type="hidden" name="id" id="editId">
        <label>Username:</label>
        <input type="text" name="username" id="editUsername" required><br><br>
        <label>Email:</label>
        <input type="email" name="email" id="editEmail" required><br><br>
        <label>Role:</label>
        <select name="role" id="editRole">
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="cashier">Cashier</option>
        </select><br><br>
        <button type="submit" class="btn btn-edit">Update</button>
        <button type="button" class="btn btn-delete closeModal">Cancel</button>
    </form>
</div>

<script>
$(document).ready(function () {
    function loadUsers() {
        $.get("fetch_users.php", function (users) {
            let tbody = $("#usersTable tbody");
            tbody.empty();
            users.forEach(user => {
                tbody.append(`
                    <tr data-id="${user.id}">
                        <td>${user.id}</td>
                        <td class="username">${escapeHtml(user.username)}</td>
                        <td class="email">${escapeHtml(user.email)}</td>
                        <td class="role">${escapeHtml(user.role)}</td>
                        <td>${user.created_at ? escapeHtml(user.created_at) : ''}</td>
                        <td>${user.last_logged_in ? escapeHtml(user.last_logged_in) : ''}</td>
                        <td>
                            <button class="btn btn-edit editBtn">Edit</button>
                            <button class="btn btn-delete deleteBtn">Delete</button>
                        </td>
                    </tr>
                `);
            });
            attachRowEvents();
        }, "json").fail(function() {
            alert("Failed to fetch users. Please check fetch_users.php.");
        });
    }

    function attachRowEvents() {
        $(".editBtn").off("click").on("click", function () {
            let row = $(this).closest("tr");
            $("#editId").val(row.data("id"));
            $("#editUsername").val(row.find(".username").text());
            $("#editEmail").val(row.find(".email").text());
            $("#editRole").val(row.find(".role").text());
            $("#editModal").fadeIn();
        });

        $(".deleteBtn").off("click").on("click", function () {
            if (!confirm("Are you sure you want to delete this user?")) return;
            let id = $(this).closest("tr").data("id");
            $.post("delete_user.php", {id: id}, function (response) {
                if (response.success) {
                    alert(response.message);
                    $("tr[data-id='" + id + "']").remove();
                } else {
                    alert("Error: " + response.message);
                }
            }, "json");
        });
    }

    $(".closeModal").click(function() {
        $(this).closest(".modal").fadeOut();
    });

    $("#searchBox").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#usersTable tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#exportBtn").click(function () {
        let csv = [];
        $("#usersTable tr").each(function () {
            let row = [];
            $(this).find("th, td").each(function () { row.push($(this).text().trim()); });
            csv.push(row.join(","));
        });
        let csvString = csv.join("\n");
        let a = document.createElement("a");
        a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
        a.download = "users.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    $("#createBtn").click(() => $("#createModal").fadeIn());

    $("#createForm").submit(function (e) {
        e.preventDefault();
        $.post("create_user.php", $(this).serialize(), function (response) {
            if (response.success) {
                alert(response.message);
                $("#createModal").fadeOut();
                loadUsers();
            } else {
                alert("Error: " + response.message);
            }
        }, "json");
    });

    $("#editForm").submit(function (e) {
        e.preventDefault();
        $.post("update_user.php", $(this).serialize(), function (response) {
            if (response.success) {
                alert(response.message);
                $("#editModal").fadeOut();
                loadUsers();
            } else {
                alert("Error: " + response.message);
            }
        }, "json");
    });

    function escapeHtml(text) {
        return $("<div>").text(text).html();
    }

    setInterval(loadUsers, 5000);
    loadUsers();
});
</script>
</body>
</html>
