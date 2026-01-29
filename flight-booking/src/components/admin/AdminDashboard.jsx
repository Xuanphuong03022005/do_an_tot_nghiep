// src/components/admin/AdminDashboard.js
import React, { useState } from "react";
import "./admin.css";
import Sidebar from "./Sidebar";
import UserManager from "./UserManager";
import FlightManager from "./FlightManager";
import AirlineManager from "./AirlineManager";
import BookingManager from "./BookingManager";
import SeatClassManager from "./SeatClassManager";
import AirportsManager from "./AirportsManager";
import AirlineTicketManager from "./AirlineTicketManager";
import BaggageManagement from "./BaggageManagement";
import DiscountManager from "./DiscountManager";
// XÓA DÒNG NÀY: import ContentArea from "./ContentArea";
import DashboardCharts from "./DashboardCharts";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-view">
            <div>
              <h3>Dashboard Overview</h3>
              <p>Chào mừng bạn đến với hệ thống quản trị bay.</p>
            </div>
            <DashboardCharts />
          </div>
        );
      case "users":
        return <UserManager />;
      case "flights":
        return <FlightManager />;
      case "airports":
        return <AirlineManager />;
      case "routes":
        return <SeatClassManager />;
      case "airline":
        return <AirportsManager />;
      case "Baggage":
        return <BaggageManagement />;
      case "Discount":
        return <DiscountManager />;
      case "ticket-classes":
        return <AirlineTicketManager />;
      case "bookings":
        return <BookingManager />;
      default:
        // SỬA DÒNG NÀY: Thay vì gọi ContentArea, hãy trả về thông báo mặc định
        return <div>Chọn một mục trên thanh điều hướng.</div>;
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
