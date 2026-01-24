// src/components/layout/Sidebar.jsx
import React from "react";
import "./admin.css";

const navItems = [
  { id: "dashboard", name: "Dashboard Tổng quan" },
  { id: "flights", name: "Quản lý Chuyến bay" },
  { id: "ticket-classes", name: "Quản lý vé" }, // <--- Thêm mới mục này

  { id: "bookings", name: "Quản lý Đơn đặt" },
  { id: "routes", name: "Quản lý Hạng vé" },
  { id: "airports", name: "Quản lý Máy bay" },
  { id: "users", name: "Quản lý Người dùng" },
  { id: "discounts", name: "Quản lý Khuyến mãi" },
];

function Sidebar({ setActiveTab, activeTab }) {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">✈️ Admin Panel</h3>
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
}

export default Sidebar;
