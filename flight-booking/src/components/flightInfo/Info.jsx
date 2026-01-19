import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./flightInfo.css";

const Info = () => {
  const location = useLocation();
  const [openTicket, setOpenTicket] = useState(null);
  const navigate = useNavigate();
  // 1. NHẬN DỮ LIỆU TỪ BACKEND (Theo cấu trúc { outbound: [], return: [] })
  const outboundRaw = location.state?.flightResults || []; // Chuyến đi
  const returnRaw = location.state?.returnFlights || []; // Chuyến về
  const searchData = location.state?.searchData;

  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);

  // Lưu vé đã chọn để tổng hợp cuối cùng
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const airportMap = {
    TSN: "Tân Sơn Nhất",
    ĐN: "Đà Nẵng",
    HAN: "Hà Nội",
  };
  // 2. FORMAT DỮ LIỆU (Hàm dùng chung cho cả 2 chiều)
  const formatFlightData = (flights) => {
    return flights.map((f) => ({
      id: f.id,
      from: f.departure_airport?.code || "N/A",
      to: f.arrival_airport?.code || "N/A",
      depart: f.departure_time?.split(" ")[1]?.substring(0, 5) || "00:00",
      arrive: f.arrival_time?.split(" ")[1]?.substring(0, 5) || "00:00",
      duration: "1h 30m",
      flightCode: f.flight_number,
      airline: f.airline?.name || "Bamboo Airways",
      classes: [
        { type: "Economy Basic", price: 893000 },
        { type: "Economy Flex", price: 1182500 },
        { type: "Business Basic", price: 2250000 },
        { type: "Business Flex", price: 3250000 },
      ],
    }));
  };

  useEffect(() => {
    setOutboundFlights(formatFlightData(outboundRaw));
    setReturnFlights(formatFlightData(returnRaw));
  }, [outboundRaw, returnRaw]);

  const classDetails = {
    "Economy Basic": ["7kg xách tay", "Không hoàn vé", "Không chọn ghế"],
    "Economy Flex": ["7kg xách tay", "20kg ký gửi", "Được chọn ghế"],
    "Business Basic": ["10kg xách tay", "40kg ký gửi", "Ưu tiên làm thủ tục"],
    "Business Flex": ["10kg xách tay", "40kg ký gửi", "Ưu tiên làm thủ tục"],
  };

  const toggleOpen = (flightId, groupType, direction) => {
    if (
      openTicket?.flightId === flightId &&
      openTicket?.groupType === groupType
    ) {
      setOpenTicket(null);
    } else {
      setOpenTicket({ flightId, groupType, direction });
    }
  };

  // 3. XỬ LÝ CHỌN VÉ
  const handleSelectTicket = (flight, subClass, direction) => {
    const selection = { ...flight, selectedClass: subClass };

    if (direction === "outbound") {
      setSelectedOutbound(selection);
      alert(`Đã chọn chiều đi: ${flight.flightCode}`);
    } else {
      setSelectedReturn(selection);
      alert(`Đã chọn chiều về: ${flight.flightCode}`);
    }
    setOpenTicket(null);
  };

  const saveToLocalStorage = () => {
    if (!selectedOutbound) return alert("Vui lòng chọn chiều đi");
    if (returnFlights.length > 0 && !selectedReturn)
      return alert("Vui lòng chọn chiều về");

    // Tạo danh sách vé mới để đẩy vào MyTicket
    const newTickets = [];

    // 1. Xử lý Chiều đi
    newTickets.push({
      id: `OUT-${Date.now()}`,
      from: selectedOutbound.from,
      to: selectedOutbound.to,
      date: searchData.depart, // Lấy từ form tìm kiếm
      depart: selectedOutbound.depart,
      arrive: selectedOutbound.arrive,
      type: selectedOutbound.selectedClass.type,
      price: selectedOutbound.selectedClass.price,
      flightCode: selectedOutbound.flightCode,
      airline: selectedOutbound.airline,
      duration: selectedOutbound.duration,
      gateFrom: "Nhà ga 1", // Giả lập
      gateTo: "Nhà ga 2", // Giả lập
    });

    // 2. Xử lý Chiều về (nếu có)
    if (selectedReturn) {
      newTickets.push({
        id: `RET-${Date.now()}`,
        from: selectedReturn.from,
        to: selectedReturn.to,
        date: searchData.returnDate,
        depart: selectedReturn.depart,
        arrive: selectedReturn.arrive,
        type: selectedReturn.selectedClass.type,
        price: selectedReturn.selectedClass.price,
        flightCode: selectedReturn.flightCode,
        airline: selectedReturn.airline,
        duration: selectedReturn.duration,
        gateFrom: "Nhà ga 2",
        gateTo: "Nhà ga 1",
      });
    }

    // Lấy vé cũ từ local và cộng thêm vé mới
    const existingTickets = JSON.parse(localStorage.getItem("myTickets")) || [];
    localStorage.setItem(
      "myTickets",
      JSON.stringify([...existingTickets, ...newTickets])
    );

    alert("✅ Đã đặt vé thành công! Đang chuyển đến trang vé của tôi...");
    navigate("/my-ticket"); // Chuyển hướng người dùng
  };

  // component render danh sách chuyến bay
  const renderFlightList = (flights, direction) => (
    <div className="flight-list">
      {flights.map((f) => (
        <div
          className={`flight-card ${
            (direction === "outbound" ? selectedOutbound : selectedReturn)
              ?.id === f.id
              ? "selected-border"
              : ""
          }`}
          key={f.id}
        >
          <div className="flight-main-info">
            <div className="time-block">
              <span className="time-val">{f.depart}</span>
              <div className="path-line">
                <span className="dot"></span>
                <span className="line">➜</span>
                <span className="dot"></span>
              </div>
              <span className="time-val">{f.arrive}</span>
            </div>
            <div className="route-detail">
              <p className="codes">
                {f.from} ➜ {f.to}
              </p>
              <p className="airline-name">
                {f.airline} • {f.flightCode}
              </p>
            </div>
          </div>

          <div className="ticket-wrapper">
            <div className="price-section">
              {["Economy", "Business"].map((groupType) => {
                const subClasses = f.classes.filter((c) =>
                  c.type.includes(groupType)
                );
                const minPrice = Math.min(...subClasses.map((c) => c.price));
                const isOpen =
                  openTicket?.flightId === f.id &&
                  openTicket?.groupType === groupType &&
                  openTicket?.direction === direction;

                return (
                  <div
                    key={groupType}
                    className={`ticket-group ${groupType.toLowerCase()} ${
                      isOpen ? "active" : ""
                    }`}
                    onClick={() => toggleOpen(f.id, groupType, direction)}
                  >
                    <div className="group-header">
                      <p className="class-label">{groupType}</p>
                      <p className="price-val">
                        từ {minPrice.toLocaleString()} <span>VND</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {openTicket?.flightId === f.id &&
              openTicket?.direction === direction && (
                <div className="accordion-content open">
                  {f.classes
                    .filter((c) => c.type.includes(openTicket.groupType))
                    .map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="subclass-card"
                        onClick={() => handleSelectTicket(f, sub, direction)}
                      >
                        <div className="sub-header">
                          <h4>{sub.type}</h4>
                          <span className="sub-price">
                            {sub.price.toLocaleString()} VND
                          </span>
                        </div>
                        <ul>
                          {classDetails[sub.type]?.map((d, i) => (
                            <li key={i}>✓ {d}</li>
                          ))}
                        </ul>
                        {/* <button className="btn-select">Chọn vé</button> */}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flight-container">
      {/* Thanh tóm tắt */}
      <div className="search-info-bar">
        <div className="search-summary">
          {/* Phần hiển thị tiêu đề hành trình */}
          <div className="route-header">
            <h3
              style={{ fontSize: "24px", fontWeight: "bold", color: "#005aab" }}
            >
              {searchData?.from} ✈ {searchData?.to}
              <span
                style={{ fontSize: "16px", color: "#666", marginLeft: "10px" }}
              >
                {returnFlights.length > 0 ? "(Khứ hồi)" : "(Một chiều)"}
              </span>
            </h3>
            <p style={{ fontSize: "18px", color: "#333" }}>
              {airportMap[searchData?.from] || "Điểm đi"} đến{" "}
              {airportMap[searchData?.to] || "Điểm đến"}
            </p>
          </div>

          {/* Phần chi tiết các chặng bay */}
          <div
            className="journey-grid"
            style={{ display: "flex", gap: "40px", marginTop: "10px" }}
          >
            {/* Chi tiết chiều đi */}
            <div className="journey-item">
              <p>
                <b>Khởi hành</b>
              </p>
              <p>{searchData?.depart || "Chọn ngày"}</p>
              <p
                style={{
                  fontSize: "12px",
                  color: selectedOutbound ? "#28a745" : "#ffc107",
                  fontWeight: "bold",
                }}
              >
                {selectedOutbound
                  ? `✓ ${selectedOutbound.flightCode}`
                  : "(Chưa chọn)"}
              </p>
            </div>

            {/* Chi tiết chiều về - Chỉ hiện nếu có dữ liệu chuyến về */}
            {returnFlights.length > 0 && (
              <>
                <div
                  className="separator"
                  style={{ borderLeft: "1px solid #ccc", height: "40px" }}
                ></div>
                <div className="journey-item">
                  <p>
                    <b>Trở về</b>
                  </p>
                  <p>{searchData?.returnDate || "Chưa chọn ngày"}</p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: selectedReturn ? "#28a745" : "#ffc107",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedReturn
                      ? `✓ ${selectedReturn.flightCode}`
                      : "(Chưa chọn)"}
                  </p>
                </div>
              </>
            )}

            <div
              className="separator"
              style={{ borderLeft: "1px solid #ccc", height: "40px" }}
            ></div>

            <div className="journey-item">
              <p>
                <b>Hành khách</b>
              </p>
              <p>{searchData?.passengers || 1} 👤</p>
            </div>
          </div>
        </div>

        {/* Nút xác nhận chỉ hiện khi đã chọn đủ vé */}
        {selectedOutbound && (returnFlights.length === 0 || selectedReturn) && (
          <button
            className="confirm-booking-btn"
            onClick={saveToLocalStorage}
            style={{
              backgroundColor: "#e9ad13",
              color: "white",
              padding: "12px 25px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Tiếp tục đặt chỗ
          </button>
        )}
      </div>

      {/* Hiển thị Chiều đi */}
      <h2 className="direction-title">
        ✈ Chiều đi: {searchData?.from} ➜ {searchData?.to}
      </h2>
      {renderFlightList(outboundFlights, "outbound")}

      {/* Hiển thị Chiều về (nếu có) */}
      {returnFlights.length > 0 && (
        <>
          <hr className="divider" />
          <h2 className="direction-title">
            ✈ Chiều về: {searchData?.to} ➜ {searchData?.from}
          </h2>
          {renderFlightList(returnFlights, "return")}
        </>
      )}
    </div>
  );
};

export default Info;
