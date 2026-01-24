import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminFlightApi from "../api/adminFlightApi";
import "./home.css";
import OnlineCheckInForm from "./OnlineCheckInForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BannerBooking = () => {
  const [activeTab, setActiveTab] = useState("Đặt Vé");
  const [tripType, setTripType] = useState("round-way");
  const [bookingCode, setBookingCode] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    from: "",
    to: "",
    depart: new Date().toISOString().split("T")[0],
    returnDate: "",
    passengers: 1,
  });

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleTripChange = (e) => setTripType(e.target.value);

  // Logic tìm kiếm đồng bộ với BookingModal
  const handleSubmit = async () => {
    if (!form.from || !form.to) {
      alert("Vui lòng nhập đầy đủ điểm đi và điểm đến");
      return;
    }

    try {
      const params = {
        from: form.from,
        to: form.to,
        depart: form.depart,
      };

      // Nếu là khứ hồi, thêm ngày về vào params
      if (tripType === "round-way" && form.returnDate) {
        params.return_date = form.returnDate;
      }

      const response = await adminFlightApi.search(params);

      if (response.outbound && response.outbound.length > 0) {
        // Cảnh báo nếu chọn khứ hồi nhưng không có chuyến về
        if (
          tripType === "round-way" &&
          (!response.return || response.return.length === 0)
        ) {
          alert(
            "⚠️ Tìm thấy chuyến đi nhưng không có chuyến về trong ngày " +
              form.returnDate
          );
        }

        // Chuyển hướng sang trang flight-info và truyền dữ liệu
        navigate("/flight-info", {
          state: {
            flightResults: response.outbound,
            returnFlights: response.return || [],
            searchData: { ...form, tripType },
          },
        });
      } else {
        alert("❌ Không tìm thấy chuyến bay nào trong ngày " + form.depart);
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      alert("Lỗi kết nối máy chủ");
    }
  };

  return (
    <section className="banner-section">
      <div className="banner-container">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="banner-swiper"
        >
          <SwiperSlide>
            <img
              src="/images/baner1.jpg"
              alt="Banner 1"
              className="banner-image"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/images/baner2.jpg"
              alt="Banner 2"
              className="banner-image"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/images/baner3.png"
              alt="Banner 3"
              className="banner-image"
            />
          </SwiperSlide>
        </Swiper>

        <div className="booking-form">
          <div className="tabs">
            {["Đặt Vé", "Đặt Chỗ Của Tôi"].map((tab) => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Đặt Vé" && (
            <div className="form-content">
              <div className="trip-type">
                <label>
                  <input
                    type="radio"
                    value="one-way"
                    checked={tripType === "one-way"}
                    onChange={handleTripChange}
                  />{" "}
                  Một chiều
                </label>
                <label>
                  <input
                    type="radio"
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
                    placeholder="HAN"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Đến</label>
                  <input
                    type="text"
                    placeholder="DAD"
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
                {tripType === "round-way" && (
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
                    min="1"
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
            </div>
          )}

          {/* Thêm phần hiển thị cho tab Làm Thủ Tục */}

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
              {/* <p className="info-message">
                  Đợi vui vẻ mua vé trước ngày 26.9.2023. Quay lại vui lòng nhập
                  mã đặt chỗ (PNR) để tra cứu. <a href="#">Bấm vào đây</a>.
                </p> */}
              <div className="action-buttons">
                <button className="action-btn">Thanh toán trả sau</button>
                <button className="action-btn">Thống tin hành lý</button>
                <button className="action-btn">Chọn chỗ ngồi</button>
                <button className="action-btn">Phòng chờ Trung gia</button>
                <button className="action-btn">Bảo hiểm du lịch</button>
                {/* <button className="action-btn">Thay đổi chuyến bay</button> */}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerBooking;
