import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
// Xem file CSS bên dưới

const DiscountManager = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    min_order_amount: 0,
    start_date: "",
    end_date: "",
    usage_limit: 100,
    status: "active",
    description: "",
  });

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus) params.status = filterStatus;

      const res = await axios.get("http://localhost:8000/api/admin/discounts", {
        params,
      });

      console.log("Dữ liệu nhận được:", res.data);

      // Kiểm tra tất cả các trường hợp có thể xảy ra của Laravel Paginate
      let list = [];
      if (res.data?.data?.data) {
        list = res.data.data.data; // Trường hợp: { success: true, data: { data: [...] } }
      } else if (res.data?.data) {
        list = Array.isArray(res.data.data) ? res.data.data : []; // Trường hợp trả về mảng trực tiếp
      }

      setDiscounts(list);
    } catch (err) {
      console.error("Lỗi API:", err);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDiscounts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        await axios.delete(`http://localhost:8000/api/admin/discounts/${id}`);
        alert("Xóa thành công!");
        fetchDiscounts();
      } catch (err) {
        alert("Xóa thất bại!");
      }
    }
  };

  const handleEdit = (discount) => {
    setEditingId(discount.id);
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      min_order_amount: discount.min_order_amount,
      start_date: discount.start_date.split("T")[0], // format YYYY-MM-DD
      end_date: discount.end_date.split("T")[0],
      usage_limit: discount.usage_limit,
      status: discount.status,
      description: discount.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/admin/discounts/${editingId}`,
          formData
        );
        alert("Cập nhật thành công!");
      } else {
        await axios.post("http://localhost:8000/api/admin/discounts", formData);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      resetForm();
      fetchDiscounts();
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      value: "",
      min_order_amount: 0,
      start_date: "",
      end_date: "",
      usage_limit: 100,
      status: "active",
      description: "",
    });
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Đang chạy
          </span>
        );
      case "inactive":
        return (
          <span className="badge badge-secondary">
            <XCircle size={12} /> Tạm dừng
          </span>
        );
      case "expired":
        return (
          <span className="badge badge-danger">
            <AlertCircle size={12} /> Hết hạn
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="discount-container">
      <div className="discount-header">
        <div className="title-section">
          <Tag className="title-icon" />
          <h2>Quản lý mã giảm giá</h2>
        </div>
        <button
          className="btn-add"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Thêm mã mới
        </button>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Tìm kiếm</button>
        </form>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang chạy</option>
          <option value="inactive">Tạm dừng</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="discount-table">
          <thead>
            <tr>
              <th>Mã CODE</th>
              <th>Loại</th>
              <th>Giá trị</th>
              <th>Đơn tối thiểu</th>
              <th>Thời hạn</th>
              <th>Đã dùng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : discounts.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không tìm thấy mã nào.
                </td>
              </tr>
            ) : (
              discounts.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong className="code-text">{item.code}</strong>
                  </td>
                  <td>
                    {item.type === "percentage"
                      ? "Phần trăm"
                      : "Số tiền cố định"}
                  </td>
                  <td>
                    {item.type === "percentage"
                      ? `${item.value}%`
                      : `${Number(item.value).toLocaleString()}đ`}
                  </td>
                  <td>{Number(item.min_order_amount).toLocaleString()}đ</td>
                  <td>
                    <div className="date-info">
                      <span>
                        <Clock size={12} />{" "}
                        {new Date(item.start_date).toLocaleDateString()}
                      </span>
                      <span>
                        <Calendar size={12} />{" "}
                        {new Date(item.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="usage-bar">
                      <div className="usage-text">
                        {item.used_count} / {item.usage_limit}
                      </div>
                      <div className="progress-bg">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              (item.used_count / item.usage_limit) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM/SỬA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {editingId ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: SUMMER2024"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Loại giảm giá</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed_amount">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Giá trị giảm *</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Đơn hàng tối thiểu *</label>
                  <input
                    type="number"
                    required
                    value={formData.min_order_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc *</label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Giới hạn sử dụng</label>
                  <input
                    type="number"
                    required
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Kích hoạt</option>
                    <option value="inactive">Tạm ẩn</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label>Mô tả</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountManager;
