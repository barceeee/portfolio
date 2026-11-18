<?php
/**
 * Portfolio demo only: a small mysqli look-alike backed by SQLite, so the original
 * Ball-Lalo pages run unchanged inside the browser (PHP compiled to WebAssembly).
 * Covers what the app uses: query, prepare/bind_param/execute/get_result/store_result,
 * fetch_assoc/fetch_all, num_rows, insert_id, affected_rows, error, real_escape_string,
 * plus MySQL's NOW()/CURDATE()/DAY()/MONTH()/YEAR()/CONCAT() and SHOW COLUMNS.
 */

if (!defined('MYSQLI_ASSOC')) define('MYSQLI_ASSOC', 1);
if (!defined('MYSQLI_NUM'))   define('MYSQLI_NUM', 2);
if (!defined('MYSQLI_BOTH'))  define('MYSQLI_BOTH', 3);

class DemoResult
{
    public $num_rows = 0;
    public $field_count = 0;
    private $rows;
    private $i = 0;

    public function __construct(array $rows)
    {
        $this->rows = $rows;
        $this->num_rows = count($rows);
        $this->field_count = $rows ? count($rows[0]) : 0;
    }
    public function fetch_assoc() { return $this->i < $this->num_rows ? $this->rows[$this->i++] : null; }
    public function fetch_array($mode = MYSQLI_BOTH)
    {
        $r = $this->fetch_assoc();
        if ($r === null || $mode === MYSQLI_ASSOC) return $r;
        $n = array_values($r);
        return $mode === MYSQLI_NUM ? $n : $r + $n;
    }
    public function fetch_row()    { $r = $this->fetch_assoc(); return $r === null ? null : array_values($r); }
    public function fetch_object() { $r = $this->fetch_assoc(); return $r === null ? null : (object) $r; }
    public function fetch_all($mode = MYSQLI_NUM)
    {
        $out = [];
        while (($r = $this->fetch_array($mode)) !== null) $out[] = $r;
        return $out;
    }
    public function data_seek($n) { $this->i = (int) $n; return true; }
    public function free() {}
    public function free_result() {}
    public function close() {}
}

class DemoStmt
{
    public $error = '';
    public $errno = 0;
    public $num_rows = 0;
    public $affected_rows = 0;
    public $insert_id = 0;
    private $conn;
    private $sql;
    private $types = '';
    private $vars = [];
    private $rows = null;

    public function __construct(DemoMysqli $conn, string $sql) { $this->conn = $conn; $this->sql = $sql; }

    public function bind_param($types, &...$vars) { $this->types = $types; $this->vars = &$vars; return true; }

    public function execute($params = null)
    {
        $db = $this->conn->sqlite();
        $stmt = @$db->prepare($this->sql);
        if (!$stmt) return $this->fail($db);
        $values = $params !== null ? array_values($params) : $this->vars;
        foreach ($values as $k => $v) {
            $t = $this->types[$k] ?? 's';
            $type = $v === null ? SQLITE3_NULL : ($t === 'i' ? SQLITE3_INTEGER : ($t === 'd' ? SQLITE3_FLOAT : ($t === 'b' ? SQLITE3_BLOB : SQLITE3_TEXT)));
            $stmt->bindValue($k + 1, $v, $type);
        }
        $res = @$stmt->execute();
        if ($res === false) return $this->fail($db);
        $this->rows = [];
        if ($res->numColumns() > 0) {
            while (($r = $res->fetchArray(SQLITE3_ASSOC)) !== false) $this->rows[] = $r;
        }
        $this->num_rows = count($this->rows);
        $this->affected_rows = $db->changes();
        $this->insert_id = $db->lastInsertRowID();
        $this->conn->insert_id = $this->insert_id;
        $this->conn->affected_rows = $this->affected_rows;
        return true;
    }
    public function get_result()   { return new DemoResult($this->rows ?? []); }
    public function store_result() { return true; }
    public function free_result()  {}
    public function close()        { return true; }

    private function fail(SQLite3 $db)
    {
        $this->error = $db->lastErrorMsg();
        $this->errno = $db->lastErrorCode();
        $this->conn->error = $this->error;
        return false;
    }
}

class DemoMysqli
{
    public $connect_error = null;
    public $connect_errno = 0;
    public $error = '';
    public $errno = 0;
    public $insert_id = 0;
    public $affected_rows = 0;
    private $db;

    public function __construct(string $path)
    {
        $this->db = new SQLite3($path);
        $this->db->busyTimeout(3000);
        $this->db->exec('PRAGMA foreign_keys = ON');
        // MySQL functions the app's SQL relies on.
        $this->db->createFunction('NOW', fn() => date('Y-m-d H:i:s'), 0);
        $this->db->createFunction('CURDATE', fn() => date('Y-m-d'), 0);
        $this->db->createFunction('CURTIME', fn() => date('H:i:s'), 0);
        $this->db->createFunction('DAY', fn($d) => $d === null ? null : (int) date('j', strtotime($d)), 1);
        $this->db->createFunction('MONTH', fn($d) => $d === null ? null : (int) date('n', strtotime($d)), 1);
        $this->db->createFunction('YEAR', fn($d) => $d === null ? null : (int) date('Y', strtotime($d)), 1);
        $this->db->createFunction('CONCAT', fn(...$a) => in_array(null, $a, true) ? null : implode('', $a), -1);
    }

    public function sqlite() { return $this->db; }

    public function query($sql)
    {
        // MySQL's SHOW COLUMNS FROM t  ->  rows with a 'Field' key, like MySQL returns.
        if (preg_match('/^\s*SHOW\s+COLUMNS\s+FROM\s+`?(\w+)`?/i', $sql, $m)) {
            $rows = [];
            $res = $this->db->query('PRAGMA table_xinfo(' . $m[1] . ')');
            while ($res && ($c = $res->fetchArray(SQLITE3_ASSOC)) !== false) {
                $rows[] = ['Field' => $c['name'], 'Type' => $c['type'], 'Null' => $c['notnull'] ? 'NO' : 'YES',
                           'Key' => $c['pk'] ? 'PRI' : '', 'Default' => $c['dflt_value'], 'Extra' => ''];
            }
            return new DemoResult($rows);
        }
        $res = @$this->db->query($sql);
        if ($res === false) {
            $this->error = $this->db->lastErrorMsg();
            $this->errno = $this->db->lastErrorCode();
            return false;
        }
        $this->insert_id = $this->db->lastInsertRowID();
        $this->affected_rows = $this->db->changes();
        if ($res->numColumns() === 0) return true;
        $rows = [];
        while (($r = $res->fetchArray(SQLITE3_ASSOC)) !== false) $rows[] = $r;
        return new DemoResult($rows);
    }

    public function prepare($sql)
    {
        $check = @$this->db->prepare($sql);
        if (!$check) { $this->error = $this->db->lastErrorMsg(); return false; }
        $check->close();
        return new DemoStmt($this, $sql);
    }

    public function real_escape_string($s) { return SQLite3::escapeString((string) $s); }
    public function escape_string($s)      { return $this->real_escape_string($s); }
    public function set_charset($c)        { return true; }
    public function begin_transaction()    { return $this->db->exec('BEGIN'); }
    public function commit()               { return $this->db->exec('COMMIT'); }
    public function rollback()             { return $this->db->exec('ROLLBACK'); }
    public function autocommit($on)        { return true; }
    public function close()                { return true; }
}

/**
 * Opens the demo database. The first visit copies the seed database, moves the sample
 * orders and reservations so they sit around today's date, and sets the demo passwords.
 */
function demo_db(): DemoMysqli
{
    date_default_timezone_set('Asia/Manila');
    $dir = is_dir('/persist') && is_writable('/persist') ? '/persist/ballalo-demo' : sys_get_temp_dir() . '/ballalo-demo';
    if (!is_dir($dir)) @mkdir($dir, 0777, true);
    $path = $dir . '/restaurant.sqlite';
    $fresh = !file_exists($path);
    if ($fresh) copy(__DIR__ . '/seed.sqlite', $path);

    $conn = new DemoMysqli($path);
    if ($fresh) {
        $db = $conn->sqlite();
        $anchor = $db->querySingle("SELECT value FROM demo_meta WHERE key = 'anchor_date'");
        $shift = (int) round((strtotime(date('Y-m-d')) - strtotime($anchor)) / 86400);
        if ($shift !== 0) {
            $s = ($shift > 0 ? '+' : '') . $shift . ' days';
            $db->exec("UPDATE orders SET order_date = datetime(order_date, '$s')");
            $db->exec("UPDATE reservations SET reservation_date = date(reservation_date, '$s'), created_at = datetime(created_at, '$s')");
        }
        $hash = password_hash('demo1234', PASSWORD_DEFAULT);
        $st = $db->prepare("UPDATE users SET password = :h WHERE password = '__DEMO__'");
        $st->bindValue(':h', $hash, SQLITE3_TEXT);
        $st->execute();
    }
    return $conn;
}
