// src/components/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ ĐỔI THÀNH EMAIL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Nếu có thông báo từ trang Register truyền sang
    if (location.state && location.state.memberIdMessage) {
      setMessage(location.state.memberIdMessage);

      // ✅ TỰ ĐỘNG ĐIỀN EMAIL VỪA ĐĂNG KÝ
      if (location.state.registeredEmail) {
        setEmail(location.state.registeredEmail);
      }

      // Xóa state để thông báo không xuất hiện lại khi refresh
      const state = { ...location.state };
      delete state.memberIdMessage;
      delete state.registeredEmail;
      navigate(location.pathname, { replace: true, state });
    }
  }, [location.state, location.pathname, navigate]);

  // src/components/Login.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onLogin(email, password);
    if (success) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser && parseInt(savedUser.role) === 0) {
        navigate("/adm");
      } else {
        navigate("/");
      }
    } else {
      alert("Email hoặc Mật Khẩu không chính xác.");
    }
  };
  return (
    <div className="form-container login-form">
      <div className="login-box">
        <div className="bamboo-logo">BAMBOO CLUB</div>
        <h2>Đăng nhập Bamboo Club</h2>

        {message && (
          <div
            className="login-message-box"
            style={{
              backgroundColor: "#e7f3ff",
              color: "#0056b3",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px",
              border: "1px solid #b8daff",
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Lưu thông tin
            </label>
            <a href="#">Quên Mật Khẩu?</a>
          </div>
          <button type="submit" className="submit-btn">
            Đăng Nhập
          </button>
        </form>
        {/* <p className="switch-link">
          Chưa là Hội viên?
          <Link to="/register" style={{ cursor: "pointer", marginLeft: "5px" }}>
            Đăng ký ngay
          </Link>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
