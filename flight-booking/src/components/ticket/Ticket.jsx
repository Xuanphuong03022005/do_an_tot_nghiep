// src/components/ticket/Ticket.jsx

import React, { useState, useEffect } from "react";
import Banner from "../flightInfo/Banner";
import MyTicket from "./MyTicket";

const Ticket = (props) => {
  const { flightData } = props;
  const [myTickets, setMyTickets] = useState([]);

  // Hàm đọc dữ liệu từ LocalStorage
  const loadTickets = () => {
    const storedTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
    setMyTickets(storedTickets);
  };

  useEffect(() => {
    // Chạy khi component mount
    loadTickets();
  }, []);

  // ✅ VỊ TRÍ ĐẶT LỆNH XÓA VÉ CỤ THỂ
  // const handleClearTickets = () => {
  //   if (window.confirm("Bạn có chắc chắn muốn xóa TẤT CẢ vé đã đặt không?")) {
  //     // 1. Thực hiện lệnh xóa dữ liệu khỏi localStorage
  //     localStorage.removeItem("myTickets");

  //     // 2. Cập nhật state hiển thị về mảng rỗng ngay lập tức
  //     setMyTickets([]);

  //     alert("Đã xóa toàn bộ vé!");
  //     console.log("Đã xóa toàn bộ danh sách vé (myTickets).");
  //   }
  // };
  // ----------------------------------------------------

  return (
    <div>
      <Banner />

      {/* Thêm nút Xóa vé tại đây */}
      {/* <div style={{ textAlign: "center", margin: "20px 0" }}>
        {myTickets.length > 0 && (
          <button
            onClick={handleClearTickets}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Xóa tất cả vé đã đặt
          </button>
        )}
      </div> */}

      <MyTicket
        tickets={myTickets}
        onSelect={(t) => console.log("Vé đã chọn:", t)}
        onGoToBooking={() => console.log("Chuyển hướng đến trang đặt vé.")}
      />
    </div>
  );
};

export default Ticket;
