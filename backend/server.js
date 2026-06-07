const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

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
    status   TEXT NOT NULL DEFAULT 'Pendiente',
    date     TEXT NOT NULL
  );
`);

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
  const { clientId, amount, status, date } = req.body || {};
  if (!clientId || amount == null || !date) {
    return res.status(400).json({ error: "Faltan datos de la factura" });
  }

  const info = db
    .prepare(
      "INSERT INTO invoices (clientId, amount, status, date) VALUES (?, ?, ?, ?)"
    )
    .run(Number(clientId), Number(amount), status || "Pendiente", date);

  res.json(db.prepare("SELECT * FROM invoices WHERE id = ?").get(info.lastInsertRowid));
});

app.put("/invoices/:id", (req, res) => {
  const id = Number(req.params.id);
  const current = db.prepare("SELECT * FROM invoices WHERE id = ?").get(id);
  if (!current) return res.status(404).json({ error: "Factura no encontrada" });

  const merged = { ...current, ...req.body };
  db.prepare(
    "UPDATE invoices SET clientId = ?, amount = ?, status = ?, date = ? WHERE id = ?"
  ).run(Number(merged.clientId), Number(merged.amount), merged.status, merged.date, id);

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

app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});
