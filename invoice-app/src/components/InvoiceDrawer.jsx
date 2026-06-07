const InvoiceDrawer = ({ invoice, onClose, clientName }) => {
  if (!invoice) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-80 max-h-[85vh] h-fit bg-white p-6 shadow-2xl rounded-2xl animate-fadeIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{clientName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Cerrar
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="space-y-4 mb-4 overflow-y-auto">
          <div>
            <p className="text-gray-400 text-xs">Importe</p>
            <p className="text-xl font-semibold">
              {invoice.amount.toLocaleString("es-ES")} €
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Estado</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                invoice.status === "Pagada"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Fecha</p>
            <p className="text-sm">
              {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="border-t my-3"></div>

        {/* ACCIONES */}
        <div className="space-y-2">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Llamar cliente
          </button>

          <button className="w-full bg-gray-100 py-2 rounded-md text-sm hover:bg-gray-200 transition">
            Enviar email
          </button>

          <button className="w-full bg-green-600 text-white py-2 rounded-md text-sm hover:bg-green-700 transition">
            Marcar como pagada
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDrawer;