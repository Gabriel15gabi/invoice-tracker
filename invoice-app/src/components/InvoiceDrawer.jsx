import { jsPDF } from "jspdf";

const InvoiceDrawer = ({ invoice, onClose, clientName }) => {
  if (!invoice) return null;

  function downloadPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const M = 18;
    const accent = [37, 99, 235]; // azul
    const gray = [120, 120, 120];

    const total = Number(invoice.amount) || 0;
    const base = total / 1.21;
    const iva = total - base;
    const eur = (n) =>
      n.toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €";

    // Banda superior
    doc.setFillColor(...accent);
    doc.rect(0, 0, W, 6, "F");

    // Emisor (izquierda)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(20, 20, 20);
    doc.text("InvoiceApp", M, 26);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text("Servicios profesionales", M, 32);

    // FACTURA + nº + fecha (derecha)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...accent);
    doc.text("FACTURA", W - M, 26, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Nº ${invoice.id}`, W - M, 33, { align: "right" });
    doc.text(
      `Fecha: ${new Date(invoice.date).toLocaleDateString("es-ES")}`,
      W - M,
      39,
      { align: "right" }
    );

    // Bloques Emisor / Cliente
    const y = 56;
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text("DE", M, y);
    doc.text("FACTURAR A", W / 2, y);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Gabriel Rodríguez", M, y + 6);
    doc.text("NIF: 00000000X", M, y + 11);
    doc.text("Mérida, España", M, y + 16);

    doc.setFont("helvetica", "bold");
    doc.text(clientName, W / 2, y + 6);
    doc.setFont("helvetica", "normal");
    const paid = invoice.status === "Pagada";
    doc.setTextColor(...(paid ? [22, 163, 74] : [202, 138, 4]));
    doc.text(`Estado: ${invoice.status}`, W / 2, y + 13);

    // Tabla de conceptos
    let ty = 92;
    doc.setFillColor(245, 246, 248);
    doc.rect(M, ty, W - 2 * M, 9, "F");
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    doc.text("CONCEPTO", M + 3, ty + 6);
    doc.text("CANT.", W - M - 62, ty + 6, { align: "right" });
    doc.text("PRECIO", W - M - 32, ty + 6, { align: "right" });
    doc.text("IMPORTE", W - M - 3, ty + 6, { align: "right" });

    ty += 16;
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Servicios profesionales", M + 3, ty);
    doc.text("1", W - M - 62, ty, { align: "right" });
    doc.text(eur(base), W - M - 32, ty, { align: "right" });
    doc.text(eur(base), W - M - 3, ty, { align: "right" });
    doc.setDrawColor(225);
    doc.line(M, ty + 5, W - M, ty + 5);

    // Totales
    let sy = ty + 18;
    const labelX = W - M - 45;
    const valX = W - M - 3;
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text("Base imponible", labelX, sy, { align: "right" });
    doc.setTextColor(40, 40, 40);
    doc.text(eur(base), valX, sy, { align: "right" });

    sy += 7;
    doc.setTextColor(90, 90, 90);
    doc.text("IVA (21%)", labelX, sy, { align: "right" });
    doc.setTextColor(40, 40, 40);
    doc.text(eur(iva), valX, sy, { align: "right" });

    sy += 4;
    doc.setDrawColor(200);
    doc.line(labelX - 8, sy, valX, sy);

    sy += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...accent);
    doc.text("TOTAL", labelX, sy, { align: "right" });
    doc.text(eur(total), valX, sy, { align: "right" });

    // Pie
    doc.setFont("helvetica", "normal");
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.5);
    doc.line(M, 275, W - M, 275);
    doc.setLineWidth(0.2);
    doc.setFontSize(8);
    doc.setTextColor(...gray);
    doc.text(
      "Forma de pago: transferencia bancaria · Vencimiento a 30 días.",
      M,
      281
    );
    doc.text("Gracias por su confianza.", M, 286);

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
