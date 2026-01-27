import { useState } from "react";
import authApi from "../api/authApi"; // Chỉ cần 1 lần ../ vì api cùng cấp với login

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const handleRegister = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: `${formData.lastName.trim()} ${formData.firstName.trim()}`,
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
        birthday: formData.birthday || "2000-01-01",
      };

      const response = await authApi.register(payload);

      // Đảm bảo lấy đúng memberId từ cấu trúc response của Laravel
      if (response.status === 201 || response.status === 200) {
        return response.data.memberId;
      }
    } catch (err) {
      // Lấy thông báo lỗi chi tiết từ Backend
      const errMsg =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(errMsg);
      console.error("Register Error:", err.response?.data);
      return null;
    } finally {
      setLoading(false);
    }
  };
  // App.js
  // useAuth.js

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({
        email: email.trim(),
        password: password,
      });

      // Log này để bạn kiểm tra lại một lần nữa cấu trúc
      console.log("Dữ liệu thực tế từ API:", response.data);

      // Truy cập vào đúng cấp dữ liệu dựa trên image_8506f2.png
      const result = response.data;

      // Kiểm tra nếu có user (vì ảnh console cho thấy user nằm trong result.data)
      if (result && result.data && result.data.user) {
        const userData = result.data.user;

        // LƯU Ý: Nếu API trả về token ở chỗ khác, hãy gán đúng biến đó.
        // Nếu hiện tại API chưa trả về token, bạn cần kiểm tra lại AuthController ở Laravel.
        const token = result.token || result.data.token || "fake-token-de-test";

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Cập nhật state ngay lập tức
        setCurrentUser(userData);
        return true;
      }

      return false;
    } catch (err) {
      console.error(
        "Lỗi đăng nhập:",
        err.response?.data?.message || "Lỗi hệ thống"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, handleLogin, loading, error };
};

export default useAuth;
