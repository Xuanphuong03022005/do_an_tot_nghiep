import React, { Component } from "react";
import "./allServices.css";

class PassengerReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passengerData: null,
    };
  }

  componentDidMount() {
    // 💡 Lấy thông tin hành khách/người liên hệ từ localStorage
    const storedInfo = localStorage.getItem("contactInfo");
    const storedFormInfo = localStorage.getItem("formInfo");

    if (storedInfo && storedFormInfo) {
      try {
        const contactInfo = JSON.parse(storedInfo);
        const formInfo = JSON.parse(storedFormInfo);

        this.setState({
          passengerData: {
            title: formInfo.title,
            lastName: formInfo.lastName,
            firstName: formInfo.firstName,
            email: contactInfo.email,
            phone: contactInfo.phoneNumber,
          },
        });
      } catch (e) {
        console.error("Lỗi khi đọc thông tin hành khách từ localStorage:", e);
      }
    }
  }

  render() {
    const { passengerData } = this.state;

    if (!passengerData) {
      return (
        <div className="review-section passenger-review">
          <h2 className="section-header">Hành khách</h2>
          <p>Đang tải thông tin hành khách...</p>
        </div>
      );
    }

    const { title, lastName, firstName, email, phone } = passengerData;
    const fullName = `${title || "Ông/Bà"} ${lastName} ${firstName}`;

    return (
      <div className="review-section passenger-review">
        <h2 className="section-header">Hành khách</h2>
        <div className="passenger-card">
          <div className="passenger-icon">
            <span role="img" aria-label="user">
              👤
            </span>
          </div>
          <div className="passenger-details">
            <p>
              <span className="checkmark">✅</span> <strong>{fullName}</strong>
            </p>
            <p>
              <small>{email}</small>
            </p>
            <p>
              <small>{phone}</small>
            </p>
            <p>
              <small>Người lớn</small>
            </p>
          </div>
          <div className="edit-btn">
            <span className="dropdown-arrow"></span>
          </div>
        </div>
      </div>
    );
  }
}

export default PassengerReview;
