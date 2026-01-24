import React, { Component } from "react";
import "./form.css";
class FormInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      firstName: "",
      lastName: "",
      birthday: "",
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="form-section form-info">
        <h2>Thông tin cá nhân</h2>
        <small>* = các trường bắt buộc</small>
        <small>Vui lòng điền thông tin cá nhân như trong hộ chiếu.</small>
        <p className="warning-text">
          Do hạn chế hệ thống, tên em bé quá dài sẽ tự động bị cắt ngắn khi lưu.
          Vui lòng viết tắt chữ cái đầu tiên của Tên đệm em bé (phần Họ và phần
          Tên vẫn viết đầy đủ).
        </p>
        {/* Danh xưng */}
        <label>Danh xưng *</label>
        <select
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        >
          <option value="">-- Chọn --</option>
          <option value="ong">Ông</option>
          <option value="ba">Bà</option>
          <option value="co">Cô</option>
          <option value="anh">Anh</option>
        </select>

        {/* Tên đệm và tên */}
        <label>Tên đệm và tên *</label>
        <input
          type="text"
          name="firstName"
          placeholder="Tên đệm và tên"
          value={this.state.firstName}
          onChange={this.handleChange}
        />

        {/* Họ */}
        <label>Họ *</label>
        <input
          type="text"
          name="lastName"
          placeholder="Họ"
          value={this.state.lastName}
          onChange={this.handleChange}
        />

        {/* Ngày sinh */}
        <label>Ngày sinh *</label>
        <input
          type="date"
          name="birthday"
          value={this.state.birthday}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default FormInfo;
