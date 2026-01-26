import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Bạn có thể thay đổi số lượng hiển thị tại đây

  const API_URL = "http://127.0.0.1:8000/api/admin/tickets";

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setBookings(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 1. Logic Lọc & Tự động ẩn vé hủy sau 24h để sạch trang quản lý
  const processedData = bookings.filter((item) => {
    // Tìm kiếm
    const matchesSearch =
      item.id.toString().includes(searchTerm) ||
      item.seat_class.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Tự động ẩn vé Hủy sau 24 giờ
    if (item.status === "Cancelled" || item.deleted_at) {
      const updateTime = new Date(item.updated_at || item.deleted_at);
      const now = new Date();
      if ((now - updateTime) / (1000 * 60 * 60) > 24) return false;
    }
    return matchesSearch;
  });

  // 2. Logic Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  // 3. Hàm hiển thị trạng thái theo yêu cầu của bạn
  const renderStatus = (ticket) => {
    // Giả lập logic dựa trên dữ liệu hiện có hoặc các trường mới từ Backend
    if (ticket.status === "Success")
      return (
        <span style={{ color: "#28a745", fontWeight: "bold" }}>Thành công</span>
      );
    if (ticket.deleted_at || ticket.status === "Cancelled") {
      return (
        <div style={{ color: "#dc3545" }}>
          <strong>Đã hủy</strong>
          <div style={{ fontSize: "11px", fontStyle: "italic" }}>
            {ticket.cancel_reason || "Quá hạn thanh toán"}
          </div>
        </div>
      );
    }
    return (
      <span style={{ color: "#ffc107", fontWeight: "bold" }}>Đang xử lý</span>
    );
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <div className="manager-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Quản lý Đơn đặt vé</h3>
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm theo ID hoặc Hạng ghế..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              width: "250px",
            }}
          />
        </div>
      </div>

      <table
        className="admin-table"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
              textAlign: "left",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <th style={{ padding: "12px" }}>ID</th>
            <th style={{ padding: "12px" }}>Hạng Ghế / Airline</th>
            <th style={{ padding: "12px" }}>Thời gian bay</th>
            <th style={{ padding: "12px" }}>Giá vé</th>
            <th style={{ padding: "12px" }}>Trạng thái</th>
            <th style={{ padding: "12px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: "#007bff",
                  }}
                >
                  #{ticket.id}
                </td>
                <td style={{ padding: "12px" }}>
                  <strong>{ticket.seat_class.name}</strong>
                  <br />
                  <small>ID: {ticket.airline_id}</small>
                </td>
                <td style={{ padding: "12px" }}>
                  {new Date(ticket.created_at).toLocaleString("vi-VN")}
                </td>
                <td style={{ padding: "12px" }}>
                  {ticket.price.toLocaleString()}đ
                </td>
                <td style={{ padding: "12px" }}>{renderStatus(ticket)}</td>
                <td style={{ padding: "12px" }}>
                  <button
                    className="btn-delete"
                    onClick={() => alert("Xóa bản ghi này")}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ padding: "20px", textAlign: "center" }}>
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Điều khiển Phân trang */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          style={{ padding: "5px 10px", cursor: "pointer" }}
        >
          Trước
        </button>
        <span style={{ alignSelf: "center" }}>
          Trang {currentPage} / {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          style={{ padding: "5px 10px", cursor: "pointer" }}
        >
          Sau
        </button>
      </div>

      <button
        onClick={fetchBookings}
        style={{ marginTop: "20px", padding: "8px 16px", cursor: "pointer" }}
      >
        Làm mới dữ liệu
      </button>
    </div>
  );
};

export default BookingManager;
