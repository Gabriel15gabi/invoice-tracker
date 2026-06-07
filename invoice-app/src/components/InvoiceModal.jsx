import { useState, useEffect } from "react";

const InvoiceModal = ({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  editingInvoice,
}) => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");

  // Cargar clientes desde backend
  useEffect(() => {
    fetch("http://localhost:3001/clients")
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error(err));
  }, []);

  // Rellenar datos al editar
  useEffect(() => {
    if (isOpen) {
      if (editingInvoice) {
        setClientId(editingInvoice.clientId || "");
        setAmount(editingInvoice.amount || "");
      } else {
        setClientId("");
        setAmount("");
      }
    }
  }, [editingInvoice, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const invoiceData = {
      clientId: Number(clientId),
      amount: Number(amount),
      status: "Pendiente",
      date: new Date().toISOString().split("T")[0],
    };

    if (editingInvoice) {
      onUpdate({
        ...editingInvoice,
        ...invoiceData,
      });
    } else {
      onCreate(invoiceData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h2 className="text-xl font-semibold mb-4">
          {editingInvoice ? "Editar factura" : "Nueva factura"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* SELECT CLIENTE */}
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Selecciona cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          {/* IMPORTE */}
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Importe"
            className="border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-gray-600"
            >
              Cancelar
            </button>

            <button
              disabled={!clientId || !amount}
              className={`px-4 py-2 rounded ${
                !clientId || !amount
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {editingInvoice ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;