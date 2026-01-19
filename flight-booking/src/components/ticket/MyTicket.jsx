import React, { useState, useEffect } from "react";
import "./ticket.css";
import { useNavigate } from "react-router-dom";

const MyTicket = ({ tickets = [], onSelect, onGoToBooking }) => {
  const navigate = useNavigate();
  const [openTicketId, setOpenTicketId] = useState(null);
  const [classDetails, setClassDetails] = useState({});
  const [localTickets, setLocalTickets] = useState([]);
  useEffect(() => {
    const storedDetails = localStorage.getItem("classDetails");
    if (storedDetails) {
      try {
        setClassDetails(JSON.parse(storedDetails));
      } catch (e) {
        console.error("Lỗi khi đọc classDetails từ localStorage:", e);
        setClassDetails({});
      }
    }
  }, []);

  const toggleDetails = (ticketId) => {
    setOpenTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  const totalBookingPrice = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
  const totalDisplayPrice = totalBookingPrice || 5032000;

  if (!tickets || tickets.length === 0) {
    return (
      <div className="no-tickets-suggestion">
        <p className="suggestion-text">✈️ Hiện bạn chưa có vé nào được đặt.</p>
        <p className="suggestion-subtext">
          Hãy tìm kiếm và chọn chuyến bay bạn yêu thích để bắt đầu hành trình!
        </p>
        <button className="suggestion-btn" onClick={onGoToBooking}>
          Bắt đầu đặt vé ngay
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      <h2>Vé đã đặt của bạn ({tickets.length})</h2>

      {/* KHỐI TỔNG GIÁ ĐẶT TẠM ĐỂ GIẢ LẬP GIAO DIỆN CHUNG TRANG (Phần trên cùng)*/}
      <div className="total-summary-intro">
        <p className="total-summary-text">Tổng giá cho các chuyến bay:</p>
        <p className="total-summary-value">
          {totalDisplayPrice.toLocaleString("vi-VN")} VND
        </p>
      </div>

      <div className="ticket-list">
        {tickets.map((t) => {
          const isOpen = openTicketId === t.id;
          const details = classDetails[t.type] || [
            "Hành lý miễn cước 7kg xách tay",
            "Không hỗ trợ hoàn vé",
          ];

          return (
            <div
              key={t.id}
              className={`ticket-item-wrapper ${isOpen ? "open" : ""}`}
            >
              <div className="ticket-item">
                <div className="ticket-info-main">
                  <p className="ticket-route">
                    <span className="route-from">
                      {t.from || "Hà Nội (HAN)"}
                    </span>{" "}
                    →{" "}
                    <span className="route-to">{t.to || "Đà Nẵng (DAD)"}</span>
                  </p>
                  <p className="ticket-date">{t.date || "Thứ 5, 20 thg 10"}</p>
                </div>
                <div className="ticket-details">
                  <div className="detail-item">
                    <span className="detail-label">Giờ bay:</span>
                    <span className="detail-value">
                      {t.depart || "08:00"} - {t.arrive || "09:25"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Hạng vé:</span>
                    <span className="detail-value class-type">
                      {t.type || "Phổ thông"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Giá:</span>
                    <span className="detail-value price-value">
                      {(t.price || 1258000)?.toLocaleString("vi-VN")} VND
                    </span>
                  </div>
                </div>
                <div className="ticket-actions">
                  <button
                    className={`action-btn view-detail-btn ${
                      isOpen ? "active" : ""
                    }`}
                    onClick={() => toggleDetails(t.id)}
                  >
                    {isOpen ? "Thu gọn" : "Xem chi tiết"}
                  </button>
                </div>
              </div>

              <div className={`ticket-detail-content ${isOpen ? "open" : ""}`}>
                <div className="detail-flex-container">
                  <div className="itinerary-section">
                    <h4>Chi tiết hành trình</h4>
                    <div className="itinerary-timeline">
                      <div className="timeline-segment">
                        <p className="time-point">{t.depart || "08:00"}</p>
                        <p className="airport-name">
                          Sân bay Quốc tế Nội Bài (HAN)
                        </p>
                        <p className="gate">{t.gateFrom || "Nhà ga 1"}</p>
                      </div>
                      <div className="timeline-duration">
                        <p>{t.duration || "1h 25m"}</p>
                        <p className="flight-code">
                          Số hiệu chuyến bay {t.flightCode || "QH202"}
                        </p>
                        <p className="airline-info">
                          Do {t.airline || "Bamboo Airways"} khai thác
                        </p>
                      </div>
                      <div className="timeline-segment">
                        <p className="time-point">{t.arrive || "09:25"}</p>
                        <p className="airport-name">
                          Sân bay Quốc tế Đà Nẵng (DAD)
                        </p>
                        <p className="gate">{t.gateTo || "Nhà ga 3"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="conditions-section">
                    <h4>Điều kiện giá vé</h4>
                    <p className="fare-type">{t.type || "Phổ thông"}</p>
                    <ul className="conditions-list">
                      {details.map((item, index) => (
                        <li key={index} className="condition-item">
                          <span className="checkmark">✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button className="change-flight-btn">
                  Thay đổi chuyến bay
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ KHỐI TỔNG GIÁ ĐẶT NGAY BÊN DƯỚI DANH SÁCH VÉ (Không Fixed) */}
      <div className="final-summary-standalone">
        <p className="final-summary-total-text">
          Tổng giá:{" "}
          <span className="final-summary-total-value">
            {totalDisplayPrice.toLocaleString("vi-VN")} VND
          </span>
        </p>
        <p className="final-summary-caption">
          Giá khứ hồi cho tất cả các hành khách (đã bao gồm thuế, phí và chiết
          khấu).
          <a href="#">Xem chi tiết giá.</a>
        </p>
        <div className="summary-links">
          <a href="#">Chính sách hành lý chi tiết</a> |
          <a href="#">Điều kiện giá vé</a> |
          <a href="#">Quy định hành lý nguy hiểm</a>
        </div>
        <button className="btn-customer-info" onClick={() => navigate("/info")}>
          Điền thông tin hành khách
        </button>
      </div>
      {/* END KHỐI TỔNG GIÁ MỚI */}
    </div>
  );
};

export default MyTicket;
