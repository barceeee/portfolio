<?php
session_start();
include '../config/db.php';

/* LOGOUT HANDLER */
if (isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header("Location: ../index.php");
    exit;
}

date_default_timezone_set('Asia/Manila');

/* =========================
   PLACEHOLDER RESERVATIONS
   (TEST MODE – NO DATABASE)
========================= */
$reservations = [
    [
        'id' => '1',
        'start' => date('Y-m-d') . 'T10:00:00',
        'status' => 'approved'
    ],
    [
        'id' => '2',
        'start' => date('Y-m-d') . 'T12:30:00',
        'status' => 'approved'
    ],
    [
        'id' => '3',
        'start' => date('Y-m-d', strtotime('+1 day')) . 'T15:00:00',
        'status' => 'finished'
    ],
    [
        'id' => '4',
        'start' => date('Y-m-d', strtotime('+2 days')) . 'T18:00:00',
        'status' => 'approved'
    ]
];
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Customer Dashboard</title>

<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>

<style>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
}
body { background: #fafafa; color: #111; }
.app { max-width: 1300px; margin: auto; padding: 24px; }

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.logo { width: 24px; height: 24px; background: #111; border-radius: 6px; }
.btn-outline {
    padding: 10px 16px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
}

/* Layout */
.content { display: grid; grid-template-columns: 3fr 1fr; gap: 24px; }

/* Cards */
.card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 16px;
    padding: 24px;
}
.card h2 { font-size: 18px; margin-bottom: 6px; }
.card p { font-size: 14px; color: #666; }

/* Calendar */
#calendar { margin-top: 16px; min-height: 650px; }
.fc { font-size: 14px; }
.fc-toolbar-title { font-size: 20px!important; font-weight: 700; }
.fc-button { padding: 8px 12px!important; font-size: 14px!important; }
.fc-event {
    cursor: pointer;
    border-radius: 8px!important;
    padding: 6px!important;
    font-weight: 600;
}
.fc-event.approved { background: #28a745!important; color: #fff!important; }
.fc-event.finished {
    background: #6c757d!important;
    color: #fff!important;
    text-decoration: line-through;
}
.fc-time-only {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    text-align: center;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.55);
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.modal-content {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    width: 480px;
    max-width: 92%;
}
.modal-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    margin-bottom: 12px;
}
.close-btn { cursor: pointer; font-size: 22px; }

/* Mobile */
@media (max-width: 900px) {
    .app { padding: 16px; }
    .content { grid-template-columns: 1fr; }
    #calendar { min-height: 500px; }
    .header { flex-direction: column; align-items: flex-start; }
    .header > div:last-child {
        width: 100%;
        display: flex;
        gap: 10px;
    }
    .btn-outline { flex: 1; }
}
</style>
</head>

<body>
<div class="app">

<header class="header">
    <div class="header-left">
        <div class="logo"></div>
        <h1>Customer Dashboard</h1>
    </div>
    <div>
        <button class="btn-outline" onclick="toggleChat()"> Customer Service </button>
        <form method="POST" style="display:inline">
            <button type="submit" name="logout" class="btn-outline">Logout</button>
        </form>
    </div>
</header>

<main class="content">
<section class="card">
    <h2>Reservation Calendar</h2>
    <p>Click a date to view reservation details</p>
    <div id="calendar"></div>
</section>
</main>

</div>

<!-- Modal -->
<div id="reservationModal" class="modal">
<div class="modal-content">
<div class="modal-header">
    <h3>Reservation Details</h3>
    <span class="close-btn" id="modalClose">&times;</span>
</div>
<div id="reservationDetails">
    <p><b>Test Reservation</b></p>
    <p>This is placeholder data.</p>
</div>
</div>
</div>

<script>
(function () {
    let currentId = null;

    const modal = document.getElementById('reservationModal');
    const closeBtn = document.getElementById('modalClose');

    function openModal() { modal.style.display = 'flex'; }
    function closeModal() { modal.style.display = 'none'; currentId = null; }

    closeBtn.onclick = closeModal;
    modal.onclick = e => { if (e.target === modal) closeModal(); };

    const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
            initialView: 'dayGridMonth',
            height: 'auto',
            events: <?= json_encode($reservations) ?>,
            eventClassNames: a => [a.event.extendedProps.status],
            eventContent: a => {
                const t = a.event.start
                    ? new Date(a.event.start).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                    })
                    : '';
                return { html: `<div class="fc-time-only">${t}</div>` };
            },
            eventClick: () => openModal()
        }
    );

    calendar.render();
})();
</script>

<!-- CHAT WIDGET (UNCHANGED) -->
<style>
#chat-widget{
 position:fixed;bottom:24px;right:24px;width:340px;
 background:#fff;border-radius:16px;
 box-shadow:0 20px 40px rgba(0,0,0,.15);
 display:none;flex-direction:column;
 overflow:hidden;z-index:9999;
 font-family:system-ui,-apple-system,sans-serif
}
#chat-header{
 background:#111;color:#fff;
 padding:14px 16px;font-weight:600;
 display:flex;justify-content:space-between;
 align-items:center
}
#chat-messages{
 padding:14px;height:320px;
 overflow:auto;font-size:14px
}
.msg{margin-bottom:10px;line-height:1.4}
.user{font-weight:600}
.bot{color:#333}
#chat-input{
 display:flex;border-top:1px solid #eee
}
#chat-input input{
 flex:1;padding:12px;border:0;
 font-size:14px;outline:none
}
#chat-input button{
 background:#111;color:#fff;
 border:0;padding:0 16px;
 cursor:pointer;font-weight:600
}
</style>

<div id="chat-widget">
  <div id="chat-header">
    Customer Service
    <span onclick="toggleChat()" style="cursor:pointer;font-size:18px">✕</span>
  </div>

  <div id="chat-messages">
    <div class="msg bot">👋 Welcome! How can I assist you today?</div>
  </div>

  <div id="chat-input">
    <input id="chatText" placeholder="Type your message..." onkeydown="if(event.key==='Enter')sendMsg()">
    <button onclick="sendMsg()">Send</button>
  </div>
</div>

<script>
function toggleChat(){
 const c=document.getElementById('chat-widget');
 c.style.display = c.style.display === 'flex' ? 'none' : 'flex';
}

function sendMsg(){
 const input=document.getElementById('chatText');
 const msg=input.value.trim();
 if(!msg) return;

 const box=document.getElementById('chat-messages');

 box.innerHTML += `<div class="msg user">You: ${msg}</div>`;
 input.value='';
 box.scrollTop = box.scrollHeight;

 fetch('../chatbot/chat.php',{
   method:'POST',
   headers:{'Content-Type':'application/x-www-form-urlencoded'},
   body:'message='+encodeURIComponent(msg)
 })
 .then(r=>r.json())
 .then(d=>{
   box.innerHTML += `<div class="msg bot">🤖 ${d.reply}</div>`;
   box.scrollTop = box.scrollHeight;
 })
 .catch(()=>{
   box.innerHTML += `<div class="msg bot">⚠️ Unable to connect. Please try again.</div>`;
 });
}
</script>

</body>
</html>
