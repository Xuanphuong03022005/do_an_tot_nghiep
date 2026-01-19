// src/components/AllServices/InsuranceService.jsx (ĐÃ ĐIỀU CHỈNH)

import React, { Component } from "react";
import "./allServices.css";
const INSURANCE_PRICE = 112000;

class InsuranceService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInsured: false, // Mặc định là không có bảo hiểm, hoặc true nếu là mặc định
    };
  } // Giả định ban đầu là KHÔNG chọn bảo hiểm, vì radio "Không có bảo hiểm" được defaultChecked

  componentDidMount() {
    this.setState({ isInsured: false });
  }

  handleToggleInsurance = (shouldBuy) => {
    const { isInsured } = this.state; // Chỉ cập nhật nếu trạng thái thay đổi
    if (shouldBuy !== isInsured) {
      const priceChange = shouldBuy ? INSURANCE_PRICE : -INSURANCE_PRICE;
      this.setState({ isInsured: shouldBuy });
      this.props.updateTotal(priceChange); // Cộng hoặc Trừ tiền
    }
  };

  render() {
    return (
      <div className="form-section sv-insurance-section">
               {" "}
        <h3 className="section-sub-title contact-title">
                    An tâm bay cùng Bảo hiểm du lịch        {" "}
        </h3>
               {" "}
        <div className="sv-insurance-options">
                    {/* Tùy chọn 1: KHÔNG có bảo hiểm */}         {" "}
          <label>
                       {" "}
            <input
              type="radio"
              name="insurance"
              checked={!this.state.isInsured}
              onChange={() => this.handleToggleInsurance(false)} // Dùng onChange để kiểm soát
            />
                        Không có bảo hiểm          {" "}
          </label>
                    {/* Tùy chọn 2: CÓ bảo hiểm */}         {" "}
          <label>
                       {" "}
            <input
              type="radio"
              name="insurance"
              checked={this.state.isInsured}
              onChange={() => this.handleToggleInsurance(true)} // Dùng onChange để kiểm soát
            />
                        Bảo hiểm du lịch BambooCARE (
            {INSURANCE_PRICE.toLocaleString("vi-VN")} VND)          {" "}
          </label>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }
}

export default InsuranceService;
