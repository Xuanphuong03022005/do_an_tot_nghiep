// NavigationBar.js
import React, { Component } from "react";
import {
  HiOutlineCake,
  HiOutlineBriefcase,
  HiOutlineAdjustments,
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineGift,
  HiOutlineHome,
} from "react-icons/hi";
import "./home.css";

class Utilities extends Component {
  render() {
    return (
      <div className="utilities-navigation-bar">
        {/* Menu Items */}
        <div className="utilities-menu-items">
          <div className="utilities-menu-item">
            <HiOutlineCake />
            <span>Sứat Ăn</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineBriefcase />
            <span>Hành Lý</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineAdjustments />
            <span>Chọn Chỗ Ngồi</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineShieldCheck />
            <span>Bảo Hiểm</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineClock />
            <span>Phòng Chờ</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineGift />
            <span>Thẻ Quà Tặng</span>
          </div>
          <div className="utilities-menu-item">
            <HiOutlineHome />
            <span>Khách Sạn</span>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="utilities-highlight-section">
          <div className="utilities-highlight-content">
            <h2>Thông tin hỗ trợ chuyến bay của bạn</h2>
            <p>Tiều chuẩn hành lý, điều kiện vé bay... đều có đầy!</p>
            <button className="utilities-installment-btn">Trả cứu ➜</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Utilities;
