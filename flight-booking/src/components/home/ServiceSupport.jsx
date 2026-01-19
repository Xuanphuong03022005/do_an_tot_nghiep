// ServiceSupport.js
import React, { Component } from "react";
import "./home.css";

class ServiceSupport extends Component {
  state = {
    offers: [
      {
        title: "Bay Trung Thu Vui Trăng Hội Ngộ",
        description: "Đón mùa trăng rằm quốc qua vé nội",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 38/10/2025",
      },
      {
        title: "Đón Trăng Rằm Quốc Qua",
        description: "Đón mùa trăng rằm quốc qua vé nội",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 28/10/2025",
      },
      {
        title: "Mở Bán Vé Tết 2026 Vui Tết Mùa Ngây Kể Hết",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 08/10/2026",
      },
      {
        title: "Mở Bán Vé Tết 2026 Vui Tết Mùa Ngây Kể Hết",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 18/10/2025",
      },
      {
        title: "Mở Bán Vé Tết 2026 Vui Tết Mùa Ngây Kể Hết",
        image: "/images/baner1.jpg",
        link: "#",
      },
      {
        title: "Mở Bán Vé Tết 2026 Vui Tết Mùa Ngây Kể Hết",
        image: "/images/baner1.jpg",
        link: "#",
        date: "Từ 01/10 đến 08/10/2025",
      },
    ],
    currentSlide: 0,
  };

  componentDidMount() {
    // Tự động chuyển slide mỗi 3 giây
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  componentWillUnmount() {
    // Xóa interval khi component unmount để tránh memory leak
    clearInterval(this.interval);
  }

  nextSlide = () => {
    this.setState((prevState) => ({
      currentSlide: (prevState.currentSlide + 1) % this.state.offers.length,
    }));
  };

  prevSlide = () => {
    this.setState((prevState) => ({
      currentSlide:
        (prevState.currentSlide - 1 + this.state.offers.length) %
        this.state.offers.length,
    }));
  };

  goToSlide = (index) => {
    this.setState({ currentSlide: index });
  };

  render() {
    const { offers, currentSlide } = this.state;

    return (
      <div className="service-support">
        <h2 className="service-title">Dịch vụ bổ trợ</h2>
        <div className="service-slider">
          {/* <button className="slider-btn prev" onClick={this.prevSlide}>
            &lt;
          </button> */}
          <div className="slider-container">
            {Array.from({ length: 3 }).map((_, i) => {
              const slideIndex = (currentSlide + i) % offers.length; // Vòng tròn
              const offer = offers[slideIndex];
              return (
                <div className="slide active" key={slideIndex}>
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
              );
            })}
          </div>

          {/* <button className="slider-btn next" onClick={this.nextSlide}>
            &gt;
          </button> */}
          {/* Điểm chỉ định slide */}
          <div className="slider-dots">
            {offers.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => this.goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
        {/* <div className="service-tips">
          <span role="img" aria-label="info">
            ℹ️
          </span>{" "}
          Tips: Tham khảo các ưu đãi hấp dẫn!
        </div> */}
      </div>
    );
  }
}

export default ServiceSupport;
