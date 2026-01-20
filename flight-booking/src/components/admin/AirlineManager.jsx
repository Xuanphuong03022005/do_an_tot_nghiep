import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const AirlineManager = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState(null);

  // File state riêng để xử lý upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Narrow-body",
    registration_code: "",
    seat_rows: 0,
    seat_per_row: 0,
  });

  const API_URL = "http://127.0.0.1:8000/api/admin/airline";

  const fetchAirlines = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setAirlines(response.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu máy bay:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirlines();
  }, []);

  const openModal = (airline = null) => {
    if (airline) {
      setEditingAirline(airline);
      setFormData({
        name: airline.name,
        code: airline.code,
        type: airline.type,
        registration_code: airline.registration_code,
        seat_rows: airline.seat_rows,
        seat_per_row: airline.seat_per_row,
      });
    } else {
      setEditingAirline(null);
      setFormData({
        name: "",
        code: "",
        type: "Narrow-body",
        registration_code: "",
        seat_rows: 0,
        seat_per_row: 0,
      });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sử dụng FormData để gửi file ảnh
    const data = new FormData();
    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("type", formData.type);
    data.append("registration_code", formData.registration_code);
    data.append("seat_rows", formData.seat_rows);
    data.append("seat_per_row", formData.seat_per_row);
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    try {
      if (editingAirline) {
        // Laravel cần _method: PUT khi gửi FormData qua POST để giả lập PUT
        data.append("_method", "PUT");
        await axios.post(`${API_URL}/${editingAirline.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Cập nhật máy bay thành công");
      } else {
        await axios.post(API_URL, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Thêm máy bay thành công");
      }
      setIsModalOpen(false);
      fetchAirlines(); // Load lại danh sách
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi thao tác dữ liệu");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa máy bay này và toàn bộ ghế liên quan?"
      )
    ) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setAirlines(airlines.filter((a) => a.id !== id));
        alert("Xóa thành công");
      } catch (err) {
        alert("Lỗi khi xóa");
      }
    }
  };

  if (loading)
    return <div className="loading">Đang tải dữ liệu máy bay...</div>;

  return (
    <div className="manager-section">
      <div className="header-flex">
        <h3>Quản lý Đội bay (Airlines)</h3>
        <button className="btn-primary" onClick={() => openModal()}>
          + Thêm máy bay mới
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên máy bay</th>
            <th>Mã (Model)</th>
            <th>Số hiệu</th>
            <th>Loại</th>
            <th>Cấu hình ghế</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {airlines.map((al) => (
            <tr key={al.id}>
              <td>
                <img
                  src={al.image}
                  alt={al.name}
                  style={{ width: "80px", borderRadius: "4px" }}
                />
              </td>
              <td className="font-bold">{al.name}</td>
              <td>
                <code className="code-label">{al.code}</code>
              </td>
              <td>{al.registration_code}</td>
              <td>{al.type}</td>
              <td>
                {al.seat_rows} hàng x {al.seat_per_row} ghế
              </td>
              <td>
                <button
                  className="btn-action btn-edit"
                  onClick={() => openModal(al)}
                >
                  Sửa
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(al.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{editingAirline ? "Cập nhật máy bay" : "Thêm máy bay mới"}</h4>
            <form onSubmit={handleSubmit}>
              <div
                className="form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group">
                  <label>Tên máy bay (VD: Airbus A321)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Mã máy bay (Code)</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Số hiệu đăng ký (Reg Code)</label>
                  <input
                    type="text"
                    required
                    value={formData.registration_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Loại thân</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Narrow-body">Thân hẹp (Narrow-body)</option>
                    <option value="Wide-body">Thân rộng (Wide-body)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Số hàng ghế</label>
                  <input
                    type="number"
                    required
                    value={formData.seat_rows}
                    onChange={(e) =>
                      setFormData({ ...formData, seat_rows: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Số ghế mỗi hàng</label>
                  <input
                    type="number"
                    required
                    value={formData.seat_per_row}
                    onChange={(e) =>
                      setFormData({ ...formData, seat_per_row: e.target.value })
                    }
                  />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label>Hình ảnh máy bay</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Lưu dữ liệu
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirlineManager;
