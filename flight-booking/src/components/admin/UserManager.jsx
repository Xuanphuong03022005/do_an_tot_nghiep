import React, { useState, useEffect } from "react";
import authApi from "../api/authApi";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchUsers = async (email = "") => {
    setLoading(true);
    try {
      const res = await authApi.getAllUsers(email);
      // axiosClient đã bóc tách response.data nên res là dữ liệu thực tế
      const finalData = res.data || res || [];
      setUsers(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const viewHistory = async (userId) => {
    try {
      const res = await authApi.getUserHistory(userId);
      setHistory(res.data || res || []);
      setShowModal(true);
    } catch (err) {
      alert("Người dùng này chưa có lịch sử đặt vé.");
    }
  };

  if (loading)
    return <div className="p-4 text-center">Đang kết nối hệ thống...</div>;

  return (
    <div
      className="manager-container"
      style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "8px" }}
    >
      <div
        className="header-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ margin: 0 }}>Quản lý người dùng hệ thống</h3>
        <form onSubmit={handleSearch} style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Tìm theo email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px 0 0 4px",
              width: "250px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "0 4px 4px 0",
              cursor: "pointer",
            }}
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      <table width="100%" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #dee2e6",
            }}
          >
            <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
            <th style={{ padding: "12px", textAlign: "left" }}>
              Tên hành khách
            </th>
            <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
            {/* Thêm tiêu đề cột mới */}
            <th style={{ padding: "12px", textAlign: "left" }}>
              Số điện thoại
            </th>
            <th style={{ padding: "12px", textAlign: "left" }}>Địa chỉ</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{user.id}</td>
                <td style={{ padding: "12px" }}>
                  <strong>{user.name}</strong>
                </td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                {/* Hiển thị dữ liệu Phone và Address */}
                <td style={{ padding: "12px" }}>{user.phone || "N/A"}</td>
                <td
                  style={{
                    padding: "12px",
                    maxWidth: "200px",
                    wordBreak: "break-word",
                  }}
                >
                  {user.address || "N/A"}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    onClick={() => viewHistory(user.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    Lịch sử bay
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ padding: "30px", textAlign: "center" }}>
                Không có dữ liệu. Hãy kiểm tra Route Laravel (404).
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h4>Lịch sử đặt vé</h4>
            <table
              width="100%"
              border="1"
              style={{ borderCollapse: "collapse", marginTop: "10px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th>Chuyến bay</th>
                  <th>Ghế</th>
                  <th>Ngày đặt</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((h, i) => (
                    <tr key={i}>
                      <td style={{ padding: "8px" }}>{h.flight_number}</td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        {h.seat_position}
                        {h.row_number}
                      </td>
                      <td style={{ padding: "8px" }}>{h.created_at}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{ padding: "10px", textAlign: "center" }}
                    >
                      Chưa có lịch sử bay
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div style={{ textAlign: "right", marginTop: "15px" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;
