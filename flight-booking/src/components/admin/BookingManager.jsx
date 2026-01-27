import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

// Khai báo các URL API
const API_URL_ALL = "http://127.0.0.1:8000/api/admin/bookings"; // API lấy tất cả để hiển thị bảng
const API_STATUS_URL = "http://127.0.0.1:8000/api/admin/change-status-booking";

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 1. Tải danh sách đơn hàng ban đầu
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL_ALL);
      // Dựa vào cấu trúc API bạn cung cấp, dữ liệu nằm trong response.data.data
      const data = response.data.data || response.data;
      setBookings(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Tải chi tiết đơn hàng (bao gồm nhiều vé) khi click "Kiểm tra đơn"
  const handleViewDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admin/booking-pending/${id}`
      );
      setSelectedBooking(response.data);
      setShowModal(true);
    } catch (error) {
      alert("Lỗi tải chi tiết đơn hàng!");
    }
  };

  // 3. Hàm cập nhật trạng thái (Duyệt/Từ chối)
  const handleUpdateStatus = async (id, newStatus) => {
    const actionText = newStatus === "success" ? "DUYỆT" : "TỪ CHỐI";
    const confirmMsg = `Bạn có chắc chắn muốn ${actionText} đơn hàng ${id} này không?`;

    if (window.confirm(confirmMsg)) {
      try {
        await axios.put(`${API_STATUS_URL}/${id}`, {
          status: newStatus,
        });
        alert(`${actionText} đơn hàng thành công!`);
        setShowModal(false);
        fetchBookings(); // Reload lại bảng chính
      } catch (error) {
        console.error("Lỗi cập nhật:", error);
        alert("Đã có lỗi xảy ra khi cập nhật trạng thái!");
      }
    }
  };

  if (loading)
    return (
      <div style={{ padding: "20px" }}>Đang kết nối dữ liệu hệ thống...</div>
    );

  return (
    <div
      className="manager-container"
      style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}
    >
      <h3>Quản lý Đặt vé & Đối soát đơn hàng</h3>

      <table
        className="admin-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
              textAlign: "left",
            }}
          >
            <th style={{ padding: "12px" }}>ID / PNR</th>
            <th style={{ padding: "12px" }}>KHÁCH HÀNG</th>
            <th style={{ padding: "12px" }}>TỔNG TIỀN</th>
            <th style={{ padding: "12px" }}>TRẠNG THÁI</th>
            <th style={{ padding: "12px" }}>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "12px" }}>
                <strong>{item.id}</strong> <br />
                <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                  {item.pnr_code}
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                {item.user?.name} <br />
                <small>{item.user?.phone}</small>
              </td>
              <td
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  color: "#d4380d",
                }}
              >
                {parseInt(item.total_final).toLocaleString()}đ
              </td>
              <td style={{ padding: "12px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    backgroundColor:
                      item.status === "success" ? "#f6ffed" : "#fff7e6",
                    color: item.status === "success" ? "#52c41a" : "#faad14",
                    border: `1px solid ${
                      item.status === "success" ? "#b7eb8f" : "#ffe58f"
                    }`,
                  }}
                >
                  ● {item.status === "success" ? "Đã thanh toán" : "Chờ duyệt"}
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => handleViewDetail(item.id)}
                  style={{
                    backgroundColor: "#1890ff",
                    color: "white",
                    border: "none",
                    padding: "6px 15px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Kiểm tra đơn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Chi tiết & Đối soát */}
      {showModal && selectedBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "850px",
              maxWidth: "95%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>
                Đối soát mã PNR: {selectedBooking.pnr_code}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>
            </div>
            <hr style={{ margin: "15px 0", border: "0.5px solid #eee" }} />

            <div style={{ display: "flex", gap: "30px" }}>
              {/* CỘT 1: THÔNG TIN THANH TOÁN */}
              <div style={{ flex: 1 }}>
                <h4 style={{ color: "#555" }}>1. Bằng chứng thanh toán</h4>
                <div
                  style={{
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                  }}
                >
                  <p>
                    <strong>Số tiền khớp lệnh:</strong>{" "}
                    <span style={{ color: "#f5222d", fontSize: "18px" }}>
                      {parseInt(selectedBooking.total_final).toLocaleString()}đ
                    </span>
                  </p>
                  <p>
                    <strong>Phương thức:</strong> Chuyển khoản ngân hàng
                  </p>
                  <div style={{ marginTop: "15px", textAlign: "center" }}>
                    {selectedBooking.payments?.[0]?.image ? (
                      <img
                        src={selectedBooking.payments[0].image}
                        alt="Bill thanh toán"
                        style={{
                          width: "100%",
                          borderRadius: "8px",
                          border: "2px solid #eee",
                          maxHeight: "350px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          padding: "40px",
                          border: "2px dashed #ccc",
                          color: "#999",
                        }}
                      >
                        Khách chưa gửi ảnh bill
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CỘT 2: CHI TIẾT CÁC VÉ TRONG PNR */}
              <div style={{ flex: 1.2 }}>
                <h4 style={{ color: "#555" }}>
                  2. Chi tiết danh sách vé (
                  {selectedBooking.booking_tickets?.length || 0} vé)
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {selectedBooking.booking_tickets?.map((ticket, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid #e8e8e8",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "5px",
                        }}
                      >
                        <span style={{ fontWeight: "bold", color: "#1890ff" }}>
                          Hành khách: {ticket.passenger?.name || "N/A"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            backgroundColor: "#e6f7ff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {ticket.type === "outbound"
                            ? "Chuyến đi"
                            : "Chuyến về"}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        <div>
                          <strong>Chuyến bay:</strong>{" "}
                          {ticket.flight?.flight_number}
                        </div>
                        <div>
                          <strong>Hành trình:</strong>{" "}
                          {ticket.flight?.departure_airport?.name} &rarr;{" "}
                          {ticket.flight?.arrival_airport?.name}
                        </div>
                        <div>
                          <strong>Hạng ghế:</strong>{" "}
                          {ticket.seat_class?.name || "Hạng phổ thông"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* NÚT THAO TÁC XỬ LÝ */}
            <div
              style={{
                textAlign: "right",
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #eee",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>

              {selectedBooking.status !== "success" && (
                <>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.id, "cancelled")
                    }
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Từ chối đơn
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedBooking.id, "success")
                    }
                    style={{
                      backgroundColor: "#52c41a",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Duyệt & Xuất tất cả vé
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;
