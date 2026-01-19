import React, { Component } from "react";
import "./allServices.css";

class FlightReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Dữ liệu chuyến bay giả định, cần được lấy từ localStorage trong ứng dụng thực tế
      flightDetails: {
        route1: "Hà Nội đến Đà Nẵng - Thứ Bảy, 18 tháng 10, 2025",
        time1: "22:15 → 1 ngày / 07:55, Thời gian bay 9h 40min",
        class1: "Economy Smart",
        route2: "Đà Nẵng đến Hà Nội - Thứ Tư, 22 tháng 10, 2025",
        time2: "07:40 → 09:05, Thời gian bay 1h 25min",
        class2: "Economy Flex",
      },
    };
  }

  render() {
    const { basePrice } = this.props;
    const { flightDetails } = this.state;

    return (
      <div className="review-section flight-review">
        <h2 className="section-header">Các chuyến bay</h2>

        {/* Tuyến 1 */}
        <div className="flight-route-card">
          <p className="route-header">
            <strong>{flightDetails.route1}</strong>
          </p>
          <div className="itinerary-detail">
            <span className="duration">{flightDetails.time1}</span>
            <span className="fare-class">{flightDetails.class1}</span>
            <p className="flight-info">
              ✈️ QH 201 được Bamboo Airways khai thác.
            </p>
          </div>
        </div>

        {/* Tuyến 2 */}
        <div className="flight-route-card">
          <p className="route-header">
            <strong>{flightDetails.route2}</strong>
          </p>
          <div className="itinerary-detail">
            <span className="duration">{flightDetails.time2}</span>
            <span className="fare-class">{flightDetails.class2}</span>
            <p className="flight-info">
              ✈️ QH 102 được Bamboo Airways khai thác.
            </p>
          </div>
        </div>

        <p className="base-price-total">
          Tổng giá cho các chuyến bay:{" "}
          <strong>{basePrice.toLocaleString("vi-VN")} VND</strong>
        </p>
      </div>
    );
  }
}

export default FlightReview;
