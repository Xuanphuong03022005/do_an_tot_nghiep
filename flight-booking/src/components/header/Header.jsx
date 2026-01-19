import React, { useState } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import BookingModal from "./BookingModal";
function Header({ value, onSelectFlight, user, onLogout }) {
  const [showExplore, setShowExplore] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="navbar">
          <div className="navbar-logo">
            <Link to="/">
              <img src="/images/fly.png" alt="fly Logo" />
            </Link>
          </div>

          <div className="navbar-menu">
            {/* Gộp hover cả nút và menu */}
            <div
              className="menu-wrapper"
              onMouseEnter={() => setShowExplore(true)}
              onMouseLeave={() => setShowExplore(false)}
            >
              <a className="menu-item">Khám phá</a>

              {showExplore && (
                <div className="mega-menu">
                  <div className="mega-inner">
                    <div className="mega-column">
                      <h4>Điểm đến</h4>

                      <a>Hồ Chí Minh</a>
                      <a>Hà Nội</a>
                      <a>Đà Nẵng</a>
                    </div>

                    <div className="mega-column">
                      <h4>Ưu đãi</h4>
                      <a>Bay Trung Thu – Vui Trăng Hội Ngộ</a>
                      <a>Đón Trăng, Rước Quà</a>
                      <a>Đêm Chưa Ngủ, Tranh Thủ Săn Deal</a>
                    </div>

                    <div className="mega-column">
                      <h4>Vé Máy Bay & Lịch Bay</h4>

                      <a>Vé Máy Bay Đi Đà Nẵng</a>
                      <a>Vé Máy Bay Đi TP. Hồ Chí Minh</a>

                      <a>Vé Máy Bay Từ Hà Nội</a>
                    </div>

                    <div className="mega-image">
                      <img src="/images/baner1.jpg" alt="Thái Lan" />
                      <p>Thái Lan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a className="menu-item" onClick={() => setShowBooking(true)}>
              Đặt vé
            </a>
            <a className="menu-item">Thông tin hành trình</a>
          </div>

          <div className="navbar-actions">
            <div className="nav-ac">
              <div className="nav-ac_main">
                <div className="nav-item">
                  <FaSearch className="icon" />
                  <span>Trợ giúp</span>
                </div>
                <div className="separator">|</div>
                <div className="nav-item flag">
                  <img
                    src="https://flagcdn.com/w20/vn.png"
                    alt="Vietnam flag"
                    className="flag-icon"
                  />
                  <span>Việt Nam • Tiếng Việt</span>
                </div>
              </div>
              {user ? (
                <div className="user-profile">
                  <span className="greeting">Xin chào</span>
                  <span className="user-name">
                    {user.lastName.toUpperCase()} {user.firstName.toUpperCase()}
                  </span>
                  <FaUserCircle className="icon user-icon active" />
                  <button className="logout-btn" onClick={onLogout}>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="nav-item_lg">
                  <a onClick={() => navigate("/login")} className="login">
                    Đăng nhập
                  </a>
                  <a onClick={() => navigate("/register")} className="register">
                    Đăng ký
                  </a>
                  <FaUserCircle className="icon user-icon" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showBooking && (
        <BookingModal
          onClose={() => setShowBooking(false)}
          onSelectFlight={onSelectFlight} // ✅ Truyền đúng hàm
        />
      )}{" "}
    </>
  );
}

export default Header;
