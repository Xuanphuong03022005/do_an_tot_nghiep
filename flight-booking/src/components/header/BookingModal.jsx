import React, { useState } from "react";
import "./bookingModal.css";
import adminFlightApi from "../api/adminFlightApi";
import { useNavigate } from "react-router-dom";

export default function BookingModal({ onClose, onSelectFlight }) {
  const [activeTab, setActiveTab] = useState("Đặt Vé");
  const [tripType, setTripType] = useState("round-way");
  const [bookingCode, setBookingCode] = useState("");
  const [lastName, setLastName] = useState("");

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleTripChange = (e) => setTripType(e.target.value);

  const [form, setForm] = useState({
    from: "",
    to: "",
    depart: new Date().toISOString().split("T")[0],
    passengers: 1,
    tripType: "round-trip",
    bannerImg: "/images/danang.jpg",
  });
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      const params = {
        from: form.from,
        to: form.to,
        depart: form.depart,
      };

      if (tripType === "round-way" && form.returnDate) {
        params.return_date = form.returnDate;
      }

      const response = await adminFlightApi.search(params);

      if (response.outbound && response.outbound.length > 0) {
        if (tripType === "round-way" && response.return.length === 0) {
          alert(
            "⚠️ Tìm thấy chuyến đi nhưng không có chuyến về trong ngày " +
              form.returnDate
          );
        }

        navigate("/flight-info", {
          state: {
            flightResults: response.outbound,
            returnFlights: response.return,
            searchData: { ...form, tripType },
          },
        });

        if (onClose) onClose();
      } else {
        alert("❌ Không tìm thấy chuyến bay đi trong ngày " + form.depart);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      alert(
        "Lỗi: " + (error.response?.data?.message || "Không thể kết nối máy chủ")
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="booking-forms">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "Đặt Vé" ? "actives" : ""}`}
              onClick={() => handleTabChange("Đặt Vé")}
            >
              Đặt Vé
            </button>

            <button
              className={`tab ${
                activeTab === "Đặt Chỗ Của Tôi" ? "actives" : ""
              }`}
              onClick={() => handleTabChange("Đặt Chỗ Của Tôi")}
            >
              Đặt Chỗ Của Tôi
            </button>
          </div>

          {activeTab === "Đặt Vé" && (
            <>
              <div className="trip-type">
                <label>
                  <input
                    type="radio"
                    name="trip"
                    value="one-way"
                    checked={tripType === "one-way"}
                    onChange={handleTripChange}
                  />{" "}
                  Một chiều
                </label>
                <label>
                  <input
                    type="radio"
                    name="trip"
                    value="round-way"
                    checked={tripType === "round-way"}
                    onChange={handleTripChange}
                  />{" "}
                  Khứ hồi
                </label>
              </div>

              <div className="form-fields">
                <div className="field">
                  <label>Từ</label>
                  <input
                    type="text"
                    placeholder="Hà Nội (HAN)"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Đến</label>
                  <input
                    type="text"
                    placeholder="Đà Nẵng (DAD)"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Ngày đi</label>
                  <input
                    type="date"
                    value={form.depart}
                    onChange={(e) =>
                      setForm({ ...form, depart: e.target.value })
                    }
                  />
                </div>
                {tripType !== "one-way" && (
                  <div className="field">
                    <label>Ngày về</label>
                    <input
                      type="date"
                      value={form.returnDate}
                      onChange={(e) =>
                        setForm({ ...form, returnDate: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="field">
                  <label>Hành khách</label>
                  <input
                    type="number"
                    value={form.passengers}
                    onChange={(e) =>
                      setForm({ ...form, passengers: Number(e.target.value) })
                    }
                  />
                </div>
                <button onClick={handleSubmit} className="search-btn">
                  Tìm Chuyến Bay
                </button>
              </div>

              <div className="bamboo-club">
                <label>
                  <input type="checkbox" /> Dùng tài khoản Bamboo Club để đổi
                  đặt vé
                </label>
              </div>
            </>
          )}

          {activeTab === "Đặt Chỗ Của Tôi" && (
            <>
              <div className="booking-search-form">
                <div className="form-group">
                  <label>MÃ ĐẶT CHỖ/SỐ VÉ</label>
                  <input
                    type="text"
                    placeholder="123XXXXXXXXXX"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>HO</label>
                  <input
                    type="text"
                    placeholder="DO"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <button className="search-btn">Tìm Kiếm</button>
              </div>

              <div className="action-buttons">
                <button className="action-btn">Thanh toán trả sau</button>
                <button className="action-btn">Thông tin hành lý</button>
                <button className="action-btn">Chọn chỗ ngồi</button>
                <button className="action-btn">Phòng chờ Thương gia</button>
                <button className="action-btn">Bảo hiểm du lịch</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
