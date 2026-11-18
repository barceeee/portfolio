<?php 
include '../config/db.php'; 
session_start();

$success = $error = "";
$username = $email = "";
$role = "cashier"; // default

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $email    = trim($_POST['email']);
    $password = trim($_POST['password']);
    $role     = isset($_POST['role']) && in_array($_POST['role'], ['staff','cashier']) ? $_POST['role'] : 'cashier';

    // Check if username already exists
    $checkUser = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $checkUser->bind_param("s", $username);
    $checkUser->execute();
    $checkUser->store_result();

    // Check if email already exists
    $checkEmail = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $checkEmail->store_result();

    if ($checkUser->num_rows > 0) {
        $error = "Username already exists.";
        $username = $email = ""; 
    } elseif ($checkEmail->num_rows > 0) {
        $error = "Email already exists.";
        $username = $email = "";
    } else {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);

        if ($stmt->execute()) {
            $success = "Signup successful! Redirecting to login...";
            $_SESSION['signup_success'] = "Account created! Please log in.";
            header("Refresh: 2; url=../index.php"); 
            exit;
        } else {
            $error = "Error: " . $stmt->error;
        }
        $stmt->close();
    }

    $checkUser->close();
    $checkEmail->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Signup - Time-Out</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
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
        .popup.show { opacity: 1; transform: translateY(0); }
        .popup.success { background: #28a745; color: white; }
        .popup.error { background: #dc3545; color: white; }
    </style>
</head>
<body>

<?php if (!empty($success)): ?>
    <div id="successPopup" class="popup success"><?= htmlspecialchars($success) ?></div>
    <script>
        let successPopup = document.getElementById("successPopup");
        successPopup.classList.add("show");
        setTimeout(() => successPopup.classList.remove("show"), 2000);
    </script>
<?php endif; ?>

<?php if (!empty($error)): ?>
    <div id="errorPopup" class="popup error"><?= htmlspecialchars($error) ?></div>
    <script>
        let errorPopup = document.getElementById("errorPopup");
        errorPopup.classList.add("show");
        setTimeout(() => errorPopup.classList.remove("show"), 2000);
    </script>
<?php endif; ?>

<div class="container">
    <img src="../assets/images/timeoutlogo.png" alt="Time-Out Logo" class="logo">

    <div class="card">
        <h2>SIGN UP</h2>
        <p>Create your account</p>

        <form method="POST" autocomplete="off">
            <input type="text" name="username" placeholder="Username" required value="<?= htmlspecialchars($username) ?>">
            <input type="email" name="email" placeholder="Email" required value="<?= htmlspecialchars($email) ?>">
            <input type="password" name="password" placeholder="Password" required autocomplete="new-password">

            <label for="role">Select Role:</label>
            <select name="role" id="role" required>
                <option value="cashier" <?= $role=='cashier' ? 'selected' : '' ?>>Cashier</option>
                <option value="staff" <?= $role=='staff' ? 'selected' : '' ?>>Staff</option>
            </select>

            <button type="submit">Register</button>
        </form>

        <p class="text-link">Already have an account? <a href="../index.php">Log In</a></p>
    </div>
</div>
</body>
</html>
