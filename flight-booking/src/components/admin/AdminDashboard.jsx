// src/components/admin/AdminDashboard.js
import React, { useState } from "react";
import "./admin.css";
import Sidebar from "./Sidebar";
import UserManager from "./UserManager";
import FlightManager from "./FlightManager";
import AirlineManager from "./AirlineManager";
import BookingManager from "./BookingManager";
import RouteManager from "./RouteManager";
import AirlineTicketManager from "./AirlineTicketManager"; // 1. Import Component mới
import ContentArea from "./ContentArea";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h3>Dashboard Overview</h3>
            <p>Chào mừng bạn đến với hệ thống quản trị bay.</p>
          </div>
        );
      case "users":
        return <UserManager />;
      case "flights":
        return <FlightManager />;
      case "airports":
        return <AirlineManager />;
      case "routes":
        return <RouteManager />;
      case "ticket-classes": // 2. Thêm case cho Quản lý Hạng vé
        return <AirlineTicketManager />;
      case "bookings":
        return <BookingManager />;
      default:
        return <ContentArea activeTab={activeTab} />;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
}

export default AdminDashboard;
