# Invoice Tracker

Aplicación de facturación full-stack: gestión de clientes, facturas y un panel
con métricas de ingresos. La empecé para practicar React conectándolo a un
backend propio en Express, en lugar de quedarme solo en el front.

Está en desarrollo: el CRUD de clientes y facturas y el dashboard ya funcionan;
sigo puliendo los gráficos y quiero añadir persistencia real y login.

## Stack

- **Frontend:** React + Vite, React Router, Tailwind CSS y Recharts para los gráficos.
- **Backend:** Node.js + Express (API REST).

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

De momento los datos se guardan en memoria, así que se reinician cada vez que
paras el servidor.

## Estructura

```
proyecto-fullstack/
├─ backend/        API en Express (clientes y facturas)
└─ invoice-app/    Frontend React + Vite + Tailwind
```

## Pendiente

- Persistencia real con base de datos (ahora es memoria).
- Más gráficos y filtros en el dashboard.
- Autenticación de usuarios.
