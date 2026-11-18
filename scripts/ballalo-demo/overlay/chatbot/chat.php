<?php
/**
 * Portfolio demo: the live system sends the message to OpenAI's GPT-4o-mini with a
 * restaurant-assistant prompt (see prompt.txt). This demo runs offline and gives sample
 * replies instead, so no API key is needed and nothing is sent anywhere.
 */
session_start();
header('Content-Type: application/json');

$message = strtolower(trim($_POST['message'] ?? ''));
if ($message === '') {
    echo json_encode(['reply' => 'Please type a message.']);
    exit;
}

$replies = [
    '/reserv|book|table|seat/' => "You can book a table from the Reservations page: choose a date and time, the number of guests and an available table. Our staff will confirm your reservation.",
    '/cancel|change|resched/'  => "To change or cancel a reservation, please contact our staff and we'll update it for you.",
    '/menu|food|dish|eat|order|recommend/' => "You can browse our full menu when placing an order. Our staff will be happy to recommend a favourite!",
    '/pay|bill|price|cost|cash|card/' => "Your bill is prepared at the counter after your meal. Our staff can help with any payment questions.",
    '/hour|open|close|when/'   => "For today's opening hours, please check with our staff. They'll be glad to help.",
    '/hello|hi\b|hey|good (morning|afternoon|evening)/' => "Hello! Welcome to Time-Out. How can I help you today: reservations, our menu, or something else?",
    '/thank/'                  => "You're welcome! Enjoy your meal.",
];

$reply = "I can help with reservations, our menu, payments and restaurant policies. (This is a demo; the live system answers with OpenAI's GPT-4o-mini.)";
foreach ($replies as $pattern => $text) {
    if (preg_match($pattern, $message)) { $reply = $text; break; }
}

echo json_encode(['reply' => $reply]);
