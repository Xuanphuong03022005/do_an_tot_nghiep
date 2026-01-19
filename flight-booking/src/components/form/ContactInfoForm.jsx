// src/components/ContactInfoForm.jsx

import React, { Component } from "react";
import "./form.css";
class ContactInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phoneType: "Ca nhan", // Mặc định là 'Cá nhân'
      countryCode: "",
      phoneNumber: "",
      showEmergency: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleToggleEmergency = () => {
    this.setState((prevState) => ({
      showEmergency: !prevState.showEmergency,
    }));
  };

  render() {
    return (
      <div className="form-section contact-info">
        <h3>Thông tin liên lạc</h3>

        {/* E-mail */}
        <div className="form-row">
          <label htmlFor="email">E-mail *</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Địa chỉ email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </div>
        <div className="btn-group">
          <button type="button" className="secondary-btn">
            Thêm địa chỉ email
          </button>
        </div>

        {/* Điện thoại */}
        <div className="form-row phone-group">
          {/* Loại điện thoại */}
          <div className="phone-type">
            <label htmlFor="phoneType">Loại điện thoại *</label>
            <select
              id="phoneType"
              name="phoneType"
              value={this.state.phoneType}
              onChange={this.handleChange}
            >
              <option value="Ca nhan">Cá nhân</option>
              <option value="Co quan">Cơ quan</option>
            </select>
          </div>

          {/* Mã quốc gia & Số điện thoại */}
          <div className="phone-fields">
            <div className="input-split">
              <div>
                <label htmlFor="countryCode">Mã quốc gia *</label>
                <input
                  id="countryCode"
                  type="text"
                  name="countryCode"
                  placeholder="Mã quốc gia"
                  value={this.state.countryCode}
                  onChange={this.handleChange}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber">Số điện thoại *</label>
                <input
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  value={this.state.phoneNumber}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button type="button" className="secondary-btn">
            Thêm số điện thoại khác
          </button>
        </div>

        {/* Toggle thông tin khẩn cấp */}
        <div className="toggle-emergency">
          <input
            type="checkbox"
            id="emergencyToggle"
            checked={this.state.showEmergency}
            onChange={this.handleToggleEmergency}
          />
          <label htmlFor="emergencyToggle">
            Thêm thông tin liên lạc khẩn cấp
          </label>
        </div>

        {this.state.showEmergency && (
          <div className="emergency-form">
            {/* Thêm các trường khẩn cấp tại đây nếu cần */}
            <p>Form thông tin liên lạc khẩn cấp sẽ hiển thị tại đây.</p>
          </div>
        )}
      </div>
    );
  }
}

export default ContactInfoForm;
