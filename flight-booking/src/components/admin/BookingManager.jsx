import React, { useState } from "react";
import "./admin.css";

const BookingManager = () => {
  const [bookings, setBookings] = useState([
    {
      id: 101,
      pnr_code: "ABCDEF",
      customer_name: "Nguyen Van A",
      status: "Booked",
      total_amount: 3000000,
    },
    {
      id: 102,
      pnr_code: "GHIJKL",
      customer_name: "Tran Thi B",
      status: "Paid",
      total_amount: 2400000,
    },
    {
      id: 103,
      pnr_code: "MNOPQR",
      customer_name: "Le Van C",
      status: "Cancelled",
      total_amount: 1500000,
    },
    {
      id: 104,
      pnr_code: "STUVWX",
      customer_name: "Hoang Thi D",
      status: "Paid",
      total_amount: 5200000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [formData, setFormData] = useState({
    pnr_code: "",
    customer_name: "",
    total_amount: 0,
    status: "Booked",
  });

  // Logic lọc danh sách theo mã PNR
  const filteredBookings = bookings.filter((booking) =>
    booking.pnr_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#28a745";
      case "Booked":
        return "#ffc107";
      case "Cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const handleOpenModal = (booking = null) => {
    if (booking) {
      setEditingBooking(booking);
      setFormData(booking);
    } else {
      setEditingBooking(null);
      setFormData({
        pnr_code: "",
        customer_name: "",
        total_amount: 0,
        status: "Booked",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBooking) {
      setBookings(
        bookings.map((b) => (b.id === editingBooking.id ? { ...formData } : b))
      );
    } else {
      setBookings([...bookings, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đơn đặt này?")) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

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

        {/* Thanh tìm kiếm */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm theo mã PNR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              width: "250px",
              outline: "none",
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
            <th style={{ padding: "12px" }}>Mã PNR</th>
            <th style={{ padding: "12px" }}>Khách hàng</th>
            <th style={{ padding: "12px" }}>Tổng tiền</th>
            <th style={{ padding: "12px" }}>Trạng thái</th>
            <th style={{ padding: "12px" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <tr key={booking.id} style={{ borderBottom: "1px solid #eee" }}>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: "#007bff",
                  }}
                >
                  {booking.pnr_code}
                </td>
                <td style={{ padding: "12px" }}>{booking.customer_name}</td>
                <td style={{ padding: "12px" }}>
                  {booking.total_amount.toLocaleString()}đ
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      backgroundColor: getStatusColor(booking.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {booking.status}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(booking.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                style={{ padding: "20px", textAlign: "center", color: "#999" }}
              >
                Không tìm thấy đơn hàng nào với mã PNR:{" "}
                <strong>{searchTerm}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL FORM (Giữ nguyên) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{editingBooking ? "Cập nhật đơn hàng" : "Tạo đơn hàng mới"}</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã PNR:</label>
                <input
                  type="text"
                  value={formData.pnr_code}
                  onChange={(e) =>
                    setFormData({ ...formData, pnr_code: e.target.value })
                  }
                  required
                />
                <label>Tên khách hàng:</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  required
                />
                <label>Tổng tiền (VNĐ):</label>
                <input
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_amount: parseInt(e.target.value),
                    })
                  }
                  required
                />
                <label>Trạng thái:</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Booked">Booked</option>
                  <option value="Paid">Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
