// Banner.js
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
const Banner = ({ flightData: propFlightData, pageType }) => {
  const navigate = useNavigate();
  const [localFlightData, setLocalFlightData] = useState(propFlightData);
  useEffect(() => {
    if (!propFlightData) {
      const storedData = localStorage.getItem("bannerFlightData");
      if (storedData) {
        try {
          setLocalFlightData(JSON.parse(storedData));
        } catch (e) {
          console.error("Lỗi khi parse flight data từ localStorage:", e);
        }
      }
    } else {
      localStorage.setItem("bannerFlightData", JSON.stringify(propFlightData));
    }
  }, [propFlightData]);
  const flightData = localFlightData;
  if (!flightData) {
    return (
      <div className="fli-banner">
        <div className="fli-banner-loading">
          <p>Đang tải thông tin chuyến bay...</p>
        </div>
      </div>
    );
  }
  const {
    from = "Chưa xác định",
    to = "Chưa xác định",
    depart = "Chưa có ngày",
    returnDate = "",
    passengers = 0,
    bannerImg = "/images/default.jpg",
    tripType = "one-way",
  } = flightData;
  return (
    <div className="fli-banner">
      <div className="fli-banner-top">
        <div className="fli-banner-section">
          <div className="fli-code">{from.substring(0, 3).toUpperCase()}</div>
          <div className="fli-icon">✈</div>
          <div className="fli-code">{to.substring(0, 3).toUpperCase()}</div>
          <div>
            <p className="fli-city">{from}</p>
            <p className="fli-code">{to}</p>
          </div>
          <div className="separator">|</div>
          <div>
            <p>
              <b>Khởi hành</b>
            </p>
            <p>{depart}</p>
          </div>
          <div className="separator">|</div>
          {tripType === "round-trip" && returnDate && (
            <div>
              <p>
                <b>Trở về</b>
              </p>
              <p>{returnDate}</p>
            </div>
          )}
          <div className="separator">|</div>
          <div>
            <p>
              <b>Hành khách</b>
            </p>
            <p>{passengers} 👤</p>
          </div>
        </div>
        <div className="fli-banner-details">
          <button className="fli-btn-change">Thay đổi ▼</button>
          <button
            className="fli-btn-book"
            onClick={() => navigate("/my-ticket")}
          >
            Đặt chỗ của bạn
          </button>
        </div>
      </div>
      <div
        className="fli-banner-image"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundColor: bannerImg ? "transparent" : "#f0f0f0",
        }}
      >
        <div className="fli-banner-overlay">
          <h2>
            {pageType === "passenger"
              ? "Nhập thông tin hành khách" // Nếu propPageType là 'passenger'
              : propFlightData
              ? "Hành trình của bạn"
              : "Vé đã đặt"}{" "}
          </h2>
          <p>
            {from} đến {to}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Banner;
