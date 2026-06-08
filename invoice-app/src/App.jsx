import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import { getToken, backendReachable, enableDemo } from "./api";

function App() {
  const [authed, setAuthed] = useState(!!getToken());
  // Si ya hay sesión no hace falta comprobar nada; si no, arrancamos comprobando.
  const [booting, setBooting] = useState(!getToken());

  useEffect(() => {
    if (getToken()) return;
    let alive = true;
    (async () => {
      const online = await backendReachable();
      if (!alive) return;
      // Sin backend (demo pública): abrimos sesión de invitado y entramos directos.
      if (!online) {
        enableDemo();
        setAuthed(true);
      }
      setBooting(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando…
      </div>
    );
  }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/facturas" element={<Facturas />} />
        <Route path="/clientes" element={<Clientes />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
