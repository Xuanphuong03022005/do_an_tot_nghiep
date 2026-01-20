// src/components/AllServices/BaggageService.jsx

import React, { Component } from "react";
import "./allServices.css";
class BaggageService extends Component {
  // Logic quản lý trạng thái hành lý
  handleSelectBaggage = (price) => {
    // Logic đơn giản: luôn update total (cần logic phức tạp hơn để tính chênh lệch)
    this.props.updateTotal(price);
  };

  render() {
    return (
      <div className="form-section sv-baggage-section">
        <h3 className="section-sub-title">Mua thêm hành lý</h3>
        <p>
          Quý khách cần thêm hành lý ký gửi cho chuyến bay? Mua ngay để được
          hưởng giá tốt nhất.
        </p>
        <p className="sv-price-info">TỪ 65.000 VND</p>

        {/* Logic chọn gói hành lý */}
        <select
          onChange={(e) =>
            this.handleSelectBaggage(parseInt(e.target.value) || 0)
          }
        >
          <option value="0">
            1 hành lý xách tay, Không bao gồm hành lý ký gửi
          </option>
          <option value="65000">Thêm 5kg (65.000 VND)</option>
          <option value="120000">Thêm 10kg (120.000 VND)</option>
        </select>

        <button
          onClick={() => this.handleSelectBaggage(0)}
          className="secondary-btn"
        >
          Chọn mua
        </button>
      </div>
    );
  }
}

export default BaggageService;
