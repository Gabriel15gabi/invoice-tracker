import InvoiceModal from "../components/InvoiceModal";
import IncomeChart from "../components/IncomeChart";
import StatusChart from "../components/StatusChart";
import InvoiceDrawer from "../components/InvoiceDrawer";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [editingInvoice, setEditingInvoice] = useState(null);

  const clientsMap = Object.fromEntries(
    clients.map((c) => [c.id, c.nombre])
  );

  useEffect(() => {
    fetch("http://localhost:3001/invoices")
      .then((res) => res.json())
      .then((data) => setInvoices(data));

    fetch("http://localhost:3001/clients")
      .then((res) => res.json())
      .then((data) => setClients(data));
  }, []);

  const getClientName = (id) =>
    clientsMap[id] || "Cliente desconocido";

  const addInvoice = (newInvoice) => {
    fetch("http://localhost:3001/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInvoice),
    })
      .then((res) => res.json())
      .then((createdInvoice) => {
        setInvoices((prev) => [...prev, createdInvoice]);
      });
  };

  const deleteInvoice = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta factura?")) return;

    fetch(`http://localhost:3001/invoices/${id}`, {
      method: "DELETE",
    }).then(() => {
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    });
  };

  const toggleStatus = (invoice) => {
    const updated = {
      ...invoice,
      status: invoice.status === "Pagada" ? "Pendiente" : "Pagada",
    };

    fetch(`http://localhost:3001/invoices/${invoice.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updated),
    })
      .then(() => fetch("http://localhost:3001/invoices"))
      .then((res) => res.json())
      .then((data) => setInvoices(data));
  };

  const updateInvoice = (updatedInvoice) => {
    fetch(`http://localhost:3001/invoices/${updatedInvoice.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedInvoice),
    })
      .then(() => fetch("http://localhost:3001/invoices"))
      .then((res) => res.json())
      .then((data) => setInvoices(data));
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const clientName = getClientName(invoice.clientId).toLowerCase();

    return (
      clientName.includes(search.toLowerCase()) &&
      (filter === "Todas" || invoice.status === filter)
    );
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "amount") {
      return order === "asc"
        ? a.amount - b.amount
        : b.amount - a.amount;
    }

    if (sortBy === "date") {
      return order === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }

    return 0;
  });

  const totalIncome = invoices
    .filter((inv) => inv.status === "Pagada")
    .reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={() => {
            setEditingInvoice(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Nueva factura
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Ingresos</p>
          <h2 className="text-2xl font-bold">
            {totalIncome.toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR",
            })}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Facturas</p>
          <h2 className="text-2xl font-bold">{invoices.length}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Pendientes</p>
          <h2 className="text-2xl font-bold">
            {invoices.filter((i) => i.status === "Pendiente").length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeChart invoices={invoices} />
        <StatusChart invoices={invoices} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-4 mt-8">
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <div className="flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="amount">Ordenar por importe</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="desc">Descendente</option>
            <option value="asc">Ascendente</option>
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Todas">Todas</option>
            <option value="Pagada">Pagadas</option>
            <option value="Pendiente">Pendientes</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">
          Últimas facturas
        </h2>

        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-gray-400 uppercase text-xs">
            <tr className="border-b">
              <th className="py-2">Cliente</th>
              <th className="py-2">Importe</th>
              <th className="py-2">Estado</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {sortedInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                className="border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-2">
                  {getClientName(invoice.clientId)}
                </td>

                <td className="py-2">
                  {invoice.amount.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </td>

                <td className="py-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(invoice);
                    }}
                    className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingInvoice(invoice);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-500"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteInvoice(invoice.id);
                    }}
                    className="text-red-500"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

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

      {selectedInvoice && (
        <InvoiceDrawer
          invoice={selectedInvoice}
          clientName={getClientName(selectedInvoice.clientId)}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;