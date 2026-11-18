<?php
// Warm-up endpoint for the demo launcher: starts PHP and creates the demo database.
require_once __DIR__ . '/db_sqlite.php';
demo_db();
header('Content-Type: text/plain');
echo 'ok';
