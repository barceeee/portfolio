"""
Builds the in-browser Ball-Lalo demo into demos/ball-lalo/www.

    python scripts/ballalo-demo/build.py <path-to-ball-lalo-source>

- Copies the original PHP app (from the Drive copy), minus the MySQL dump and the
  OpenAI chatbot (which held an API key).
- Adds the overlay: a SQLite-backed mysqli stand-in, demo db.php and an offline chatbot.
- Builds demo/seed.sqlite: the real menu, sample orders/reservations, demo logins.
- Writes www-files.json, the list of files the service worker preloads into PHP.
"""
import json
import random
import re
import shutil
import sqlite3
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OVERLAY = Path(__file__).resolve().parent / "overlay"
OUT = ROOT / "demos" / "ball-lalo" / "www"
SKIP = {"sql/restaurant_db.sql", "chatbot/chat.php", "config/db.php"}

src = Path(sys.argv[1]).resolve()
assert (src / "index.php").exists(), f"{src} doesn't look like the Ball-Lalo source"

# ---------- 1. copy app + overlay ----------
def empty_dir(path: Path):
    """Remove a folder's contents but keep the folder (it may be open in a shell or editor)."""
    path.mkdir(parents=True, exist_ok=True)
    for child in path.iterdir():
        shutil.rmtree(child) if child.is_dir() else child.unlink()

empty_dir(OUT)
for f in src.rglob("*"):
    rel = f.relative_to(src).as_posix()
    if f.is_file() and rel not in SKIP and not rel.startswith("sql/"):
        (OUT / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, OUT / rel)
for f in OVERLAY.rglob("*"):
    if f.is_file():
        rel = f.relative_to(OVERLAY)
        (OUT / rel).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, OUT / rel)

# Visitors may skip the launcher (autostart), so the login page shows the demo logins itself.
login = OUT / "index.php"
hint = ('<div style="position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9999;'
        'background:#111;color:#fff;font:14px/1.4 system-ui,sans-serif;padding:10px 16px;border-radius:10px;'
        'box-shadow:0 6px 20px rgba(0,0,0,.35);text-align:center">'
        '<b>Demo logins</b> &middot; admin / staff / customer &middot; password <b>demo1234</b></div>')
html = login.read_text(encoding="utf-8")
assert "<body" in html
login.write_text(re.sub(r"(<body[^>]*>)", r"\1" + hint.replace("\\", "\\\\"), html, count=1), encoding="utf-8")

# The chatbot was called by absolute path; the demo lives in a sub-folder.
cd = OUT / "customer_pages" / "customer_dashboard.php"
if cd.exists():
    cd.write_text(cd.read_text(encoding="utf-8").replace("fetch('/chatbot/chat.php", "fetch('../chatbot/chat.php"), encoding="utf-8")

# ---------- 2. seed database ----------
dump = (src / "sql" / "restaurant_db.sql").read_text(encoding="utf-8", errors="replace")

def insert_rows(table):
    m = re.search(rf"INSERT INTO `{table}` \(([^)]*)\) VALUES\s*(.*?);\n", dump, re.S)
    cols = [c.strip(" `") for c in m.group(1).split(",")]
    rows = []
    for tup in re.findall(r"\((.*?)\)(?:,\s*\n|$)", m.group(2), re.S):
        vals = [v.strip() for v in re.findall(r"'(?:[^'\\]|\\.|'')*'|[^,]+", tup)]
        vals = [None if v.upper() == "NULL" else v[1:-1].replace("\\'", "'").replace("''", "'") if v.startswith("'") else float(v) if "." in v else int(v) for v in vals]
        rows.append(dict(zip(cols, vals)))
    return rows

menu = insert_rows("menu_items")
dump_orders = insert_rows("orders")

seed = OUT / "demo" / "seed.sqlite"
seed.parent.mkdir(parents=True, exist_ok=True)
db = sqlite3.connect(seed)
db.executescript("""
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE,
  role TEXT DEFAULT 'customer' COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'Active' COLLATE NOCASE,
  is_logged_in INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_logged_in TEXT DEFAULT NULL
);
CREATE TABLE menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL COLLATE NOCASE,
  price REAL NOT NULL,
  category TEXT NOT NULL COLLATE NOCASE,
  stock INTEGER NOT NULL DEFAULT 0,
  available INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT DEFAULT NULL,
  customer_name TEXT NOT NULL COLLATE NOCASE,
  category TEXT DEFAULT NULL COLLATE NOCASE,
  product TEXT NOT NULL COLLATE NOCASE,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  total REAL DEFAULT NULL,
  table_no TEXT DEFAULT NULL COLLATE NOCASE,
  status TEXT DEFAULT 'Processing' COLLATE NOCASE,
  order_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  item TEXT GENERATED ALWAYS AS (product) VIRTUAL
);
CREATE TABLE billing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER DEFAULT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_name TEXT DEFAULT NULL,
  total_amount REAL DEFAULT NULL,
  bill_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL COLLATE NOCASE,
  category TEXT NOT NULL COLLATE NOCASE,
  stock INTEGER NOT NULL DEFAULT 0,
  added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  reservation_date TEXT NOT NULL,
  reservation_time TEXT NOT NULL,
  reservation_end_time TEXT NOT NULL,
  persons TEXT NOT NULL,
  table_no TEXT NOT NULL COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending' COLLATE NOCASE,
  actual_end_time TEXT DEFAULT NULL,
  UNIQUE (reservation_date, reservation_time, table_no)
);
CREATE TABLE demo_meta (key TEXT PRIMARY KEY, value TEXT);
""")

rng = random.Random(42)
today = date.today()
db.execute("INSERT INTO demo_meta VALUES ('anchor_date', ?)", (today.isoformat(),))

# Demo logins (password 'demo1234' is hashed on first run). No real accounts.
created = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")
for u, e, r in [("admin", "admin@demo.local", "admin"), ("staff", "staff@demo.local", "staff"), ("customer", "customer@demo.local", "customer")]:
    db.execute("INSERT INTO users (username, password, email, role, status, created_at) VALUES (?, '__DEMO__', ?, ?, 'Active', ?)", (u, e, r, created))

# The restaurant's real menu, with sample stock levels (a few low, to show the alerts).
for m in menu:
    stock = rng.choice([3, 6, 8]) if rng.random() < 0.12 else rng.randint(12, 60)
    db.execute("INSERT INTO menu_items (id, item_name, price, category, stock, available) VALUES (?, ?, ?, ?, ?, 1)",
               (m["id"], m["item_name"], m["price"], m["category"], stock))

# Orders: the real menu items/quantities/prices, with made-up customers spread over ~45 days.
names = ["Juan Dela Cruz", "Maria Santos", "Jose Reyes", "Ana Garcia", "Mark Bautista", "Liza Mendoza",
         "Carlo Ramos", "Bea Villanueva", "Paolo Aquino", "Nina Castillo", "Walk-in", "Walk-in"]
for i, o in enumerate(dump_orders):
    d = datetime.combine(today - timedelta(days=rng.randint(0, 45)), datetime.min.time()) + timedelta(hours=rng.randint(10, 21), minutes=rng.randint(0, 59))
    qty, price = int(o["quantity"]), float(o["price"])
    db.execute("""INSERT INTO orders (order_number, customer_name, category, product, quantity, price, total, table_no, status, order_date)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
               (f"ORD{d:%Y%m%d}-{1000 + i}", rng.choice(names), o.get("category"), o["product"], qty, price, qty * price,
                f"Table {rng.randint(1, 4)}", "Served" if d.date() < today else rng.choice(["Processing", "Served"]), d.strftime("%Y-%m-%d %H:%M:%S")))

# Sample reservations around today.
for k, (off, t, persons, status) in enumerate([(-6, "18:00", "4", "finished"), (-2, "12:00", "2", "finished"), (-1, "19:00", "6", "cancelled"),
                                               (0, "18:30", "3", "approved"), (1, "12:30", "2", "pending"), (2, "19:00", "5", "approved"),
                                               (4, "17:00", "4", "pending"), (7, "20:00", "8", "pending")]):
    day = today + timedelta(days=off)
    start = datetime.strptime(t, "%H:%M")
    db.execute("""INSERT INTO reservations (user_id, name, phone, reservation_date, reservation_time, reservation_end_time, persons, table_no, created_at, status)
                  VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
               (names[k], f"0917-000-{1001 + k}", day.isoformat(), start.strftime("%H:%M:%S"), (start + timedelta(hours=2)).strftime("%H:%M:%S"),
                persons, f"Table {k % 4 + 1}", (datetime.combine(day, datetime.min.time()) - timedelta(days=3)).strftime("%Y-%m-%d %H:%M:%S"), status))

for name, cat, stock in [("Rice (kg)", "Pantry", 40), ("Cooking Oil (L)", "Pantry", 12), ("Pork Belly (kg)", "Meat", 8),
                         ("Chicken (kg)", "Meat", 15), ("Calamansi (pack)", "Produce", 6), ("Soft Drinks (case)", "Beverages", 9)]:
    db.execute("INSERT INTO inventory (item_name, category, stock) VALUES (?, ?, ?)", (name, cat, stock))

db.commit()
db.execute("VACUUM")
db.close()

# ---------- 3. safety checks + manifest ----------
for f in OUT.rglob("*"):
    if f.is_file() and f.suffix in {".php", ".js", ".txt"}:
        text = f.read_text(encoding="utf-8", errors="replace")
        assert not re.search(r"sk-[A-Za-z0-9_\-]{20,}", text), f"possible API key left in {f}"

# Images don't survive PHP's file preloading, so the browser loads them as plain static files:
# copy them to the same URL path the app uses (/demos/ball-lalo/app/...), which the worker skips.
IMAGES = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"}
STATIC = OUT.parent / "app"
empty_dir(STATIC)
for f in OUT.rglob("*"):
    if f.is_file() and f.suffix.lower() in IMAGES:
        dest = STATIC / f.relative_to(OUT)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, dest)

files = sorted(f.relative_to(OUT).as_posix() for f in OUT.rglob("*")
               if f.is_file() and f.suffix.lower() not in IMAGES)
# A module, because a service worker can't await a fetch while it starts up.
(OUT.parent / "www-files.mjs").write_text(
    "// Generated by scripts/ballalo-demo/build.py: app files preloaded into PHP's filesystem.\n"
    "export default " + json.dumps(files, indent=1) + ";\n", encoding="utf-8")
print(f"Built {len(files)} files into {OUT.relative_to(ROOT)}; menu {len(menu)} items, orders {len(dump_orders)}")
