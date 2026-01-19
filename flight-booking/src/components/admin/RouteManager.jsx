import React, { useState } from "react";

function RouteManager() {
  // Dữ liệu mẫu Tuyến bay
  const [routes, setRoutes] = useState([
    {
      id: 1,
      departure_airport: "Nội Bài (HAN)",
      arrival_airport: "Tân Sơn Nhất (SGN)",
      duration: "2h 10m",
      status: "Active",
    },
    {
      id: 2,
      departure_airport: "Tân Sơn Nhất (SGN)",
      arrival_airport: "Đà Nẵng (DAD)",
      duration: "1h 20m",
      status: "Active",
    },
    {
      id: 3,
      departure_airport: "Cát Bi (HPH)",
      arrival_airport: "Phú Quốc (PQC)",
      duration: "2h 05m",
      status: "Inactive",
    },
  ]);

  return (
    <div className="manager-container">
      <div className="flex justify-between items-center mb-4">
        <h3>Quản lý Tuyến bay (Routes)</h3>
        <button
          className="btn-add"
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Thêm tuyến mới
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sân bay đi</th>
            <th>Sân bay đến</th>
            <th>Thời gian bay dự kiến</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td style={{ fontWeight: "bold" }}>{route.departure_airport}</td>
              <td style={{ fontWeight: "bold" }}>{route.arrival_airport}</td>
              <td>{route.duration}</td>
              <td>
                <span
                  className={`badge-status ${route.status.toLowerCase()}`}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    backgroundColor:
                      route.status === "Active" ? "#d4edda" : "#f8d7da",
                    color: route.status === "Active" ? "#155724" : "#721c24",
                  }}
                >
                  {route.status === "Active" ? "Hoạt động" : "Tạm dừng"}
                </span>
              </td>
              <td>
                <button
                  className="btn-edit"
                  style={{
                    marginRight: "10px",
                    color: "#007bff",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sửa
                </button>
                <button
                  className="btn-delete"
                  style={{
                    color: "#dc3545",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RouteManager;
