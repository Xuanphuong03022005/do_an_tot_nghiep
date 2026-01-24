import React, { Component } from "react";
import "./allServices.css";

class PaymentSummaryBlock extends Component {
  render() {
    const { finalTotal } = this.props;

    const displayTotal = finalTotal || 5807000;

    return (
      <div className="payment-summary-block">
        <div className="summary-details">
          {/* Tổng giá */}
          <p className="total-price-label">
            Tổng giá:{" "}
            <span className="total-price-value">
              {displayTotal.toLocaleString("vi-VN")} VND
            </span>
          </p>

          {/* Thông tin chiết khấu */}
          <p className="price-caption">
            Giá khứ hồi cho tất cả các hành khách (đã bao gồm thuế, phí và chiết
            khấu). <a href="#">Xem chi tiết giá.</a>
          </p>

          {/* Các link chính sách */}
          <div className="policy-links">
            <a href="#">Chính sách hành lý chi tiết</a> |{" "}
            <a href="#">Điều kiện giá vé</a> |{" "}
            <a href="#">Quy định hành lý nguy hiểm</a>
          </div>
        </div>

        {/* Nút thanh toán */}
        <button className="confirm-payment-btn">Thanh toán</button>
      </div>
    );
  }
}

export default PaymentSummaryBlock;
