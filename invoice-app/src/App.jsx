import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import { getToken } from "./api";

function App() {
  const [authed, setAuthed] = useState(!!getToken());

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
