// Service.js
import React, { Component } from "react";
import "./home.css";

class Service extends Component {
  state = {
    offers: [
      {
        title: "Bay Trung Thu Vui Trăng Hội Ngộ",
        discount: "Giảm đến 15%",
        code: "TRUNGTHU2025",
        image: "/images/baner1.jpg",
        link: "#",
      },
      {
        title: "Đón Trăng Rằm Quốc Qua",
        description: "Đón mùa trăng rằm quốc qua vé nội",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 08/10/2025",
      },
      {
        title: "Mở Bán Vé Tết 2026 Vui Tết Mùa Ngây Kể Hết",
        image: "/images/baner1.jpg",
        link: "#",
      },
    ],
  };

  render() {
    return (
      <div className="service">
        <h2 className="service-title">ƯU ĐÃI</h2>
        <div className="service-container">
          {this.state.offers.map((offer, index) => (
            <div className="service-card" key={index}>
              <img
                src={offer.image}
                alt={offer.title}
                className="service-image"
              />
              <div className="service-content">
                <h3>{offer.title}</h3>
                {offer.discount && (
                  <div className="service-discount">{offer.discount}</div>
                )}
                {offer.code && (
                  <p className="service-code">Nhập mã: {offer.code}</p>
                )}
                {offer.description && (
                  <p className="service-description">{offer.description}</p>
                )}
                {offer.date && <p className="service-date">{offer.date}</p>}
                <a href={offer.link} className="service-link">
                  Chi Tiết →
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="service-tips">
          <span role="img" aria-label="info">
            ℹ️
          </span>{" "}
          Tips: Tham khảo các ưu đãi hấp dẫn!
        </div>
      </div>
    );
  }
}

export default Service;
