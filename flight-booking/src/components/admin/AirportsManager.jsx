import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/admin/airports";

const AirportsManager = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    code: "",
  });
  const [editingId, setEditingId] = useState(null);

  // --- Styles Object (Tránh Global CSS) ---
  const s = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f7f6",
      borderRadius: "15px",
    },
    header: {
      color: "#2c3e50",
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "28px",
      fontWeight: "bold",
    },
    card: {
      background: "#fff",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
      marginBottom: "30px",
    },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
    input: {
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontSize: "14px",
      outline: "none",
    },
    btnPrimary: {
      padding: "12px 25px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#3498db",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },
    btnCancel: {
      padding: "12px 25px",
      border: "none",
      borderRadius: "8px",
      backgroundColor: "#95a5a6",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
      marginLeft: "10px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    },
    th: {
      backgroundColor: "#34495e",
      color: "#fff",
      padding: "15px",
      textAlign: "left",
    },
    td: { padding: "15px", borderBottom: "1px solid #eee", color: "#333" },
    badge: {
      backgroundColor: "#e1f5fe",
      color: "#01579b",
      padding: "4px 8px",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: "12px",
    },
    btnEdit: {
      color: "#f39c12",
      background: "none",
      border: "none",
      cursor: "pointer",
      marginRight: "15px",
      fontWeight: "bold",
    },
    btnDelete: {
      color: "#e74c3c",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  const fetchAirports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setAirports(response.data);
    } catch (error) {
      alert("Lỗi tải dữ liệu!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("Cập nhật thành công!");
      } else {
        await axios.post(API_URL, formData);
        alert("Thêm thành công!");
      }
      setFormData({ name: "", city: "", country: "", code: "" });
      setEditingId(null);
      fetchAirports();
    } catch (error) {
      alert("Thao tác thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa sân bay này?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchAirports();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  const handleEdit = (ap) => {
    setEditingId(ap.id);
    setFormData({
      name: ap.name,
      city: ap.city,
      country: ap.country,
      code: ap.code,
    });
  };

  return (
    <div style={s.container}>
      <h1 style={s.header}>✈️ Quản Lý Hệ Thống Sân Bay</h1>

      {/* Form Section */}
      <div style={s.card}>
        <h3 style={{ marginBottom: "20px", color: "#34495e" }}>
          {editingId ? "Cập nhật thông tin" : "Thêm sân bay mới"}
        </h3>
        <form onSubmit={handleSubmit} style={s.formGrid}>
          <input
            style={s.input}
            placeholder="Tên sân bay"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            style={s.input}
            placeholder="Mã Code (IATA)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <input
            style={s.input}
            placeholder="Thành phố"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
          <input
            style={s.input}
            placeholder="Quốc gia"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            required
          />
          <div style={{ gridColumn: "span 2", marginTop: "10px" }}>
            <button type="submit" style={s.btnPrimary}>
              {editingId ? "Lưu thay đổi" : "Thêm vào hệ thống"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", city: "", country: "", code: "" });
                }}
                style={s.btnCancel}
              >
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Tên Sân Bay</th>
            <th style={s.th}>Mã</th>
            <th style={s.th}>Vị Trí</th>
            <th style={s.th}>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                Đang tải...
              </td>
            </tr>
          ) : (
            airports.map((ap) => (
              <tr key={ap.id}>
                <td style={s.td}>{ap.id}</td>
                <td style={{ ...s.td, fontWeight: "bold" }}>{ap.name}</td>
                <td style={s.td}>
                  <span style={s.badge}>{ap.code}</span>
                </td>
                <td style={s.td}>
                  {ap.city}, {ap.country}
                </td>
                <td style={s.td}>
                  <button onClick={() => handleEdit(ap)} style={s.btnEdit}>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(ap.id)}
                    style={s.btnDelete}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AirportsManager;
