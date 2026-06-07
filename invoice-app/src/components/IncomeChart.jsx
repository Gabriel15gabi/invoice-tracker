import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IncomeChart = ({ invoices }) => {
  const grouped = {};

invoices.forEach((inv) => {
  const date = new Date(inv.date).toLocaleDateString();

  if (!grouped[date]) {
    grouped[date] = {
      date,
      ingresos: 0,
      pendientes: 0,
    };
  }

  if (inv.status === "Pagada") {
    grouped[date].ingresos += inv.amount;
  } else {
    grouped[date].pendientes += inv.amount;
  }
});

const data = Object.values(grouped).sort(
  (a, b) => new Date(a.date) - new Date(b.date)
);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Evolución de ingresos
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
  dataKey="date"
  tick={{ fontSize: 12 }}
/>
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="monotone"
            dataKey="pendientes"
            stroke="#dc2626"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;