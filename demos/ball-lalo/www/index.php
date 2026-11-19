<?php
session_start();
include './config/db.php';

$error = '';
$success = '';
$redirectUrl = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $identifier = trim($_POST['identifier']);
    $password   = trim($_POST['password']);

    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1");
    $stmt->bind_param("ss", $identifier, $identifier);
    $stmt->execute();
    $result = $stmt->get_result();
    $user   = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        // Removed the undefined $update lines

        $_SESSION['active_user_id'] = $user['id'];
        $_SESSION['users'][$user['id']] = [
            'id'       => $user['id'],
            'username' => $user['username'],
            'role'     => $user['role'],
            'email'    => $user['email']
        ];

        $success = "Login successful! Redirecting...";

        if ($user['role'] === 'admin') {
            $redirectUrl = "./pages/dashboard.php";
        } elseif (strtolower($user['role']) === 'customer') {
            $redirectUrl = "./customer_pages/customer_dashboard.php";
        } else {
            $redirectUrl = "./pages/orders.php";
        }

    } else {
        $error = "Invalid username/email or password.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - Time-Out</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="./assets/css/loader.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <style>
        #card, .logo { display: none; }
        .popup {
            position: fixed;
            top: 0; left: 0;
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
        .popup.error   { background: #dc3545; color: white; }
        .popup.success { background: #28a745; color: white; }
    </style>
</head>
<body><div style="position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;background:#111;color:#fff;font:14px/1.4 system-ui,sans-serif;padding:10px 16px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.35);text-align:center"><b>Demo logins</b> &middot; admin / staff / customer &middot; password <b>demo1234</b></div>

<?php if (!empty($error)): ?>
    <div id="errorPopup" class="popup error"><?= htmlspecialchars($error) ?></div>
    <script>
        let errorPopup = document.getElementById("errorPopup");
        errorPopup.classList.add("show");
        setTimeout(() => errorPopup.classList.remove("show"), 2000);
    </script>
<?php endif; ?>

<?php if (!empty($success)): ?>
    <div id="successPopup" class="popup success"><?= htmlspecialchars($success) ?></div>
    <script>
        let successPopup = document.getElementById("successPopup");
        successPopup.classList.add("show");
        setTimeout(() => {
            successPopup.classList.remove("show");
            window.location.href = "<?= $redirectUrl ?>";
        }, 2000);
    </script>
<?php endif; ?>

<div class="text-center loader-container" id="loader-container">
    <div class="loader" id="loader"></div>
</div>

<div class="container">
    <div class="card" id="card">
        <h2>LOG IN</h2>
        <p>Welcome to Time-Out Ball-Lalo</p>

        <form method="POST" action="index.php" autocomplete="off">
            <input type="text" name="identifier" placeholder="Username or Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Log In</button>
        </form>

        <p class="text-link">Don't have an account? <a href="./pages/signup.php">Sign Up Now</a></p>
    </div>

    <img src="./assets/images/timeoutlogo.png" alt="Time-Out Logo" class="logo">
</div>

<script>
    $(window).on('load', function () {
        <?php if (empty($error)): ?>
            setTimeout(removeLoader, 1200);
        <?php else: ?>
            $("#loader-container").hide();
            $("#card, .logo").show();
        <?php endif; ?>
    });

    function removeLoader() {
        $("#loader-container").fadeOut(1000, function () {
            $("#card, .logo").fadeIn(800);
        });
    }
</script>
</body>
</html>
