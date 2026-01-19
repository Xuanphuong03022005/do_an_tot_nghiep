import React, { useState, useEffect } from "react";
import "./flightInfo.css";
import { useNavigate } from "react-router-dom";

// Bảng ánh xạ mã sân bay từ dữ liệu thật của bạn

const Banner = ({
  flightData: propFlightData,
  pageType,
  selectedOutbound,
  selectedReturn,
  returnFlights = [],
}) => {
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
    from = "TSN",
    to = "ĐN",
    depart = "Th 5, 9 thg 10",
    returnDate = "Th 7, 11 thg 10",
    passengers = 1,
    bannerImg = "/images/default.jpg",
    tripType = "round-trip",
  } = flightData;

  // Lấy tên thành phố từ mã
  // const fromCityName = airportNames[from] || from;
  // const toCityName = airportNames[to] || to;

  return (
    <div className="fli-banner">
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
              ? "Nhập thông tin hành khách"
              : propFlightData
              ? `Hành trình: ${from} ➜ ${to} ${
                  returnFlights.length > 0 ? "(Khứ hồi)" : "(Một chiều)"
                }`
              : "Vé đã đặt"}
          </h2>
          <p>{/* {fromCityName} đến {toCityName} */}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
