import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Facturas from "./pages/Facturas";
import Clientes from "./pages/Clientes";

function App() {
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