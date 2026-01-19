import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const AirlineTicketManager = () => {
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketClasses, setTicketClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [formData, setFormData] = useState({ class_id: "", total_seats: "" });

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [newClassData, setNewClassData] = useState({
    name: "",
    description: "",
  });

  const BASE_URL = "http://127.0.0.1:8000/api/admin";

  useEffect(() => {
    fetchAirlines();
    fetchSeatClasses();
  }, []);

  const fetchSeatClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seat-classes`);
      setTicketClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAirlines = async () => {
    const res = await axios.get(`${BASE_URL}/airline`);
    setAirlines(res.data);
  };

  const handleCreateSeatClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/seat-classes`, newClassData);
      alert("Thêm hạng vé thành công!");
      setIsClassModalOpen(false);
      setNewClassData({ name: "", description: "" });
      fetchSeatClasses();
    } catch (err) {
      alert("Thất bại");
    }
  };

  const handleSelectAirline = async (airline) => {
    setSelectedAirline(airline);
    setLoading(true);
    setTickets([]);
    try {
      const res = await axios.get(
        `${BASE_URL}/tickets?airline_id=${airline.id}`
      );
      const ticketData = res.data.data.data || res.data.data || [];
      setTickets(ticketData);
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateRemainingSeats = () => {
    if (!selectedAirline) return 0;
    const totalCapacity =
      selectedAirline.seat_rows * selectedAirline.seat_per_row;
    const allocatedSeats = tickets
      .filter((t) => t.id !== editingTicketId)
      .reduce((sum, t) => sum + parseInt(t.total_seats || 0), 0);
    return totalCapacity - allocatedSeats;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const remaining = calculateRemainingSeats();
    if (parseInt(formData.total_seats) > remaining) {
      alert(`Không đủ ghế trống! Còn lại: ${remaining}`);
      return;
    }

    try {
      if (editingTicketId) {
        await axios.put(`${BASE_URL}/tickets/${editingTicketId}`, {
          total_seats: parseInt(formData.total_seats),
          available_seats: parseInt(formData.total_seats),
        });
      } else {
        await axios.post(`${BASE_URL}/tickets`, {
          airline_id: selectedAirline.id,
          class_id: parseInt(formData.class_id),
          total_seats: parseInt(formData.total_seats),
          price: 0, // Giá để mặc định là 0, sẽ cập nhật khi tạo chuyến bay
        });
      }
      setIsModalOpen(false);
      setEditingTicketId(null);
      handleSelectAirline(selectedAirline);
    } catch (err) {
      alert("Lỗi hệ thống");
    }
  };

  return (
    <div className="manager-section">
      <div
        className="header-flex"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Quản lý Phân bổ Ghế</h3>
        <button
          className="btn-primary"
          style={{ backgroundColor: "#28a745" }}
          onClick={() => setIsClassModalOpen(true)}
        >
          + Thêm Danh Mục Hạng Vé
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div
          style={{
            flex: 1,
            borderRight: "1px solid #ddd",
            paddingRight: "15px",
          }}
        >
          <h4>Chọn Máy bay</h4>
          <div className="airline-list">
            {airlines.map((al) => (
              <div
                key={al.id}
                className={`airline-item ${
                  selectedAirline?.id === al.id ? "active" : ""
                }`}
                onClick={() => handleSelectAirline(al)}
                style={{
                  padding: "10px",
                  border: "1px solid #eee",
                  marginBottom: "5px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  background:
                    selectedAirline?.id === al.id ? "#e3f2fd" : "#fff",
                }}
              >
                <strong>{al.name}</strong> - {al.code}
                <br />
                <small>Sức chứa: {al.seat_rows * al.seat_per_row} ghế</small>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 2 }}>
          {selectedAirline ? (
            <>
              <h4>Cấu hình ghế: {selectedAirline.name}</h4>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingTicketId(null);
                  setFormData({ class_id: "", total_seats: "" });
                  setIsModalOpen(true);
                }}
              >
                + Phân bổ số lượng ghế
              </button>
              <div
                style={{
                  background: "#f4f4f4",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                Trống: <strong>{calculateRemainingSeats()}</strong> /{" "}
                {selectedAirline.seat_rows * selectedAirline.seat_per_row}
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hạng ghế</th>
                    <th>Số lượng thiết lập</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.seat_class?.name || `Hạng ${t.class_id}`}</td>
                      <td>{t.total_seats} ghế</td>
                      <td>
                        <button
                          className="btn-action btn-edit"
                          onClick={() => {
                            setEditingTicketId(t.id);
                            setFormData({
                              class_id: t.class_id,
                              total_seats: t.total_seats,
                            });
                            setIsModalOpen(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={async () => {
                            if (window.confirm("Xóa?")) {
                              await axios.delete(`${BASE_URL}/tickets/${t.id}`);
                              handleSelectAirline(selectedAirline);
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
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Chọn máy bay để cấu hình ghế.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: THÊM HẠNG VÉ (CHỈ TÊN & GHI CHÚ) */}
      {isClassModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Thêm Danh Mục Hạng Vé</h4>
            <form onSubmit={handleCreateSeatClass}>
              <div className="form-group">
                <label>Tên hạng vé</label>
                <input
                  type="text"
                  required
                  value={newClassData.name}
                  onChange={(e) =>
                    setNewClassData({ ...newClassData, name: e.target.value })
                  }
                />
                <label>Ghi chú / Mô tả</label>
                <textarea
                  value={newClassData.description}
                  onChange={(e) =>
                    setNewClassData({
                      ...newClassData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsClassModalOpen(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PHÂN BỔ SỐ LƯỢNG GHẾ (KHÔNG CÓ GIÁ TIỀN) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Phân bổ số lượng ghế</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Chọn hạng vé</label>
                <select
                  disabled={editingTicketId}
                  required
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData({ ...formData, class_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn --</option>
                  {ticketClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label>Số lượng ghế</label>
                <input
                  type="number"
                  required
                  value={formData.total_seats}
                  onChange={(e) =>
                    setFormData({ ...formData, total_seats: e.target.value })
                  }
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Xác nhận
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

export default AirlineTicketManager;
