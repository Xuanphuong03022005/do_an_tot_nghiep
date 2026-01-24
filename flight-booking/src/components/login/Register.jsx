// src/components/login/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import "./login.css";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { confirmPassword, ...dataToRegister } = formData;

    // Đợi lấy memberId từ API
    const memberId = await handleRegister(dataToRegister);

    if (memberId) {
      navigate("/login", {
        state: {
          memberIdMessage: `Đăng ký thành công! ID: ${memberId}`,
          registeredEmail: formData.email,
        },
      });
    }
  };

  return (
    <div className="register-split-container">
      <div className="register-image-side">
        <div className="logo-and-tagline">
          <span className="logo-text">BAMBOO</span> | MORE THAN JUST A FLIGHT
        </div>
      </div>

      <div className="register-form-side">
        <div className="form-content-wrapper">
          <div className="bamboo-club-logo">BAMBOO CLUB</div>
          <h2 className="main-title">Gia nhập Bamboo Club ngay hôm nay</h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <h4 className="form-section-header">Thông tin cá nhân</h4>
            <div className="form-row-2-col">
              <div className="form-group-input">
                <label>HỌ (*)</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Họ"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-input">
                <label>TÊN ĐỆM & TÊN (*)</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Tên"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h4 className="form-section-header">Thông tin liên hệ</h4>
            <div className="form-row-2-col">
              <div className="form-group-input">
                <label>EMAIL (*)</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-input">
                <label>SỐ ĐIỆN THOẠI (*)</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="SĐT"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h4 className="form-section-header">Bảo mật</h4>
            <div className="form-row-2-col">
              <div className="form-group-input">
                <label>MẬT KHẨU (*)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group-input">
                <label>XÁC NHẬN MẬT KHẨU (*)</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="policy-and-submit">
              <div className="policy-checkbox">
                <input type="checkbox" id="policy" required />
                <label htmlFor="policy">
                  Tôi đồng ý với các điều khoản hội viên.
                </label>
              </div>
              <button
                type="submit"
                className={`submit-btn-bamboo ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
              </button>
            </div>
          </form>
          <p className="switch-link-footer">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
