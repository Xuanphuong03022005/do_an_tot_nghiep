import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
      // 1. Xóa thông tin đăng nhập khỏi localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2. Chuyển hướng về trang login (đường dẫn "/")
      navigate("/");
    }
  };

  const navItems = [
    { id: "dashboard", name: "Dashboard Tổng quan" },
    { id: "flights", name: "Quản lý Chuyến bay" },
    { id: "Baggage", name: "Quản lý hành lý" },
    { id: "routes", name: "Quản lý Hạng vé" },
    { id: "ticket-classes", name: "Quản lý vé" }, // <--- Thêm mới mục này
    { id: "airports", name: "Quản lý Máy bay" },
    { id: "airline", name: "Quản lý Sân bay" },
    { id: "bookings", name: "Quản lý Đơn đặt" },
    { id: "users", name: "Quản lý Người dùng" },
    { id: "Discount", name: "Quản lý Khuyến mãi" },
  ];

  return (
    <div className="sidebar">
      {/* Thêm onClick và style con trỏ chuột vào tiêu đề */}
      <h3
        className="sidebar-title"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
        title="Click để đăng xuất"
      >
        ✈️ Admin Panel
      </h3>
      <ul className="nav-list">
        {navItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item__adm ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
