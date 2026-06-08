// Cliente HTTP central: añade la URL base y el token JWT a cada petición,
// y cierra la sesión automáticamente si el token caduca (401).
//
// Si el backend no está disponible (por ejemplo en la demo pública, donde no
// hay servidor), cae automáticamente a una capa "demo" sobre localStorage, de
// forma que la app sigue siendo totalmente funcional desde el navegador.

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const getToken = () => localStorage.getItem("invoice_token");
export const getUsername = () => localStorage.getItem("invoice_user");

export function setSession(token, username) {
  localStorage.setItem("invoice_token", token);
  localStorage.setItem("invoice_user", username);
}

export function logout() {
  localStorage.removeItem("invoice_token");
  localStorage.removeItem("invoice_user");
  window.location.reload();
}

/* ─────────────────────────────────────────────
   CAPA DEMO (localStorage) — espejo del backend
   ───────────────────────────────────────────── */
const DEMO_CLIENTS = "invoice_demo_clients";
const DEMO_INVOICES = "invoice_demo_invoices";

const lsRead = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const lsWrite = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* almacenamiento no disponible */
  }
};
const nextId = (arr) => (arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1);

// Datos de ejemplo (los mismos que siembra el backend la primera vez).
function seedDemo() {
  if (!localStorage.getItem(DEMO_CLIENTS)) {
    lsWrite(DEMO_CLIENTS, [
      { id: 1, nombre: "Pepe" },
      { id: 2, nombre: "Chandra" },
      { id: 3, nombre: "Maria" },
      { id: 4, nombre: "Paco" },
    ]);
  }
  if (!localStorage.getItem(DEMO_INVOICES)) {
    lsWrite(DEMO_INVOICES, [
      { id: 1, clientId: 1, amount: 1500, concepto: "Diseño web", status: "Pendiente", date: "2026-05-05" },
      { id: 2, clientId: 2, amount: 2500, concepto: "Consultoría", status: "Pendiente", date: "2026-05-06" },
      { id: 3, clientId: 3, amount: 1200, concepto: "Mantenimiento", status: "Pagada", date: "2026-05-07" },
      { id: 4, clientId: 4, amount: 1500, concepto: "Desarrollo app", status: "Pendiente", date: "2026-05-05" },
    ]);
  }
}

// Activa el modo demo: siembra datos y abre una sesión de invitado.
export function enableDemo() {
  seedDemo();
  if (!getToken()) setSession("demo", "Invitado");
}

// ¿Hay backend real escuchando? Un 401 cuenta como "sí" (existe, pide login);
// solo un fallo de red (no hay servidor) devuelve false → modo demo.
export async function backendReachable() {
  try {
    await fetch(BASE + "/clients");
    return true;
  } catch {
    return false;
  }
}

// Respuesta con la misma forma mínima que usa la app (res.ok / res.status / res.json()).
const fakeRes = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

// Mini-router que imita las rutas del backend sobre localStorage.
function demoHandle(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;
  seedDemo();

  let clients = lsRead(DEMO_CLIENTS, []);
  let invoices = lsRead(DEMO_INVOICES, []);

  // Autenticación (en demo siempre concede una sesión de invitado).
  if (path === "/auth/login" || path === "/auth/register") {
    const username = (body && body.username) || "Invitado";
    setSession("demo", username);
    return fakeRes({ token: "demo", username });
  }

  // Clientes
  if (path === "/clients" && method === "GET") return fakeRes(clients);
  if (path === "/clients" && method === "POST") {
    const c = { id: nextId(clients), nombre: ((body && body.nombre) || "").trim() };
    clients.push(c);
    lsWrite(DEMO_CLIENTS, clients);
    return fakeRes(c);
  }
  if (path.startsWith("/clients/") && method === "DELETE") {
    const id = Number(path.split("/")[2]);
    lsWrite(DEMO_CLIENTS, clients.filter((c) => c.id !== id));
    return fakeRes({ success: true });
  }

  // Facturas
  if (path === "/invoices" && method === "GET") return fakeRes(invoices);
  if (path === "/invoices" && method === "POST") {
    const inv = {
      id: nextId(invoices),
      clientId: Number(body.clientId),
      amount: Number(body.amount),
      concepto: body.concepto || "",
      status: body.status || "Pendiente",
      date: body.date,
    };
    invoices.push(inv);
    lsWrite(DEMO_INVOICES, invoices);
    return fakeRes(inv);
  }
  if (path.startsWith("/invoices/") && method === "PUT") {
    const id = Number(path.split("/")[2]);
    invoices = invoices.map((i) =>
      i.id === id
        ? {
            ...i,
            ...body,
            id,
            amount: Number(body.amount ?? i.amount),
            clientId: Number(body.clientId ?? i.clientId),
          }
        : i
    );
    lsWrite(DEMO_INVOICES, invoices);
    // El backend devuelve la lista completa tras un PUT.
    return fakeRes(invoices);
  }
  if (path.startsWith("/invoices/") && method === "DELETE") {
    const id = Number(path.split("/")[2]);
    lsWrite(DEMO_INVOICES, invoices.filter((i) => i.id !== id));
    return fakeRes({ success: true });
  }

  // Stats (resumen calculado, igual que en el servidor)
  if (path === "/stats" && method === "GET") {
    const totalPaid = invoices
      .filter((i) => i.status === "Pagada")
      .reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices
      .filter((i) => i.status === "Pendiente")
      .reduce((s, i) => s + i.amount, 0);
    const byStatusMap = {};
    invoices.forEach((i) => {
      byStatusMap[i.status] = byStatusMap[i.status] || { status: i.status, count: 0, total: 0 };
      byStatusMap[i.status].count += 1;
      byStatusMap[i.status].total += i.amount;
    });
    return fakeRes({ totalPaid, totalPending, count: invoices.length, byStatus: Object.values(byStatusMap) });
  }

  return fakeRes({ error: "Ruta no encontrada (demo)" }, 404);
}

/* ─────────────────────────────────────────────
   CLIENTE PÚBLICO
   ───────────────────────────────────────────── */
export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(BASE + path, { ...options, headers });

    // Solo cerramos sesión si HABÍA token real (sesión caducada). En el login no
    // hay token todavía, y el token "demo" no debe forzar recarga.
    if (res.status === 401 && token && token !== "demo") {
      localStorage.removeItem("invoice_token");
      localStorage.removeItem("invoice_user");
      window.location.reload();
    }
    return res;
  } catch {
    // No hay backend → servimos desde la capa demo (localStorage).
    return demoHandle(path, options);
  }
}
