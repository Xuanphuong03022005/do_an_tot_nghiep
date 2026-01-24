import React, { Component } from "react";
// Import các component Review đã được tạo để mô phỏng trang tổng kết
import FlightReview from "./FlightReview";
import PassengerReview from "./PassengerReview";
import PaymentSummaryBlock from "./PaymentSummaryBlock";
// Component quản lý dịch vụ/tổng tiền từ các bước trước
import AllService from "./AllService";
import Banner from "./Banner";

import "./allServices.css";

class PaymentReview extends Component {
  constructor(props) {
    super(props);

    // 💡 Lấy giá vé gốc từ localStorage (đã được lưu khi chọn vé)
    const storedFlightPrice = localStorage.getItem("baseFlightPrice");
    const initialBasePrice = storedFlightPrice
      ? parseInt(storedFlightPrice)
      : 5589000;

    this.state = {
      basePrice: initialBasePrice,
      serviceTotal: 0, // Tổng tiền dịch vụ cộng thêm
    };
  }

  // Phương thức để cập nhật tổng tiền dịch vụ từ AllService (đã truyền xuống dưới)
  updateServiceTotal = (priceChange) => {
    this.setState((prevState) => ({
      serviceTotal: prevState.serviceTotal + priceChange,
    }));
  };

  render() {
    const finalTotal = this.state.basePrice + this.state.serviceTotal;

    return (
      <div className="">
        <Banner />
        <div className="payment-review-page-container">
          <div className="main-content-area">
            {/* KHỐI 1: CHI TIẾT CHUYẾN BAY (Lấy basePrice từ state) */}
            <FlightReview basePrice={this.state.basePrice} />
            <hr />

            {/* KHỐI 2: THÔNG TIN HÀNH KHÁCH (Component tự lấy data từ localStorage) */}
            <PassengerReview />
            <hr />

            {/* KHỐI 3: DỊCH VỤ BỔ SUNG (AllService) */}
            <div className="service-selection-block">
              <h2 className="section-header">
                Các dịch vụ bổ sung và Bảo hiểm
              </h2>

              <AllService
                basePrice={this.state.basePrice}
                updateServiceTotal={this.updateServiceTotal}
              />
            </div>
          </div>

          {/* KHỐI CỐ ĐỊNH: TỔNG GIÁ VÀ THANH TOÁN */}
          <PaymentSummaryBlock finalTotal={finalTotal} />
        </div>
      </div>
    );
  }
}

export default PaymentReview;
