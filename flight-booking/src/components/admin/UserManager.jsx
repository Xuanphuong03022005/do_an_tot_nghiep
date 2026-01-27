import React, { useState, useEffect } from "react";
import authApi from "../api/authApi";
import "./admin.css";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [history, setHistory] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: 0,
  });

  const fetchUsers = async (email = "") => {
    setLoading(true);
    try {
      const res = await authApi.getAllUsers(email);
      setUsers(res.data || res || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xóa User
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await authApi.deleteUser(id); // Giả sử bạn đã định nghĩa trong authApi
        alert("Xóa thành công");
        fetchUsers();
      } catch (err) {
        alert("Xóa thất bại");
      }
    }
  };

  // Mở modal sửa
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({ ...user, password: "" }); // Reset password field để trống
    setShowEditModal(true);
  };

  // Gửi yêu cầu cập nhật (Sửa/Reset MK)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Chuyển role sang kiểu Number để tránh lỗi validate type
      const updatedData = { ...formData, role: Number(formData.role) };

      // Nếu password trống thì xóa khỏi object gửi đi để Laravel không validate min:6
      if (!updatedData.password) {
        delete updatedData.password;
      }

      await authApi.updateUser(selectedUser.id, updatedData);
      alert("Cập nhật thành công!");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      console.error(err.response?.data); // Xem lỗi cụ thể từ server
      alert("Lỗi cập nhật: " + (err.response?.data?.message || ""));
    }
  };

  // Gửi yêu cầu thêm Admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const newAdmin = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "0000000000", // Laravel có thể yêu cầu phone
        role: 1, // Ép quyền Quản trị viên
      };

      await authApi.createUser(newAdmin);
      alert("Thêm Admin thành công!");
      setShowAddModal(false);
      fetchUsers();
    } catch (err) {
      alert(
        "Thêm thất bại: " +
          (err.response?.data?.message || "Kiểm tra lại dữ liệu")
      );
    }
  };

  return (
    <div className="user-manager-container">
      <div className="user-header-section">
        <h3>Quản lý người dùng hệ thống</h3>
        <div className="flex-actions" style={{ display: "flex", gap: "10px" }}>
          <button
            className="user-search-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => setShowAddModal(true)}
          >
            Thêm
          </button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchUsers(searchTerm);
            }}
            className="user-search-form"
          >
            <input
              type="text"
              className="user-search-input"
              placeholder="Tìm email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="user-search-btn">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      <table className="user-main-table">
        <thead className="user-table-head">
          <tr>
            <th>ID</th>
            <th>Tên hành khách</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th style={{ textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-table-tr">
              <td>{user.id}</td>
              <td>
                <strong>{user.name}</strong>
              </td>
              <td>{user.email}</td>
              <td>
                {user.role === 1 ? (
                  <span className="badge-admin">Admin</span>
                ) : (
                  "quản trị"
                )}
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  onClick={() => handleEditClick(user)}
                  className="btn-edit"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn-delete"
                >
                  Xóa
                </button>
                {/* <button
                  onClick={async () => {
                    const res = await authApi.getUserHistory(user.id);
                    setHistory(res.data || []);
                    setShowHistoryModal(true);
                  }}
                  className="user-btn-history"
                >
                  Lịch sử
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL THÊM ADMIN */}
      {showAddModal && (
        <div className="user-modal-overlay">
          <div className="user-modal-content">
            <h4>Thêm quản trị viên mới</h4>
            <form onSubmit={handleAddAdmin}>
              <input
                type="text"
                placeholder="Tên"
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SỬA/RESET MK */}
      {showEditModal && (
        <div className="user-modal-overlay">
          <div className="user-modal-content">
            <h4>Chỉnh sửa người dùng: {selectedUser.name}</h4>
            <form onSubmit={handleUpdate}>
              <label>Tên:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <label>Mật khẩu mới (Để trống nếu không đổi):</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới..."
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <label>Vai trò:</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value={0}>Khách hàng</option>
                <option value={1}>Quản trị viên</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;
