# Invoice Tracker

Aplicación de facturación full-stack: gestión de clientes, facturas y un panel
con métricas de ingresos. La empecé para practicar React conectándolo a un
backend propio en Express, en lugar de quedarme solo en el front.

Incluye login real, base de datos, gráficos en el dashboard, filtros por fecha y
exportación de facturas a PDF.

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

## Autenticación

La app tiene login y registro reales: las contraseñas se cifran con **bcrypt** y
la sesión se gestiona con **JWT**. Todas las rutas de datos requieren estar
identificado.

## API

| Método | Ruta              | Descripción                              | Sesión |
|--------|-------------------|------------------------------------------|:------:|
| POST   | `/auth/register`  | Crear cuenta                             |   —    |
| POST   | `/auth/login`     | Iniciar sesión → devuelve un JWT         |   —    |
| GET    | `/clients`        | Listar clientes                          |   Sí   |
| POST   | `/clients`        | Crear cliente                            |   Sí   |
| DELETE | `/clients/:id`    | Borrar cliente                           |   Sí   |
| GET    | `/invoices`       | Listar facturas                          |   Sí   |
| POST   | `/invoices`       | Crear factura                            |   Sí   |
| PUT    | `/invoices/:id`   | Editar factura                           |   Sí   |
| DELETE | `/invoices/:id`   | Borrar factura                           |   Sí   |
| GET    | `/stats`          | Resumen: totales y pagadas vs pendientes |   Sí   |

Los datos se guardan en una base de datos SQLite local, así que persisten entre
reinicios del servidor.

## Estructura

```
proyecto-fullstack/
├─ backend/        API en Express (clientes y facturas)
└─ invoice-app/    Frontend React + Vite + Tailwind
```

## Funciones

- Login y registro con contraseñas cifradas (bcrypt + JWT).
- CRUD de clientes y facturas con persistencia en SQLite.
- Dashboard con métricas y dos gráficos (evolución de ingresos y pagadas vs
  pendientes).
- Filtros por estado, búsqueda y **rango de fechas**.
- **Exportar una factura a PDF** desde su detalle.

## Pendiente

- Roles y permisos (admin / usuario).
- Exportar el listado completo a PDF o CSV.
- Paginación cuando hay muchas facturas.
