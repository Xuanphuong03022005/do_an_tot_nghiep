import { useState } from "react";
import authApi from "../api/authApi"; // Chỉ cần 1 lần ../ vì api cùng cấp với login

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      // Gửi dữ liệu sạch lên server
      const response = await authApi.login({
        email: email.trim(),
        password: password,
      });

      // Kiểm tra đúng cấu trúc response.data.token
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return true; // Trả về true để Login.jsx thực hiện navigate
      }
      return false;
    } catch (err) {
      // Lấy thông báo từ server hoặc mặc định
      const errMsg = err.response?.data?.message || "Sai thông tin đăng nhập";
      console.error("Lỗi đăng nhập chi tiết:", errMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, handleLogin, loading, error };
};

export default useAuth;
