import { Link, useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col shadow-2xl">
        
        {/* LOGO */}
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          Invoice<span className="text-blue-500">App</span>
        </h2>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
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

        {/* FOOTER */}
        <div className="mt-auto text-sm text-gray-400">
          <p>v1.0</p>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg">
          {children}
        </div>
      </main>

    </div>
  );
};

export default MainLayout;