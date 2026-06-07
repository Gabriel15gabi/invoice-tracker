# Invoice Tracker

Aplicación de facturación full-stack: gestión de clientes, facturas y un panel
con métricas de ingresos. La empecé para practicar React conectándolo a un
backend propio en Express, en lugar de quedarme solo en el front.

Está en desarrollo: el CRUD de clientes y facturas y el dashboard ya funcionan;
sigo puliendo los gráficos y quiero añadir persistencia real y login.

## Stack

- **Frontend:** React + Vite, React Router, Tailwind CSS y Recharts para los gráficos.
- **Backend:** Node.js + Express con base de datos SQLite (API REST).

## Cómo arrancarlo

Necesitas Node 18 o superior. Son dos procesos: el backend (puerto 3001) y el
frontend de Vite.

Backend:

```bash
cd backend
npm install
node server.js
```

Frontend, en otra terminal:

```bash
cd invoice-app
npm install
npm run dev
```

Abre la URL que te muestra Vite (normalmente http://localhost:5173).

## API

El backend expone una API REST sencilla:

| Método | Ruta            | Descripción           |
|--------|-----------------|-----------------------|
| GET    | `/clients`      | Listar clientes       |
| POST   | `/clients`      | Crear cliente         |
| DELETE | `/clients/:id`  | Borrar cliente        |
| GET    | `/invoices`     | Listar facturas       |
| POST   | `/invoices`     | Crear factura         |
| PUT    | `/invoices/:id` | Editar factura        |
| DELETE | `/invoices/:id` | Borrar factura        |
| GET    | `/stats`        | Resumen: totales y pagadas vs pendientes |

Los datos se guardan en una base de datos SQLite local, así que persisten entre
reinicios del servidor.

## Estructura

```
proyecto-fullstack/
├─ backend/        API en Express (clientes y facturas)
└─ invoice-app/    Frontend React + Vite + Tailwind
```

## Pendiente

- Autenticación de usuarios.
- Exportar facturas a PDF.
- Filtros por rango de fechas en el dashboard.
