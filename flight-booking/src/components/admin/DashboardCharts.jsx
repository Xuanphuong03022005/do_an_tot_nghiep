import React, { useState, useEffect } from "react";
import axios from "axios"; // Hoặc authApi của bạn
import { Line, Bar, Doughnut } from "react-chartjs-2";
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
  const [chartData, setChartData] = useState({
    dailyRevenue: null,
    aircraftActivity: null,
    ticketClass: null,
  });
  const [loading, setLoading] = useState(true);

  // DashboardCharts.js
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Thêm http://localhost:8000 vào trước để trỏ đúng sang máy chủ Laravel
        const [resDate, resAircraft, resClass] = await Promise.all([
          axios.get(
            "http://localhost:8000/api/admin/dashboard/revenue-by-date?type=daily"
          ),
          axios.get(
            "http://localhost:8000/api/admin/dashboard/revenue-by-aircraft"
          ),
          axios.get(
            "http://localhost:8000/api/admin/dashboard/revenue-by-class"
          ),
        ]);

        // Kiểm tra nếu có dữ liệu mới xử lý để tránh lỗi .map() của undefined
        if (resDate.data.revenueByDate?.data) {
          const dailyLabels = resDate.data.revenueByDate.data.map(
            (item) => item.time
          );
          const dailyValues = resDate.data.revenueByDate.data.map(
            (item) => item.revenue
          );

          setChartData((prev) => ({
            ...prev,
            dailyRevenue: {
              labels: dailyLabels,
              datasets: [
                {
                  label: "Doanh thu (VNĐ)",
                  data: dailyValues,
                  borderColor: "#3b82f6",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
          }));
        }

        if (Array.isArray(resAircraft.data?.revenueByAircraft)) {
          const aircraftLabels = resAircraft.data.revenueByAircraft.map(
            (item) => item.flight_number || "N/A" // Sửa ở đây
          );
          const aircraftValues = resAircraft.data.revenueByAircraft.map(
            (item) => item.sold_seats || 0
          );

          setChartData((prev) => ({
            ...prev,
            aircraftActivity: {
              labels: aircraftLabels,
              datasets: [
                {
                  data: aircraftValues,
                  backgroundColor: ["#1e3a8a", "#dc2626", "#059669", "#fbbf24"],
                },
              ],
            },
          }));
        }

        if (resClass.data.revenueByTicketClass) {
          const classLabels = resClass.data.revenueByTicketClass.map(
            (item) => item.ticket_class
          );
          const classValues = resClass.data.revenueByTicketClass.map(
            (item) => item.sold_seats
          );

          setChartData((prev) => ({
            ...prev,
            ticketClass: {
              labels: classLabels,
              datasets: [
                {
                  label: "Số lượng vé",
                  data: classValues,
                  backgroundColor: ["#fbbf24", "#8b5cf6", "#ec4899"],
                },
              ],
            },
          }));
        }
      } catch (error) {
        console.error("Lỗi API chi tiết:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const options = { responsive: true, maintainAspectRatio: false };

  if (loading) return <div>Đang tải biểu đồ thống kê...</div>;

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
        <h4>Doanh thu theo thời gian</h4>
        <div style={{ height: "300px" }}>
          {chartData.dailyRevenue && (
            <Line data={chartData.dailyRevenue} options={options} />
          )}
        </div>
      </div>

      <div className="chart-card shadow">
        <h4>Tỉ lệ vé theo máy bay (Mã tàu bay)</h4>
        <div style={{ height: "300px" }}>
          {chartData.aircraftActivity && (
            <Doughnut data={chartData.aircraftActivity} options={options} />
          )}
        </div>
      </div>

      <div className="chart-card shadow" style={{ gridColumn: "span 2" }}>
        <h4>Thống kê lượng vé theo hạng ghế</h4>
        <div style={{ height: "300px" }}>
          {chartData.ticketClass && (
            <Bar data={chartData.ticketClass} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
