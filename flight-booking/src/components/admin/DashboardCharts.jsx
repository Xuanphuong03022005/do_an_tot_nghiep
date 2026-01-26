import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Đăng ký các thành phần ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const DashboardCharts = () => {
  // DỮ LIỆU MẪU: Thống kê doanh thu theo ngày
  const dailyData = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Doanh thu ngày (VNĐ)",
        data: [
          12000000, 19000000, 15000000, 25000000, 22000000, 30000000, 45000000,
        ],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // DỮ LIỆU MẪU: Thống kê hãng bay hoạt động nhiều nhất
  const airlineData = {
    labels: ["Vietnam Airlines", "Vietjet Air", "Bamboo Airways"],
    datasets: [
      {
        data: [45, 38, 20],
        backgroundColor: ["#1e3a8a", "#dc2626", "#059669"],
      },
    ],
  };

  // DỮ LIỆU MẪU: Hạng vé được mua nhiều nhất
  const classData = {
    labels: ["Phổ thông", "Thương gia", "Hạng nhất"],
    datasets: [
      {
        label: "Số lượng vé",
        data: [1200, 300, 50],
        backgroundColor: ["#fbbf24", "#8b5cf6", "#ec4899"],
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false };

  return (
    <div
      className="dashboard-charts-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div className="chart-card shadow">
        <h4>Doanh thu 7 ngày gần nhất</h4>
        <div style={{ height: "300px" }}>
          <Line data={dailyData} options={options} />
        </div>
      </div>
      <div className="chart-card shadow">
        <h4>Tần suất hoạt động hãng bay</h4>
        <div style={{ height: "300px" }}>
          <Doughnut data={airlineData} options={options} />
        </div>
      </div>
      <div className="chart-card shadow" style={{ gridColumn: "span 2" }}>
        <h4>Hạng vé phổ biến</h4>
        <div style={{ height: "300px" }}>
          <Bar data={classData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
