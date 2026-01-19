// src/components/LoyaltyForm.jsx

import React, { Component } from "react";
import "./form.css";
class LoyaltyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program: "",
      memberId: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="form-section loyalty-info">
        <h3>Chương trình Khách hàng thân thiết</h3>

        <div className="loyalty-description">
          <label htmlFor="program">
            Chọn chương trình Khách hàng thân thiết
          </label>
          <select
            id="program"
            name="program"
            value={this.state.program}
            onChange={this.handleChange}
          >
            <option value="">-- Chọn chương trình --</option>
            <option value="VNA">Vietnam Airlines</option>
            <option value="BA">British Airways</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="memberId">Số thẻ hội viên của Quý khách</label>
          <input
            id="memberId"
            type="text"
            name="memberId"
            placeholder="Số thẻ hội viên của Quý khách"
            value={this.state.memberId}
            onChange={this.handleChange}
          />
        </div>
      </div>
    );
  }
}

export default LoyaltyForm;
