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

Necesitas Node 18 o superior.

La primera vez, instala las dependencias de todo el proyecto:

```bash
npm run install:all
```

Después, arranca backend y frontend a la vez con un solo comando desde la raíz:

```bash
npm run dev
```

Eso levanta el backend en el puerto 3001 y el frontend de Vite. Abre la URL que
te muestra Vite (normalmente http://localhost:5173).

Si prefieres arrancarlos por separado, en dos terminales:

```bash
# Terminal 1 — backend
cd backend && node server.js

# Terminal 2 — frontend
cd invoice-app && npm run dev
```

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
