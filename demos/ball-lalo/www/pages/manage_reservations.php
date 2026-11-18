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

$activeUser = $_SESSION['users'][$_SESSION['active_user_id']];
$pageTitle  = "Manage Reservations";
$username   = $activeUser['username'];
$role       = $activeUser['role'];
$userId     = $activeUser['id'];

date_default_timezone_set('Asia/Manila');
$currentDateTime = date('Y-m-d H:i:s');

// ✅ Auto-update approved → finished if time has passed
$autoUpdateSQL = "
    UPDATE reservations 
    SET status = 'finished'
    WHERE status = 'approved'
      AND CONCAT(reservation_date, ' ', reservation_time) < '$currentDateTime'
";
$conn->query($autoUpdateSQL);

$reservations = [];
$sql = "
    SELECT id, name, reservation_date, reservation_time, persons, status
    FROM reservations
    ORDER BY reservation_date, reservation_time
";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    $timeFormatted = date("g:i A", strtotime($row['reservation_time']));
    $reservations[] = [
        'id'       => (string)$row['id'],
        'title'    => $timeFormatted,
        'start'    => "{$row['reservation_date']}T{$row['reservation_time']}",
        'status'   => strtolower($row['status']),
        'name'     => $row['name'],
        'persons'  => $row['persons']
    ];
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
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>

    <style>
        #calendar {
            max-width: 1100px;
            margin: 30px auto;
            background: #fff;
            padding: 25px;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        }
        .fc-event {
            cursor: pointer;
            border-radius: 6px !important;
            padding: 4px 6px !important;
            font-size: 13px !important;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .fc-event.approved {
            background: linear-gradient(135deg, #28a745, #34d058) !important;
            color: #fff !important;
        }
        .fc-event.finished {
            background: linear-gradient(135deg, #6c757d, #adb5bd) !important;
            color: #fff !important;
            text-decoration: line-through;
        }
        .fc-daygrid-day-events { max-height: 80px; overflow-y: auto; scrollbar-width: thin; }
        .fc-daygrid-day-events::-webkit-scrollbar { width: 5px; }
        .fc-daygrid-day-events::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
        .fc-time-only { font-size: 13px; font-weight: 600; color: #fff; text-align: center; }
        .modal { display: none; position: fixed; z-index: 9999; inset: 0; background: rgba(0,0,0,0.55); justify-content: center; align-items: center; animation: fadeIn 0.25s ease; }
        .modal-content { background: #fff; padding: 22px; border-radius: 12px; width: 460px; max-width: 95%; box-shadow: 0 10px 30px rgba(0,0,0,0.25); animation: slideUp 0.25s ease; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; margin-bottom: 12px; padding-bottom: 8px; }
        .close-btn { cursor: pointer; font-size: 20px; color: #666; padding: 6px; border-radius: 6px; transition: background 0.15s, color 0.15s; }
        .close-btn:hover { background: rgba(0,0,0,0.05); color: #000; }
        .btn-finish { background: #28a745; color: #fff; padding: 8px 14px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s ease; }
        .btn-finish:hover { background: #218838; }
    </style>
</head>
<body>
<?php include '../includes/sidebar.php'; ?>
<div class="main">
    <?php include '../includes/header.php'; ?>

    <div class="content">
        <h2><i class="fa-solid fa-calendar-check"></i> Reservation Calendar</h2>
        <p>Click a time slot to view reservation details.</p>
        <div id="calendar"></div>
    </div>
</div>

<!-- Modal -->
<div id="reservationModal" class="modal" aria-hidden="true">
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
            <h3 id="modalTitle"><i class="fa-solid fa-calendar-check"></i> Reservation Details</h3>
            <span class="close-btn" id="modalClose" title="Close">&times;</span>
        </div>
        <div id="reservationDetails"><p>Loading…</p></div>
        <div class="modal-footer" id="modalFooter" style="display: none;">
            <button type="button" class="btn-finish" id="modalFinish">
                <i class="fa-solid fa-flag-checkered"></i> Mark as Finished
            </button>
        </div>
    </div>
</div>

<script>
(function () {
    let currentReservationId = null;
    const modal = document.getElementById('reservationModal');
    const details = document.getElementById('reservationDetails');
    const closeBtn = document.getElementById('modalClose');
    const modalFooter = document.getElementById('modalFooter');
    const finishBtn = document.getElementById('modalFinish');
    let calendar;

    function openModal() {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        currentReservationId = null;
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    // ✅ Handle marking reservation as finished
    finishBtn.addEventListener('click', () => {
        if (!currentReservationId) return;
        if (!confirm("Are you sure you want to mark this reservation as finished?")) return;

        fetch('mark_finished.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: currentReservationId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('✅ Reservation marked as finished!');

                // 🔄 Instantly update on calendar
                const event = calendar.getEventById(currentReservationId);
                if (event) {
                    event.setExtendedProp('status', 'finished');
                    event.setProp('classNames', ['finished']);
                    event.setProp('title', 'Finished');
                }

                modalFooter.style.display = 'none';
                closeModal();
            } else {
                alert('❌ Failed to mark as finished.');
            }
        })
        .catch(err => {
            alert('❌ Error marking reservation as finished.');
            console.error(err);
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            buttonText: { today: 'Today' },
            events: <?= json_encode($reservations) ?>,
            eventClassNames: arg => [arg.event.extendedProps.status],

            eventContent: function(arg) {
                const status = arg.event.extendedProps.status;
                const time = arg.event.start ? new Date(arg.event.start).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) : '';
                if (status === 'finished') {
                    return { html: `<div class="fc-time-only" style="text-decoration: line-through;">${time} (Finished)</div>` };
                }
                return { html: `<div class="fc-time-only">${time}</div>` };
            },

            eventClick: info => {
                currentReservationId = info.event.id;
                fetch(`view_reservation.php?id=${encodeURIComponent(currentReservationId)}`)
                    .then(res => res.text())
                    .then(html => {
                        details.innerHTML = html;
                        const statusText = info.event.extendedProps.status.toLowerCase();
                        modalFooter.style.display = (statusText === 'finished') ? 'none' : 'flex';
                        openModal();
                    })
                    .catch(err => {
                        details.innerHTML = '<p>Error loading details.</p>';
                        modalFooter.style.display = 'none';
                        openModal();
                    });
            },

            height: 'auto',
            dayMaxEventRows: false
        });
        calendar.render();

        // Auto refresh every 5 minutes
        setInterval(() => {
            fetch('auto_update_reservations.php')
                .then(() => calendar.refetchEvents())
                .catch(err => console.error('Auto-update error:', err));
        }, 300000); 
    });
})();
</script>
</body>
</html>
