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

  const [formData, setFormData] = useState({
    class_id: "",
    row_start: "",
    row_end: "",
  });

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
    try {
      const res = await axios.get(`${BASE_URL}/airline`);
      setAirlines(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách máy bay:", err);
    }
  };

  // --- HÀM XỬ LÝ THÊM HẠNG VÉ (ĐÃ THÊM LẠI ĐỂ SỬA LỖI) ---

  const handleCreateSeatClass = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/seat-classes`, newClassData);

      alert("Thêm danh mục hạng vé thành công!");

      setIsClassModalOpen(false);
      setNewClassData({ name: "", description: "" });
      fetchSeatClasses();
    } catch (err) {
      alert("Thêm hạng vé thất bại");
    }
  };

  const handleSelectAirline = async (airline) => {
    if (!airline || !airline.id) return;
    setSelectedAirline(airline);
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/tickets`, {
        params: { airline_id: airline.id },
      });
      // Kiểm tra kỹ cấu trúc res.data.data từ Laravel Paginate
      const ticketData = res.data?.data?.data || res.data?.data || [];
      setTickets(Array.isArray(ticketData) ? ticketData : []);
    } catch (err) {
      console.error("Lỗi tải vé:", err);
      setTickets([]); // Trả về mảng rỗng để không lỗi .reduce()
    } finally {
      setLoading(false);
    }
  };

  const calculateSeatsFromRows = () => {
    if (!selectedAirline || !formData.row_start || !formData.row_end) return 0;
    const start = parseInt(formData.row_start);
    const end = parseInt(formData.row_end);
    const perRow = parseInt(selectedAirline.seat_per_row);
    if (end < start) return 0;
    return (end - start + 1) * perRow;
  };

  const calculateRemainingSeats = () => {
    if (!selectedAirline) return 0;
    const totalCapacity =
      Number(selectedAirline.seat_rows) * Number(selectedAirline.seat_per_row);
    const allocatedSeats = tickets.reduce((sum, t) => {
      if (editingTicketId && Number(t.id) === Number(editingTicketId))
        return sum;
      return sum + Number(t.total_seats || 0);
    }, 0);

    return totalCapacity - allocatedSeats;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra số ghế trước khi gửi (Vấn đề 4)
    const totalSeats = calculateSeatsFromRows();
    const remaining = calculateRemainingSeats();
    if (totalSeats > remaining) {
      alert(
        `Lỗi: Số ghế phân bổ (${totalSeats}) vượt quá số ghế còn trống (${remaining})`
      );

      return;
    }

    try {
      const payload = {
        airline_id: Number(selectedAirline.id),
        class_id: Number(formData.class_id),
        total_seats: Number(totalSeats),
        row_start: Number(formData.row_start),
        row_end: Number(formData.row_end),
        price: 0,
      };

      // Gửi POST đến /api/admin/tickets
      const res = await axios.post(`${BASE_URL}/tickets`, payload);
      alert(res.data.message);
      setIsModalOpen(false);
      handleSelectAirline(selectedAirline);
    } catch (err) {
      // Lỗi 405 sẽ biến mất sau khi thêm Route POST ở Backend
      alert(err.response?.data?.message || "Lỗi hệ thống");
    }
  };

  return (
    <div className="manager-section">
      <div
        className="header-flex"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Quản lý Phân bổ Ghế theo Hàng</h3>

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
            {airlines?.map((al) => (
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
                <small>
                  Hàng ghế: {al.seat_rows} | Ghế/hàng: {al.seat_per_row}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung phân bổ bên phải */}
        <div style={{ flex: 2 }}>
          {selectedAirline ? (
            <>
              <h4>Cấu hình: {selectedAirline.name}</h4>

              <button
                className="btn-primary"
                onClick={() => {
                  setEditingTicketId(null);

                  setFormData({
                    class_id: "",
                    row_start: "",
                    row_end: "",
                  });
                  setIsModalOpen(true);
                }}
              >
                + Thiết lập khoảng hàng ghế
              </button>

              <div
                style={{
                  background: "#f8f9fa",
                  padding: "10px",
                  marginTop: "10px",
                  border: "1px solid #dee2e6",
                }}
              >
                Số ghế còn trống: <strong>{calculateRemainingSeats()}</strong> /{" "}
                {selectedAirline.seat_rows * selectedAirline.seat_per_row}
              </div>

              <table
                className="data-table"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <thead>
                  <tr>
                    <th>Hạng ghế</th>
                    <th>Từ hàng</th>
                    <th>Đến hàng</th>
                    <th>Tổng ghế</th>

                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      {/* Hiển thị t.seat_class.name thay vì class_id */}
                      <td>{t.seat_class?.name || `Hạng ${t.class_id}`}</td>
                      <td>{t.row_start}</td>
                      <td>{t.row_end}</td>
                      <td>{t.total_seats} ghế</td>
                      <td>
                        <button
                          className="btn-action btn-delete"
                          onClick={async () => {
                            if (window.confirm("Xóa phân bổ này?")) {
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
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                color: "#888",
              }}
            >
              Hãy chọn một máy bay để bắt đầu cấu hình.
            </div>
          )}
        </div>
      </div>

      {/* MODAL PHÂN BỔ KHOẢNG HÀNG */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "450px" }}>
            <h4
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "10px",
              }}
            >
              Phân bổ hạng ghế theo vị trí
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Chọn hạng vé</label>

                <select
                  required
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class_id: e.target.value,
                    })
                  }
                >
                  <option value="">-- Chọn hạng --</option>
                  {ticketClasses
                    .filter(
                      (c) =>
                        !tickets.some(
                          (t) => Number(t.class_id) === Number(c.id)
                        )
                    ) // Lọc bỏ hạng đã có trong danh sách tickets hiện tại
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginTop: "15px",
                  }}
                >
                  <div>
                    <label>Hàng bắt đầu</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedAirline.seat_rows}
                      required
                      value={formData.row_start}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          row_start: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Hàng kết thúc</label>
                    <input
                      type="number"
                      min={formData.row_start || 1}
                      max={selectedAirline.seat_rows}
                      required
                      value={formData.row_end}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          row_end: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#e7f3ff",
                    borderRadius: "5px",
                    textAlign: "center",
                    border: "1px solid #b3d7ff",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    Tổng số ghế được tạo:
                  </span>{" "}
                  <br />
                  <strong
                    style={{
                      fontSize: "24px",
                      color: "#0056b3",
                    }}
                  >
                    {calculateSeatsFromRows()}
                  </strong>
                </div>
              </div>

              <div
                className="modal-actions"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  style={{ backgroundColor: "#007bff" }}
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM HẠNG VÉ */}

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
                    setNewClassData({
                      ...newClassData,
                      name: e.target.value,
                    })
                  }
                />

                <label>Ghi chú</label>

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
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsClassModalOpen(false)}
                >
                  Hủy
                </button>

                <button type="submit" className="btn-save">
                  Lưu lại
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
