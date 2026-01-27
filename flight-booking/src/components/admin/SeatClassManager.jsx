import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

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

  // State cho Modal Thêm mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClassData, setNewClassData] = useState({
    name: "",
    description: "",
  });

  const BASE_URL = "http://127.0.0.1:8000/api/admin/seat-classes";

  useEffect(() => {
    fetchSeatClasses();
  }, []);

  // Lấy danh sách hạng vé
  const fetchSeatClasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL);
      setSeatClasses(res.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      alert("Không thể tải danh sách hạng vé");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Thêm mới
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL, newClassData);
      alert("Thêm hạng vé thành công!");
      setIsAddModalOpen(false);
      setNewClassData({ name: "", description: "" });
      fetchSeatClasses();
    } catch (err) {
      alert("Thêm hạng vé thất bại!");
    }
  };

  // Xử lý Cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BASE_URL}/${editingClass.id}`, {
        name: editingClass.name,
        description: editingClass.description,
      });
      alert("Cập nhật thành công!");
      setIsEditModalOpen(false);
      fetchSeatClasses();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  // Xử lý Xóa
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa hạng vé này? Việc này có thể ảnh hưởng đến các phân bổ ghế hiện có."
      )
    ) {
      try {
        const res = await axios.delete(`${BASE_URL}/${id}`);
        alert(res.data.message || "Xóa thành công!");
        fetchSeatClasses();
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Lỗi hệ thống khi xóa";
        alert("Thất bại: " + errorMsg);
      }
    }
  };

  // Mở modal sửa và gán dữ liệu
  const openEditModal = (item) => {
    setEditingClass({
      id: item.id,
      name: item.name,
      description: item.description || "",
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="sc-manager-container" style={{ padding: "20px" }}>
      <div
        className="sc-header-flex"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Quản lý Danh mục Hạng vé</h3>
          <p
            className="sc-sub-text"
            style={{ color: "#666", fontSize: "14px" }}
          >
            Định nghĩa các loại hạng ghế (Economy, Business, v.v.)
          </p>
        </div>
        <button
          className="btn-primary"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Thêm Hạng Vé Mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table
          className="sc-data-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead style={{ backgroundColor: "#f4f4f4" }}>
            <tr>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Tên hạng vé
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Mô tả
              </th>
              <th
                style={{
                  padding: "12px",
                  textAlign: "center",
                  borderBottom: "2px solid #ddd",
                }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {seatClasses.map((item) => (
              <tr
                key={item.id}
                className="sc-table-tr"
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "12px" }}>{item.id}</td>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    color: "#0056b3",
                  }}
                >
                  {item.name}
                </td>
                <td style={{ padding: "12px" }}>
                  {item.description || "Chưa có mô tả"}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  <button
                    className="sc-btn-edit"
                    style={{
                      marginRight: "10px",
                      color: "#ffc107",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => openEditModal(item)}
                  >
                    Sửa
                  </button>
                  <button
                    className="sc-btn-delete"
                    style={{
                      color: "#dc3545",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* --- MODAL THÊM MỚI --- */}
      {isAddModalOpen && (
        <div
          className="sc-modal-overlay"
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
            className="sc-modal-content"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h4 style={{ marginTop: 0 }}>Thêm Hạng Vé Mới</h4>
            <form onSubmit={handleCreate}>
              <div className="sc-form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Tên hạng vé
                </label>
                <input
                  type="text"
                  className="sc-input"
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                  required
                  placeholder="VD: Thương gia, Phổ thông..."
                  value={newClassData.name}
                  onChange={(e) =>
                    setNewClassData({ ...newClassData, name: e.target.value })
                  }
                />
              </div>
              <div className="sc-form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Mô tả
                </label>
                <textarea
                  className="sc-textarea"
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    minHeight: "80px",
                  }}
                  value={newClassData.description}
                  onChange={(e) =>
                    setNewClassData({
                      ...newClassData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div
                className="sc-modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: "8px 15px" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Lưu lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CHỈNH SỬA --- */}
      {isEditModalOpen && (
        <div
          className="sc-modal-overlay"
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
            className="sc-modal-content"
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              Chỉnh sửa hạng vé (ID: {editingClass.id})
            </h4>
            <form onSubmit={handleUpdate}>
              <div className="sc-form-group" style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Tên hạng vé
                </label>
                <input
                  type="text"
                  className="sc-input"
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                  required
                  value={editingClass.name}
                  onChange={(e) =>
                    setEditingClass({ ...editingClass, name: e.target.value })
                  }
                />
              </div>
              <div className="sc-form-group" style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Mô tả
                </label>
                <textarea
                  className="sc-textarea"
                  style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box",
                    minHeight: "80px",
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
                className="sc-modal-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ padding: "8px 15px" }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
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
