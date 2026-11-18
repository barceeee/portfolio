<?php
// Resets the demo: deletes this browser's copy of the database and logs out.
session_start();
$_SESSION = [];
session_destroy();
foreach (['/persist/ballalo-demo', sys_get_temp_dir() . '/ballalo-demo'] as $dir) {
    @unlink($dir . '/restaurant.sqlite');
}
header('Location: ../index.php');
