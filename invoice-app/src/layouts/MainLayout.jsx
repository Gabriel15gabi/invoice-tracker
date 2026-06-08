import { Link, useLocation } from "react-router-dom";
import { logout, getUsername, getToken } from "../api";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isDemo = getToken() === "demo";

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition whitespace-nowrap ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* SIDEBAR / TOPBAR */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-4 md:p-6 flex flex-col shadow-2xl">
        {/* LOGO */}
        <h2
          className={`text-2xl font-bold tracking-wide ${
            isDemo ? "mb-2" : "mb-4 md:mb-10"
          }`}
        >
          Invoice<span className="text-blue-500">App</span>
        </h2>

        {isDemo && (
          <p className="mb-4 md:mb-8 text-xs text-gray-400 leading-snug">
            <span className="inline-block rounded bg-blue-500/20 px-2 py-0.5 text-blue-300 font-medium">
              Modo demo
            </span>{" "}
            Datos de ejemplo guardados en tu navegador.
          </p>
        )}

        {/* NAV (horizontal en móvil, vertical en escritorio) */}
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>

          <Link to="/facturas" className={linkClass("/facturas")}>
            Facturas
          </Link>

          <Link to="/clientes" className={linkClass("/clientes")}>
            Clientes
          </Link>
        </nav>

        {/* USUARIO + CERRAR SESIÓN */}
        <div className="mt-auto pt-4">
          {getUsername() && (
            <p className="mb-2 text-sm text-gray-400">
              Hola, <span className="text-white">{getUsername()}</span>
            </p>
          )}
          <button
            onClick={logout}
            className="text-sm text-gray-300 underline hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white/80 backdrop-blur p-4 md:p-6 rounded-2xl shadow-lg">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
