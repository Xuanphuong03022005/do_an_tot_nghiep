import React from "react";
// Import các component quản lý chi tiết (chúng ta sẽ định nghĩa 1 ví dụ)
import FlightManager from "./FlightManager";
import "./admin.css";
function ContentArea({ activeTab }) {
  // Hàm hiển thị component dựa trên tab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h3>Tổng quan</h3>
            <p>
              Thống kê nhanh về số lượng vé đã đặt, doanh thu, và số lượng
              chuyến bay.
            </p>
          </div>
        );

      case "flights":
        // Component quản lý chuyến bay sẽ tương tác với bảng 'flights', 'tickets', 'seats'
        return <FlightManager />;

      case "bookings":
        return (
          <div>
            <h3>Quản lý Đơn đặt</h3>
            <p>Danh sách các đơn hàng, trạng thái (bookings, payments).</p>
          </div>
        );

      case "airlines":
        // Quản lý thông tin Hãng bay (arilines)
        return (
          <div>
            <h3>Quản lý Hãng bay</h3>
            <p>Thêm/Sửa/Xóa thông tin hãng bay (name, code, image).</p>
          </div>
        );

      case "airports":
        // Quản lý thông tin Sân bay (ariports)
        return (
          <div>
            <h3>Quản lý Sân bay</h3>
            <p>Thêm/Sửa/Xóa thông tin sân bay (name, city, country, code).</p>
          </div>
        );

      case "users":
        return (
          <div>
            <h3>Quản lý Người dùng</h3>
            <p>Danh sách tài khoản người dùng (users).</p>
          </div>
        );

      case "passengers":
        return (
          <div>
            <h3>Quản lý Hành khách</h3>
            <p>Danh sách thông tin hành khách (passengers).</p>
          </div>
        );

      case "discounts":
        return (
          <div>
            <h3>Quản lý Khuyến mãi</h3>
            <p>Tạo, kích hoạt, hoặc vô hiệu hóa mã giảm giá (discounts).</p>
          </div>
        );

      case "baggage":
        return (
          <div>
            <h3>Quản lý Hành lý</h3>
            <p>Thiết lập quy tắc hành lý (baggage_rules, baggage_packages).</p>
          </div>
        );

      default:
        return <div>Chọn một mục trên thanh điều hướng.</div>;
    }
  };

  return <div style={{ marginTop: "20px" }}>{renderContent()}</div>;
}

export default ContentArea;
