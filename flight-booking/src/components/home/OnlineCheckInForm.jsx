import React, { useState } from "react";

// Component con cho chức năng Làm Thủ Tục
const OnlineCheckInForm = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [lastName, setLastName] = useState("");
  // State quản lý tab con (Mã Đặt Chỗ, Số Vé, Hội Viên)
  const [checkinType, setCheckinType] = useState("Mã Đặt Chỗ");

  const handleCheckin = () => {
    if (!bookingCode || !lastName) {
      alert("Vui lòng nhập Mã đặt chỗ/Số vé và Họ.");
      return;
    }
    // Logic xử lý Làm Thủ Tục (Check-in)
    console.log(
      `Đang tìm kiếm check-in: ${checkinType}, Mã: ${bookingCode}, Họ: ${lastName}`
    );
    alert(
      `Đang tiến hành Làm thủ tục với Mã: ${bookingCode} và Họ: ${lastName}`
    );
    // Ở đây bạn sẽ gọi API hoặc chuyển hướng tới trang check-in chi tiết
  };

  return (
    <div className="checkin-container">
      {/* Thông báo hướng dẫn */}
      <p className="checkin-info-text">
        Làm thủ tục trực tuyến trong khoảng **24 giờ đến 1 giờ** trước khi
        chuyến bay khởi hành
      </p>
      <p className="checkin-info-text-small">
        Vui lòng đăng nhập đúng như trên vé của bạn.
      </p>
      <p className="checkin-info-text-small note">
        Làm thủ tục trực tuyến chỉ áp dụng cho một số chặng bay nội địa và quốc
        tế nhất định.
        <a href="#">Xem chi tiết các trường hợp không áp dụng</a>
      </p>

      {/* Các tab con */}
      <div className="checkin-sub-tabs">
        {["Mã Đặt Chỗ", "Số Vé", "Số Hội Viên"].map((type) => (
          <button
            key={type}
            className={`checkin-sub-tab ${
              checkinType === type ? "active" : ""
            }`}
            onClick={() => {
              setCheckinType(type);
              setBookingCode(""); // Xóa nội dung khi chuyển loại tra cứu
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Form nhập liệu */}
      <div className="form-fields checkin-fields">
        <div className="field checkin-input-group">
          <label>{checkinType.toUpperCase()}</label>
          <input
            type="text"
            placeholder={
              checkinType === "Mã Đặt Chỗ"
                ? "123XXX"
                : checkinType === "Số Vé"
                ? "738XXXXXXXX"
                : "SỐ HỘI VIÊN"
            }
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
          />
        </div>
        <div className="field checkin-input-group">
          <label>HỌ</label>
          <input
            type="text"
            placeholder="DO"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <button onClick={handleCheckin} className="check-in-btn">
          Làm Thủ Tục
        </button>
      </div>
    </div>
  );
};

export default OnlineCheckInForm;
