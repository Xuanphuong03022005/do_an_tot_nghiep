import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Agree = () => {
  const navigate = useNavigate();

  // Hàm xử lý khi bấm Xác nhận
  const handleConfirm = () => {
    // Chuyển đến trang tổng kết/thanh toán
    // Giả định trang tổng kết có path là '/review'
    navigate("/review");
  };

  return (
    <div className="form-section form-agree">
      <div className="agreement-container">
        <input
          type="checkbox"
          id="agreeCheckbox"
          className="agreement-checkbox"
          defaultChecked
        />
        <label htmlFor="agreeCheckbox" className="agreement-text">
          Tôi đã đọc và đồng ý rằng dữ liệu của tôi sẽ được xử lý theo
          <a href="#" className="agreement-link">
            {" "}
            Chính sách bảo mật
          </a>
          ,
          <a href="#" className="agreement-link">
            {" "}
            Điều kiện sử dụng chức năng đặt chỗ trực tuyến
          </a>{" "}
          và
          <a href="#" className="agreement-link">
            {" "}
            Điều khoản sử dụng website
          </a>{" "}
          của Bamboo Airways.
        </label>
      </div>
      <div className="button-container">
        {/* Gọi handleConfirm khi bấm Xác nhận */}
        <button type="button" className="secondary-btn" onClick={handleConfirm}>
          Xác nhận
        </button>
      </div>
    </div>
  );
};

export default Agree;
