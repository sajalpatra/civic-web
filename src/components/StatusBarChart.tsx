import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function StatusBarChart({ stats }: { stats: any }) {
  const data = {
    labels: ["Draft", "Submitted", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        label: "Reports",
        data: [
          stats.draft || 0,
          stats.submitted || 0,
          stats.in_progress || 0,
          stats.resolved || 0,
          stats.closed || 0,
        ],
        backgroundColor: [
          "#9CA3AF",
          "#F59E0B",
          "#3B82F6",
          "#10B981",
          "#EF4444",
        ],
        borderColor: ["#6B7280", "#D97706", "#2563EB", "#059669", "#DC2626"],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  const totalReports = Object.values(stats).reduce(
    (a: number, b: any) => a + (Number(b) || 0),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Report Status Overview
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total reports: {totalReports}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{totalReports}</div>
          <div className="text-sm text-gray-500">Total Reports</div>
        </div>
      </div>

      <div className="h-64 mb-4">
        <Bar data={data} options={options} />
      </div>

      {/* Status Legend */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {[
          { label: "Draft", color: "#9CA3AF", count: stats.draft || 0 },
          { label: "Submitted", color: "#F59E0B", count: stats.submitted || 0 },
          {
            label: "In Progress",
            color: "#3B82F6",
            count: stats.in_progress || 0,
          },
          { label: "Resolved", color: "#10B981", count: stats.resolved || 0 },
          { label: "Closed", color: "#EF4444", count: stats.closed || 0 },
        ].map(({ label, color, count }) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="w-4 h-4 rounded-full mb-1"
              style={{ backgroundColor: color }}
            ></div>
            <div className="text-xs font-medium text-gray-900">{count}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
