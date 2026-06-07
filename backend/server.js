const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "invoice_tracker_dev_secret_cambia_esto";

/* ─────────────────────────────────────────────
   BASE DE DATOS (SQLite — los datos persisten)
   ───────────────────────────────────────────── */
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "invoices.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    clientId INTEGER NOT NULL,
    amount   REAL NOT NULL,
    concepto TEXT DEFAULT '',
    status   TEXT NOT NULL DEFAULT 'Pendiente',
    date     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );
`);

// Migración: añade la columna 'concepto' si la BD es de una versión anterior.
const invoiceCols = db.prepare("PRAGMA table_info(invoices)").all();
if (!invoiceCols.some((c) => c.name === "concepto")) {
  db.exec("ALTER TABLE invoices ADD COLUMN concepto TEXT DEFAULT ''");
}

// Datos de ejemplo (solo la primera vez, si la BD está vacía)
if (db.prepare("SELECT COUNT(*) AS n FROM clients").get().n === 0) {
  const insClient = db.prepare("INSERT INTO clients (id, nombre) VALUES (?, ?)");
  [
    [1, "Pepe"],
    [2, "Chandra"],
    [3, "Maria"],
    [4, "Paco"],
  ].forEach((c) => insClient.run(...c));

  const insInvoice = db.prepare(
    "INSERT INTO invoices (id, clientId, amount, status, date) VALUES (?, ?, ?, ?, ?)"
  );
  [
    [1, 1, 1500, "Pendiente", "2026-05-05"],
    [2, 2, 2500, "Pendiente", "2026-05-06"],
    [3, 3, 1200, "Pagada", "2026-05-07"],
    [4, 4, 1500, "Pendiente", "2026-05-05"],
  ].forEach((i) => insInvoice.run(...i));
}

/* ─────────────────────────────────────────────
   AUTENTICACIÓN (bcrypt + JWT)
   ───────────────────────────────────────────── */
const signToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "7d",
  });

app.post("/auth/register", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = req.body?.password || "";
  if (username.length < 3 || password.length < 4) {
    return res
      .status(400)
      .json({ error: "Usuario (mín. 3) y contraseña (mín. 4) requeridos" });
  }
  if (db.prepare("SELECT id FROM users WHERE username = ?").get(username)) {
    return res.status(409).json({ error: "Ese usuario ya existe" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .run(username, hash);
  res.json({ token: signToken({ id: info.lastInsertRowid, username }), username });
});

app.post("/auth/login", (req, res) => {
  const username = (req.body?.username || "").trim();
  const password = req.body?.password || "";
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
  res.json({ token: signToken(user), username: user.username });
});

// A partir de aquí, todas las rutas requieren sesión.
function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No autenticado" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Sesión expirada o inválida" });
  }
}
app.use(authRequired);

/* ─────────────────────────────────────────────
   CLIENTS
   ───────────────────────────────────────────── */
app.get("/clients", (req, res) => {
  res.json(db.prepare("SELECT * FROM clients ORDER BY id").all());
});

app.post("/clients", (req, res) => {
  const nombre = (req.body?.nombre || "").trim();
  if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

  const info = db.prepare("INSERT INTO clients (nombre) VALUES (?)").run(nombre);
  res.json(db.prepare("SELECT * FROM clients WHERE id = ?").get(info.lastInsertRowid));
});

app.delete("/clients/:id", (req, res) => {
  db.prepare("DELETE FROM clients WHERE id = ?").run(Number(req.params.id));
  res.json({ success: true });
});

/* ─────────────────────────────────────────────
   INVOICES
   ───────────────────────────────────────────── */
app.get("/invoices", (req, res) => {
  res.json(db.prepare("SELECT * FROM invoices ORDER BY id").all());
});

app.post("/invoices", (req, res) => {
  const { clientId, amount, concepto, status, date } = req.body || {};
  if (!clientId || amount == null || !date) {
    return res.status(400).json({ error: "Faltan datos de la factura" });
  }

  const info = db
    .prepare(
      "INSERT INTO invoices (clientId, amount, concepto, status, date) VALUES (?, ?, ?, ?, ?)"
    )
    .run(Number(clientId), Number(amount), concepto || "", status || "Pendiente", date);

  res.json(db.prepare("SELECT * FROM invoices WHERE id = ?").get(info.lastInsertRowid));
});

app.put("/invoices/:id", (req, res) => {
  const id = Number(req.params.id);
  const current = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id);
  if (!current) return res.status(404).json({ error: "Factura no encontrada" });

  const merged = { ...current, ...req.body };
  db.prepare(
    "UPDATE invoices SET clientId = ?, amount = ?, concepto = ?, status = ?, date = ? WHERE id = ?"
  ).run(
    Number(merged.clientId),
    Number(merged.amount),
    merged.concepto || "",
    merged.status,
    merged.date,
    id
  );

  // Mantenemos el contrato original: devolvemos la lista completa de facturas.
  res.json(db.prepare("SELECT * FROM invoices ORDER BY id").all());
});

app.delete("/invoices/:id", (req, res) => {
  db.prepare("DELETE FROM invoices WHERE id = ?").run(Number(req.params.id));
  res.json({ success: true });
});

/* ─────────────────────────────────────────────
   STATS (resumen calculado en el servidor)
   ───────────────────────────────────────────── */
app.get("/stats", (req, res) => {
  const totalPaid = db
    .prepare("SELECT COALESCE(SUM(amount), 0) AS v FROM invoices WHERE status = 'Pagada'")
    .get().v;
  const totalPending = db
    .prepare("SELECT COALESCE(SUM(amount), 0) AS v FROM invoices WHERE status = 'Pendiente'")
    .get().v;
  const count = db.prepare("SELECT COUNT(*) AS n FROM invoices").get().n;
  const byStatus = db
    .prepare(
      "SELECT status, COUNT(*) AS count, COALESCE(SUM(amount), 0) AS total FROM invoices GROUP BY status"
    )
    .all();

  res.json({ totalPaid, totalPending, count, byStatus });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
