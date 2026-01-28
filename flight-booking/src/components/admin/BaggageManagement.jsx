import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const BaggageManagement = () => {
  const [activeTab, setActiveTab] = useState("packages"); // "packages" hoặc "rules"
  const [dataList, setDataList] = useState([]);
  const [seatClasses, setSeatClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal & Form state
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    weight: "",
    price: "",
    free_weight: "",
    max_weight: "",
    max_length: "",
    max_width: "",
    max_height: "",
    class_id: "",
  });

  const API_BASE = "http://127.0.0.1:8000/api/admin";

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "packages" ? "baggage-packages" : "baggage-rules";
      const [dataRes, classRes] = await Promise.all([
        axios.get(`${API_BASE}/${endpoint}`),
        axios.get(`${API_BASE}/seat-classes`),
      ]);
      setDataList(dataRes.data.data || []);
      setSeatClasses(classRes.data || []);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setCurrentId(item.id);
      setFormData(item);
    } else {
      setCurrentId(null);
      setFormData({
        weight: "5.00",
        price: "0",
        free_weight: "10.00",
        max_weight: "20.00",
        max_length: "50",
        max_width: "30",
        max_height: "20",
        class_id: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      activeTab === "packages" ? "baggage-packages" : "baggage-rules";

    // Ép kiểu dữ liệu để Backend không bị lỗi validate
    const payload = {
      weight: parseFloat(String(formData.weight).replace(",", ".")), // Đổi 5,00 thành 5.00
      price: parseFloat(formData.price),
      max_length: parseInt(formData.max_length) || 0,
      max_width: parseInt(formData.max_width) || 0,
      max_height: parseInt(formData.max_height) || 0,
      // Nếu là tab rules thì thêm các trường này
      free_weight: parseFloat(
        String(formData.free_weight || 0).replace(",", ".")
      ),
      max_weight: parseFloat(
        String(formData.max_weight || 0).replace(",", ".")
      ),
      class_id: formData.class_id,
    };

    try {
      if (currentId) {
        await axios.put(`${API_BASE}/${endpoint}/${currentId}`, payload);
      } else {
        await axios.post(`${API_BASE}/${endpoint}`, payload);
      }
      setShowModal(false);
      fetchInitialData();
      alert("Thành công!");
    } catch (err) {
      console.error("Chi tiết lỗi:", err.response?.data);
      alert("Lỗi: " + (err.response?.data?.error || "Dữ liệu không hợp lệ"));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="manager-section">
      <div className="tab-control" style={{ marginBottom: "20px" }}>
        <button
          className={`btn-tab ${activeTab === "packages" ? "active" : ""}`}
          onClick={() => setActiveTab("packages")}
        >
          📦 Gói Mua Thêm
        </button>
        <button
          className={`btn-tab ${activeTab === "rules" ? "active" : ""}`}
          onClick={() => setActiveTab("rules")}
        >
          ⚖️ Quy Định Hạng Ghế
        </button>
      </div>

      <div className="header-flex">
        <h3>
          {activeTab === "packages"
            ? "Quản lý Gói Hành Lý Ký Gửi"
            : "Thông Số Ưu Đãi Theo Hạng Ghế"}
        </h3>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Thêm Mới
        </button>
      </div>

      <table
        className="data-table"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            {activeTab === "rules" && <th>Hạng Ghế</th>}
            <th>Khối Lượng</th>
            {activeTab === "packages" ? (
              <th>Đơn Giá</th>
            ) : (
              <th>Giới Hạn Tối Đa</th>
            )}
            <th>Kích Thước (cm)</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item) => (
            <tr key={item.id}>
              {activeTab === "rules" && (
                <td>
                  <span className="badge-class">
                    {item.seat_class?.name || "N/A"}
                  </span>
                </td>
              )}
              <td>
                <strong>
                  {activeTab === "packages" ? item.weight : item.free_weight} kg
                </strong>
              </td>
              <td>
                {activeTab === "packages" ? (
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>
                    {formatCurrency(item.price)}
                  </span>
                ) : (
                  `${item.max_weight} kg`
                )}
              </td>
              <td>{`${item.max_length} x ${item.max_width} x ${item.max_height}`}</td>
              <td>
                <button
                  className="btn-action btn-edit"
                  onClick={() => handleOpenModal(item)}
                >
                  Sửa
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={async () => {
                    if (window.confirm("Xóa mục này?")) {
                      await axios.delete(
                        `${API_BASE}/${
                          activeTab === "packages"
                            ? "baggage-packages"
                            : "baggage-rules"
                        }/${item.id}`
                      );
                      fetchInitialData();
                    }
                  }}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "480px" }}>
            <h4>{currentId ? "Cập Nhật" : "Thêm Mới"} Dữ Liệu</h4>
            <form onSubmit={handleSubmit}>
              {activeTab === "rules" && (
                <div className="form-group">
                  <label>Chọn Hạng Ghế Áp Dụng</label>
                  {/* Thay thế phần <select> của class_id bằng logic này */}
                  <select
                    value={formData.class_id}
                    onChange={(e) =>
                      setFormData({ ...formData, class_id: e.target.value })
                    }
                    required
                    disabled={currentId !== null} // Khóa không cho sửa hạng ghế khi đang ở chế độ cập nhật
                  >
                    <option value="">-- Chọn hạng --</option>
                    {seatClasses
                      ?.filter((c) => {
                        // Nếu đang thêm mới, chỉ hiện hạng chưa có trong dataList
                        if (!currentId) {
                          return !dataList.some(
                            (item) => Number(item.class_id) === Number(c.id)
                          );
                        }
                        // Nếu đang sửa, hiện chính nó
                        return true;
                      })
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div className="form-group">
                  <label>
                    {activeTab === "packages"
                      ? "Khối lượng (kg)"
                      : "Miễn phí (kg)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={
                      activeTab === "packages"
                        ? formData.weight
                        : formData.free_weight
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [activeTab === "packages" ? "weight" : "free_weight"]:
                          e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>
                    {activeTab === "packages"
                      ? "Giá (VNĐ)"
                      : "Tối đa mua thêm (kg)"}
                  </label>
                  <input
                    type="number"
                    value={
                      activeTab === "packages"
                        ? formData.price
                        : formData.max_weight
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [activeTab === "packages" ? "price" : "max_weight"]:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <label style={{ fontSize: "12px", color: "#666" }}>
                Quy định kích thước tối đa (Dài x Rộng x Cao)
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "5px",
                  width: "100%",
                }}
              >
                <input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Dài"
                  type="number"
                  value={formData.max_length}
                  onChange={(e) =>
                    setFormData({ ...formData, max_length: e.target.value })
                  }
                />
                <input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Rộng"
                  type="number"
                  value={formData.max_width}
                  onChange={(e) =>
                    setFormData({ ...formData, max_width: e.target.value })
                  }
                />
                <input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Cao"
                  type="number"
                  value={formData.max_height}
                  onChange={(e) =>
                    setFormData({ ...formData, max_height: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaggageManagement;
