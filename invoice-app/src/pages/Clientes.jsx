import { useState } from "react";

const Clientes = () => {
  const [clientes, setClientes] = useState([
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@gmail.com",
    telefono: "600123456",
    direccion: "Madrid",
  },
  {
    id: 2,
    nombre: "Laura Gómez",
    email: "laura@gmail.com",
    telefono: "611222333",
    direccion: "Barcelona",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    email: "carlos@gmail.com",
    telefono: "622333444",
    direccion: "Valencia",
  },
]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  // Añadir cliente
  const addClient = () => {
    if (!form.nombre || !form.email) return;

    const newClient = {
      ...form,
      id: Date.now(),
    };

    setClientes((prev) => [...prev, newClient]);

    setForm({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* FORMULARIO */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Añadir cliente
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Nombre y Apellidos"
            value={form.nombre}
            onChange={(e) =>
              setForm({ ...form, nombre: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
outline-none p-2 rounded-lg transition"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
outline-none p-2 rounded-lg transition"
          />

          <input
            placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) =>
              setForm({ ...form, telefono: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
outline-none p-2 rounded-lg transition"
          />

          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) =>
              setForm({ ...form, direccion: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
outline-none p-2 rounded-lg transition"
          />
        </div>

        <button
          onClick={addClient}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 
text-white py-2 rounded-lg hover:opacity-90 transition shadow-md"
        >
          Añadir cliente
        </button>
      </div>

      {/* LISTA */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Clientes</h2>

        <div className="grid grid-cols-2 gap-4">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              onClick={() => setSelectedClient(cliente)}
              className="p-5 rounded-xl bg-white/80 backdrop-blur border border-gray-200 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
<div className="flex items-center gap-3">
  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 
text-white flex items-center justify-center rounded-full font-semibold shadow">
    {cliente.nombre.charAt(0)}
  </div>
  <div>
    <p className="font-semibold">{cliente.nombre}</p>
    <p className="text-sm text-gray-500">{cliente.email}</p>
  </div>
</div>
              <p className="text-sm text-gray-500">
                {cliente.email}
              </p>
            </div>
          ))}
        </div>

        {clientes.length === 0 && (
          <p className="text-gray-500 mt-4">
            No hay clientes aún
          </p>
        )}
      </div>

      {/* MODAL */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 relative">
            <button
              onClick={() => setSelectedClient(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              {selectedClient.nombre}
            </h2>

            <p><strong>Email:</strong> {selectedClient.email}</p>
            <p><strong>Teléfono:</strong> {selectedClient.telefono}</p>
            <p><strong>Dirección:</strong> {selectedClient.direccion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;