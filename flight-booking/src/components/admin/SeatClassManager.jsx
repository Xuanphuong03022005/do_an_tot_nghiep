import React, { useState, useEffect } from "react";
import axios from "axios";

const SeatClassManager = () => {
  const [seatClasses, setSeatClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho Modal Sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState({
    id: "",
    name: "",
    description: "",
  });

  const BASE_URL = "http://127.0.0.1:8000/api/admin/seat-classes";

  useEffect(() => {
    fetchSeatClasses();
  }, []);

  // 1. Lấy danh sách hạng vé
  const fetchSeatClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setSeatClasses(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xóa hạng vé
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        // Đảm bảo BASE_URL của bạn là http://127.0.0.1:8000/api/admin/seat-classes
        const res = await axios.delete(`${BASE_URL}/${id}`);
        alert(res.data.message || "Xóa thành công!");
        fetchSeatClasses();
      } catch (err) {
        // Hiển thị lỗi chi tiết từ Server để biết tại sao thất bại
        const errorMsg = err.response?.data?.message || "Lỗi hệ thống khi xóa";
        alert("Thất bại: " + errorMsg);
      }
    }
  };

  // 3. Mở modal sửa và gán dữ liệu
  const openEditModal = (item) => {
    setEditingClass({
      id: item.id,
      name: item.name,
      description: item.description || "",
    });
    setIsEditModalOpen(true);
  };

  // 4. Xử lý cập nhật (Submit Form)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra xem editingClass có đủ id, name và description không
      await axios.put(`${BASE_URL}/${editingClass.id}`, {
        name: editingClass.name,
        description: editingClass.description, // Gửi kèm mô tả
      });
      alert("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchSeatClasses(); // Reload lại danh sách
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại! Vui lòng kiểm tra lại kết nối API.");
    }
  };

  return (
    <div className="manager-container" style={{ padding: "20px" }}>
      <div
        className="flex justify-between items-center mb-4"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Quản lý Danh mục Hạng vé</h3>
        <p style={{ color: "#666", fontSize: "14px" }}>
          Dữ liệu dùng chung cho cấu hình máy bay
        </p>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table
          className="data-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", textAlign: "left" }}>
              <th
                style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}
              >
                ID
              </th>
              <th
                style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}
              >
                Tên hạng vé
              </th>
              <th
                style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}
              >
                Mô tả
              </th>
              <th
                style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {seatClasses.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{item.id}</td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: "#007bff",
                  }}
                >
                  {item.name}
                </td>
                <td style={{ padding: "12px" }}>
                  {item.description || "Chưa có mô tả"}
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      marginRight: "10px",
                      color: "#ffc107",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      color: "#dc3545",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL SỬA HẠNG VÉ */}
      {isEditModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h4>Chỉnh sửa hạng vé: {editingClass.id}</h4>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Tên hạng vé
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                  }}
                  required
                  value={editingClass.name}
                  onChange={(e) =>
                    setEditingClass({ ...editingClass, name: e.target.value })
                  }
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Mô tả
                </label>
                <textarea
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    height: "80px",
                  }}
                  value={editingClass.description}
                  onChange={(e) =>
                    setEditingClass({
                      ...editingClass,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatClassManager;
