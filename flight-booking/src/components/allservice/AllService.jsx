import React, { Component } from "react";
// Giả định các files dịch vụ khác cũng đã được tạo
import InsuranceService from "./InsuranceService";
import BaggageService from "./BaggageService";
import SeatSelection from "./SeatSelection";
import "./allServices.css"; // Giả định CSS

class AllService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceTotal: 0,
    };
  }

  // Phương thức chung để nhận thay đổi giá từ các component con
  // và đẩy lên component cha (PaymentReview)
  updateTotalAndState = (priceChange) => {
    // 1. Cập nhật state nội bộ (serviceTotal)
    this.setState((prevState) => ({
      serviceTotal: prevState.serviceTotal + priceChange,
    }));

    // 2. Cập nhật state của component cha (PaymentReview)
    this.props.updateServiceTotal(priceChange);
  };

  render() {
    const { basePrice } = this.props;
    const finalTotal = basePrice + this.state.serviceTotal;

    return (
      <div className="add-on-services-container">
               {" "}
        <div className="form-section">
                   {" "}
          <h3 className="section-title contact-title">Các dịch vụ bổ sung</h3> 
               {" "}
        </div>
                {/* Truyền hàm cập nhật xuống các component con */}
                <InsuranceService updateTotal={this.updateTotalAndState} />
                <BaggageService updateTotal={this.updateTotalAndState} />
                <SeatSelection updateTotal={this.updateTotalAndState} />       {" "}
        {/* KHU VỰC TỔNG TIỀN CHO KHỐI DỊCH VỤ */}       {" "}
        <div className="form-submit-area">
                   {" "}
          <div className="total-display">
                        Tổng giá (Tạm tính):            {" "}
            <span className="total-price">
                            {finalTotal.toLocaleString("vi-VN")} VND            {" "}
            </span>
                     {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }
}

export default AllService;
