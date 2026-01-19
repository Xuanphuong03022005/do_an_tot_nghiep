import React, { useState, useEffect } from "react";
import authApi from "../api/authApi";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mảng dữ liệu mẫu để hiển thị khi API chưa có dữ liệu hoặc lỗi
  const mockUsers = [
    {
      id: 1,
      name: "Nguyễn Văn Hùng",
      email: "hung.nguyen@gmail.com",
      phone: "0912345678",
      birthday: "1995-05-20",
      role: "2", // Quản trị
    },
    {
      id: 2,
      name: "Trần Thị Phương",
      email: "phuong.tran@yahoo.com",
      phone: "0988777666",
      birthday: "1998-12-10",
      role: "1", // Hội viên
    },
    {
      id: 3,
      name: "Lê Minh Anh",
      email: "minhanh.le@outlook.com",
      phone: "0322445566",
      birthday: "2000-01-15",
      role: "1",
    },
    {
      id: 4,
      name: "Phạm Xuân Phương",
      email: "phuongpx@gmail.com",
      phone: "0944555666",
      birthday: "1992-08-30",
      role: "2",
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authApi.getAllUsers();
        if (res) {
          const finalData = Array.isArray(res) ? res : res.data || [];

          // Nếu API trả về mảng rỗng, ta có thể tạm thời dùng mockUsers để xem giao diện
          if (finalData.length === 0) {
            setUsers(mockUsers);
          } else {
            setUsers(finalData);
          }
        }
      } catch (err) {
        console.error("Lỗi tải user, đang dùng dữ liệu mẫu:", err);
        setUsers(mockUsers); // Gán dữ liệu mẫu khi có lỗi API
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="manager-container">
      <div className="flex justify-between items-center mb-4">
        <h3>Quản lý người dùng</h3>
        <span style={{ fontSize: "12px", color: "#666" }}>
          Tổng số: {users.length}
        </span>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày sinh</th>
            <th>Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <strong>{user.name}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.phone || "N/A"}</td>
                <td>{user.birthday}</td>
                <td>
                  <span
                    className={`badge-role ${
                      user.role === "1" ? "user" : "admin"
                    }`}
                  >
                    {user.role === "1" ? "Hội viên" : "Quản trị"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Không có dữ liệu người dùng
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export default UserManager;
