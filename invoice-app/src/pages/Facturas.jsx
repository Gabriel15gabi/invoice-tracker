import { useEffect, useState } from "react";
import InvoiceModal from "../components/InvoiceModal";
import { api } from "../api";

const Facturas = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // 📥 Cargar facturas
  useEffect(() => {
    api("/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error(err));
  }, []);

  // ➕ Crear factura
  const addInvoice = (newInvoice) => {
    api("/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvoice),
    })
      .then((res) => res.json())
      .then((created) => {
        setInvoices((prev) => [...prev, created]);
      });
  };

  // ❌ Eliminar
  const deleteInvoice = (id) => {
    if (!window.confirm("¿Eliminar factura?")) return;

    api(`/invoices/${id}`, {
      method: "DELETE",
    }).then(() => {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    });
  };

  // 🔄 Cambiar estado
  const toggleStatus = (invoice) => {
    const updated = {
      ...invoice,
      status: invoice.status === "Pagada" ? "Pendiente" : "Pagada",
    };

    api(`/invoices/${invoice.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then(() => {
        setInvoices((prev) =>
          prev.map((i) => (i.id === invoice.id ? updated : i))
        );
      });
  };

  // ✏️ Editar factura
  const updateInvoice = (updatedInvoice) => {
    api(`/invoices/${updatedInvoice.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInvoice),
    })
      .then((res) => res.json())
      .then(() => {
        setInvoices((prev) =>
          prev.map((i) =>
            i.id === updatedInvoice.id ? updatedInvoice : i
          )
        );
      });
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Facturas</h1>

        <button
          onClick={() => {
            setEditingInvoice(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Nueva factura
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Cliente</th>
              <th className="py-2">Importe</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b hover:bg-gray-100">
                <td className="py-2">{invoice.client}</td>

                <td className="py-2">
                  {invoice.amount.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>

                <td className="py-2">
                  <span
                    onClick={() => toggleStatus(invoice)}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      invoice.status === "Pagada"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td className="py-2">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>

                <td className="py-2 flex gap-3">
                  <button
                    onClick={() => {
                      setEditingInvoice(invoice);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deleteInvoice(invoice.id)}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <p className="text-gray-500 mt-4">No hay facturas</p>
        )}
      </div>

      {/* MODAL */}
      <InvoiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInvoice(null);
        }}
        onCreate={addInvoice}
        onUpdate={updateInvoice}
        editingInvoice={editingInvoice}
      />
    </div>
  );
};

export default Facturas;