<?php
include '../config/db.php';
$id = intval($_GET['id']);
$res = $conn->query("SELECT * FROM reservations WHERE id=$id")->fetch_assoc();

if (!$res) {
    echo "<p>Reservation not found.</p>";
    exit;
}
?>

<p><b>ID:</b> <?= htmlspecialchars($res['id']) ?></p>
<p><b>Name:</b> <?= htmlspecialchars($res['name']) ?></p>
<p><b>Phone:</b> <?= htmlspecialchars($res['phone']) ?></p>
<p><b>Date:</b> <?= htmlspecialchars($res['reservation_date']) ?></p>
<p><b>Time:</b> <?= date("g:i A", strtotime($res['reservation_time'])) ?></p>
<p><b>Persons:</b> <?= htmlspecialchars($res['persons']) ?></p>
<p><b>Table:</b> <?= htmlspecialchars($res['table_no']) ?></p>

<?php
$status = trim(strtolower($res['status'] ?? ''));
if ($status === '' || $status === 'null') $status = 'pending';
?>

<p><b>Status:</b>
<?php
switch ($status) {
    case 'finished':
        echo '<span class="badge bg-success">Finished</span>';
        break;
    case 'approved':
        echo '<span class="badge bg-primary">Approved</span>';
        break;
    case 'pending':
        echo '<span class="badge bg-warning text-dark">Pending</span>';
        break;
    case 'cancelled':
        echo '<span class="badge bg-danger">Cancelled</span>';
        break;
    default:
        echo '<span class="badge bg-secondary">Not Set</span>';
}
?>
</p>



<script>
const btn = document.getElementById('markFinishedBtn');
if (btn) {
  btn.addEventListener('click', () => {
    if (confirm('Mark this reservation as finished?')) {
      const url = 'mark_finished.php'; // same folder as this file
      console.log('Sending update to:', url);
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ id: <?= $res['id'] ?> })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Response:', data);
        if (data.success) {
          alert('Reservation marked as finished!');
          location.reload();
        } else {
          alert('Failed: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        alert('Error: ' + err);
      });
    }
  });
}
</script>
