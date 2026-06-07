import { jsPDF } from "jspdf";

const InvoiceDrawer = ({ invoice, onClose, clientName }) => {
  if (!invoice) return null;

  function downloadPDF() {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("FACTURA", 20, 25);

    doc.setDrawColor(200);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Nº de factura: ${invoice.id}`, 20, 45);
    doc.text(`Cliente: ${clientName}`, 20, 55);
    doc.text(
      `Fecha: ${new Date(invoice.date).toLocaleDateString("es-ES")}`,
      20,
      65
    );
    doc.text(`Estado: ${invoice.status}`, 20, 75);

    doc.setFontSize(16);
    doc.text(
      `Importe: ${invoice.amount.toLocaleString("es-ES")} EUR`,
      20,
      95
    );

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Generado con Invoice Tracker", 20, 285);

    doc.save(`factura-${invoice.id}.pdf`);
  }

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
          <button
            onClick={downloadPDF}
            className="w-full bg-blue-600 text-white py-2 rounded-md text-sm hover:bg-blue-700 transition"
          >
            Descargar PDF
          </button>

          <button className="w-full bg-gray-100 py-2 rounded-md text-sm hover:bg-gray-200 transition">
            Enviar email
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDrawer;
