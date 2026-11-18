<?php 
session_start();
if (!isset($_SESSION['active_user_id']) || !isset($_SESSION['users'][$_SESSION['active_user_id']])) {
    header("Location: ../index.php");
    exit;
}

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$pageTitle  = "Reservation Form";
$username   = $activeUser['username'];
$role       = $activeUser['role'];
$userId     = $activeUser['id'];

$popup = '';
if (isset($_SESSION['popup'])) {
    $popup = $_SESSION['popup'];
    unset($_SESSION['popup']);
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
        .popup.error   { background: #dc3545; color: white; }
        .popup.success { background: #28a745; color: white; }

        /* --- Reservation Form Styling --- */
        .reservation-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80vh;
        }
        .reservation-box {
            border: none;
            border-radius: 20px;
            padding: 40px;
            width: 700px;
            background: #fff;
            box-shadow: 0px 6px 20px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
        }
        .reservation-box:hover {
            transform: translateY(-5px);
            box-shadow: 0px 10px 25px rgba(0,0,0,0.2);
        }
        .reservation-box h2 {
            text-align: center;
            margin-bottom: 25px;
            font-size: 28px;
            font-weight: bold;
            color: #333;
        }
        .reservation-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px 30px; 
        }
        .reservation-grid input,
        .reservation-grid select {
            padding: 18px 20px; 
            border: 1px solid #ccc;
            border-radius: 12px;
            width: 100%;
            height: 55px; 
            font-size: 16px;
            outline: none;
            box-sizing: border-box;
            transition: border 0.2s ease, box-shadow 0.2s ease;
        }
        .reservation-grid input:focus,
        .reservation-grid select:focus {
            border-color: #d1b464;
            box-shadow: 0 0 8px rgba(209, 180, 100, 0.5);
        }
        .reserve-btn {
            margin-top: 30px;
            display: block;
            width: 100%;
            background: linear-gradient(90deg, #ff7e5f, #feb47b);
            color: #fff;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.2s ease;
        }
        .reserve-btn:hover {
            background: linear-gradient(90deg, #feb47b, #ff7e5f);
            transform: scale(1.03);
        }

        /* Disabled table options styling */
        select[name="table_no"] option:disabled {
            color: #888;
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <?php include '../includes/sidebar.php'; ?>
    <div class="main">
        <?php include '../includes/header.php'; ?>

        <!-- Popup Notification -->
        <?php if (!empty($popup)): ?>
            <div id="popupMessage" class="popup <?= $popup['type'] ?>">
                <?= htmlspecialchars($popup['message']) ?>
            </div>
            <script>
                let popup = document.getElementById("popupMessage");
                popup.classList.add("show");
                setTimeout(() => popup.classList.remove("show"), 2500);
            </script>
        <?php endif; ?>

        <div class="content">
            <div class="reservation-wrapper">
                <div class="reservation-box">
                    <h2>Reservation Form</h2>

                    <form action="process_reservation.php" method="POST">
                        <div class="reservation-grid">
                            <input type="text" name="name" placeholder="Name" required>
                            <input type="text" name="phone" placeholder="Phone no." required>
                            <input type="date" name="reservation_date" required>

                            <div style="display: flex; gap: 10px;">
                                <input type="time" name="reservation_time" placeholder="Start Time" required style="flex: 1;">
                                <input type="time" name="reservation_end_time" placeholder="End Time" required style="flex: 1;">
                            </div>

                            <select name="persons" required>
                                <option value="">Person</option>
                                <option value="1">1 Person</option>
                                <option value="2">2 Persons</option>
                                <option value="3">3 Persons</option>
                                <option value="4">4 Persons</option>
                                <option value="5+">5+ Persons</option>
                            </select>

                            <select name="table_no" required>
                                <option value="">Select Table</option>
                                <option value="Table 1">Table 1</option>
                                <option value="Table 2">Table 2</option>
                                <option value="Table 3">Table 3</option>
                                <option value="Table 4">Table 4</option>
                            </select>
                        </div>

                        <input type="hidden" name="user_id" value="<?= $userId ?>">
                        <button type="submit" class="reserve-btn">Reserve</button>
                    </form>

                    <!-- Validate End Time -->
                    <script>
                    const startInput = document.querySelector("input[name='reservation_time']");
                    const endInput = document.querySelector("input[name='reservation_end_time']");

                    endInput.addEventListener("change", () => {
                        if (startInput.value && endInput.value && endInput.value <= startInput.value) {
                            alert("⚠️ End time must be later than start time.");
                            endInput.value = "";
                        }
                    });
                    </script>

                    <!-- Disable reserved tables dynamically -->
                    <script>
                    document.addEventListener("DOMContentLoaded", function() {
                        const dateInput = document.querySelector('input[name="reservation_date"]');
                        const startTimeInput = document.querySelector('input[name="reservation_time"]');
                        const endTimeInput = document.querySelector('input[name="reservation_end_time"]');
                        const tableSelect = document.querySelector('select[name="table_no"]');
                        let unavailableSlots = [];

                        function disableReservedTables() {
                            if (!dateInput.value || !startTimeInput.value || !endTimeInput.value) return;

                            const selectedStart = startTimeInput.value;
                            const selectedEnd = endTimeInput.value;

                            for (const option of tableSelect.options) {
                                if (!option.value) continue;
                                const table = option.value;
                                const conflict = unavailableSlots.find(slot =>
                                    slot.table_no === table &&
                                    !(selectedEnd <= slot.start || selectedStart >= slot.end)
                                );

                                if (conflict) {
                                    option.disabled = true;
                                    option.textContent = `${table} (Reserved)`;
                                } else {
                                    option.disabled = false;
                                    option.textContent = table;
                                }
                            }
                        }

                        async function fetchUnavailable() {
                            if (!dateInput.value) return;
                            const response = await fetch(`get_unavailable_slots.php?date=${dateInput.value}`);
                            unavailableSlots = await response.json();
                            disableReservedTables();
                        }

                        dateInput.addEventListener("change", fetchUnavailable);
                        startTimeInput.addEventListener("change", disableReservedTables);
                        endTimeInput.addEventListener("change", disableReservedTables);
                    });
                    </script>

                </div>
            </div>
        </div>
    </div>
</body>
</html>
