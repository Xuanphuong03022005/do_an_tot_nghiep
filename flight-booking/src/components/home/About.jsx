// About.jsx
import React from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineUsers,
} from "react-icons/hi";
import "./home.css";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Ảnh minh họa */}
        {/* <div className="about-image">
          <img src="/images/banner5.jpg" alt="About Us" />
        </div> */}

        {/* Nội dung */}
        <div className="about-content">
          <h2>Về Chúng Tôi</h2>
          <p>
            Chúng tôi cung cấp dịch vụ đặt vé máy bay nhanh chóng, an toàn và
            tiện lợi. Với kinh nghiệm nhiều năm, đội ngũ chúng tôi luôn hỗ trợ
            hành khách từ việc tìm kiếm chuyến bay đến check-in và hỗ trợ dịch
            vụ tại sân bay.
          </p>

          <div className="about-features">
            <div className="feature">
              <HiOutlineCheckCircle className="feature-icon" />
              <span>An toàn và tin cậy</span>
            </div>
            <div className="feature">
              <HiOutlineClock className="feature-icon" />
              <span>Tiết kiệm thời gian</span>
            </div>
            <div className="feature">
              <HiOutlineUsers className="feature-icon" />
              <span>Hỗ trợ khách hàng 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
