const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

/*
BASE DE DATOS EN MEMORIA
*/

let clients = [
  { id: 1, nombre: "Pepe" },
  { id: 2, nombre: "Chandra" },
  { id: 3, nombre: "Maria" },
  { id: 4, nombre: "Paco" },
];

let invoices = [
  {
    id: 1,
    clientId: 1,
    amount: 1500,
    status: "Pendiente",
    date: "2026-05-05",
  },
  {
    id: 2,
    clientId: 2,
    amount: 2500,
    status: "Pendiente",
    date: "2026-05-06",
  },
  {
    id: 3,
    clientId: 3,
    amount: 1200,
    status: "Pagada",
    date: "2026-05-07",
  },
  {
    id: 4,
    clientId: 4,
    amount: 1500,
    status: "Pendiente",
    date: "2026-05-05",
  },
];

/*
========================
CLIENTS
========================
*/

// GET clientes
app.get("/clients", (req, res) => {
  res.json(clients);
});

// POST cliente
app.post("/clients", (req, res) => {
  const newClient = {
    ...req.body,
    id: Date.now(),
  };

  clients.push(newClient);
  res.json(newClient);
});

// DELETE cliente
app.delete("/clients/:id", (req, res) => {
  const id = Number(req.params.id);

  clients = clients.filter((c) => c.id !== id);

  res.json({ success: true });
});

/*
========================
INVOICES
========================
*/

// GET facturas
app.get("/invoices", (req, res) => {
  res.json(invoices);
});

// POST factura
app.post("/invoices", (req, res) => {
  const newInvoice = {
    ...req.body,
    id: Date.now(),
  };

  invoices.push(newInvoice);
  res.json(newInvoice);
});

// PUT factura
app.put("/invoices/:id", (req, res) => {
  const id = Number(req.params.id);

  invoices = invoices.map((inv) =>
    inv.id === id ? { ...inv, ...req.body } : inv
  );

  res.json(invoices);
});

// DELETE factura
app.delete("/invoices/:id", (req, res) => {
  const id = Number(req.params.id);

  invoices = invoices.filter((inv) => inv.id !== id);

  res.json({ success: true });
});

// Servidor
app.listen(3001, () => {
  console.log("Servidor en http://localhost:3001");
});