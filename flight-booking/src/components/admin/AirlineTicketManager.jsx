import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const AirlineTicketManager = () => {
  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [ticketClasses, setTicketClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_id: "",
    row_start: "1",
    row_end: "1",
    price: "0", // Thêm trường giá tiền
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

  const fetchAirlines = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/airline`);
      setAirlines(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách máy bay:", err);
    }
  };

  const fetchFlightsByAirline = async (airlineId) => {
    try {
      const res = await axios.get(`${BASE_URL}/flights`, {
        params: { airline_id: airlineId },
      });
      const flightData = res.data?.data || res.data || [];
      setFlights(flightData);
    } catch (err) {
      setFlights([]);
    }
  };

  const handleSelectAirline = async (airline) => {
    if (!airline || !airline.id) return;
    setSelectedAirline(airline);
    setLoading(true);

    try {
      await fetchFlightsByAirline(airline.id);
      const res = await axios.get(`${BASE_URL}/tickets`, {
        params: { airline_id: airline.id },
      });
      setTickets(res.data?.data || res.data || []);
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSeatsFromRows = () => {
    if (!selectedAirline || !formData.row_start || !formData.row_end) return 0;
    const start = parseInt(formData.row_start);
    const end = parseInt(formData.row_end);
    const perRow = parseInt(selectedAirline.seat_per_row) || 0;

    if (end < start) return 0;
    return (end - start + 1) * perRow;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFlightId) {
      alert("Vui lòng chọn một chuyến bay cụ thể!");
      return;
    }

    const newSeats = calculateSeatsFromRows();
    const airplaneLimit =
      (parseInt(selectedAirline?.seat_rows) || 0) *
      (parseInt(selectedAirline?.seat_per_row) || 0);

    const currentAllocated = tickets
      .filter((t) => t.flight_id === Number(selectedFlightId))
      .reduce((sum, t) => sum + parseInt(t.total_seats || 0), 0);

    if (currentAllocated + newSeats > airplaneLimit) {
      alert(
        `Lỗi: Không thể phân bổ! Tổng ghế (${
          currentAllocated + newSeats
        }) vượt quá giới hạn máy bay (${airplaneLimit}).`
      );
      return;
    }

    try {
      const payload = {
        flight_id: Number(selectedFlightId),
        class_id: Number(formData.class_id),
        total_seats: Number(newSeats),
        price: Number(formData.price), // Gửi giá tiền
        row_start: Number(formData.row_start),
        row_end: Number(formData.row_end),
      };
      const res = await axios.post(`${BASE_URL}/tickets`, payload);
      alert(res.data.message);
      setIsModalOpen(false);
      handleSelectAirline(selectedAirline);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi hệ thống");
    }
  };

  const maxSeats =
    (parseInt(selectedAirline?.seat_rows) || 0) *
    (parseInt(selectedAirline?.seat_per_row) || 0);

  const groupedByFlight = tickets.reduce((acc, ticket) => {
    const fNumber = ticket.flight?.flight_number || "N/A";
    if (!acc[fNumber]) {
      acc[fNumber] = { total: 0, max: maxSeats };
    }
    acc[fNumber].total += parseInt(ticket.total_seats || 0);
    return acc;
  }, {});

  const currentPlannedSeats = calculateSeatsFromRows();
  const seatsAlreadyAllocatedInModal = tickets
    .filter((t) => t.flight_id === Number(selectedFlightId))
    .reduce((sum, t) => sum + parseInt(t.total_seats || 0), 0);
  const isOverLimit =
    seatsAlreadyAllocatedInModal + currentPlannedSeats > maxSeats;

  return (
    <div className="manager-section">
      <div
        className="header-flex"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Quản lý Hạng vé & Chuyến bay</h3>
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
                  Ghế/hàng: {al.seat_per_row} | Hàng: {al.seat_rows}
                </small>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 2 }}>
          {selectedAirline ? (
            <>
              <h4>Vé đã thiết lập cho: {selectedAirline.name}</h4>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedFlightId("");
                  setFormData({ ...formData, price: "0" }); // Reset giá
                  setIsModalOpen(true);
                }}
              >
                + Thiết lập vé cho Chuyến bay
              </button>

              <div style={{ marginTop: "15px" }}>
                {Object.keys(groupedByFlight).map((fNum) => (
                  <div
                    key={fNum}
                    style={{
                      padding: "10px",
                      background: "#f0f7ff",
                      borderRadius: "5px",
                      borderLeft: "5px solid #007bff",
                      marginBottom: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <strong>Chuyến bay {fNum}:</strong>{" "}
                    {groupedByFlight[fNum].total} / {groupedByFlight[fNum].max}{" "}
                    ghế
                  </div>
                ))}
              </div>

              <table
                className="data-table"
                style={{ width: "100%", marginTop: "15px" }}
              >
                <thead>
                  <tr>
                    <th>Chuyến bay</th>
                    <th>Hạng ghế</th>
                    <th>Tổng ghế</th>
                    <th>Giá vé</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td>{t.flight?.flight_number || "N/A"}</td>
                      <td>{t.seat_class?.name || `Hạng ${t.class_id}`}</td>
                      <td>{t.total_seats} ghế</td>
                      <td>
                        {new Intl.NumberFormat("vi-VN").format(t.price)} VNĐ
                      </td>
                      <td>
                        <button
                          className="btn-action btn-delete"
                          onClick={async () => {
                            if (window.confirm("Xóa hạng vé này?")) {
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
              style={{ textAlign: "center", padding: "50px", color: "#888" }}
            >
              Hãy chọn máy bay.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: "450px" }}>
            <h4>Phân bổ vé cho Chuyến bay</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>1. Chọn Chuyến bay (Bắt buộc)</label>
                <select
                  required
                  value={selectedFlightId}
                  onChange={(e) => setSelectedFlightId(e.target.value)}
                >
                  <option value="">-- Chọn chuyến bay --</option>
                  {flights.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.flight_number} |{" "}
                      {new Date(f.departure_time).toLocaleString("vi-VN")}
                    </option>
                  ))}
                </select>

                <label style={{ marginTop: "10px" }}>2. Chọn hạng vé</label>
                <select
                  required
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData({ ...formData, class_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn hạng --</option>
                  {ticketClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* THÊM TRƯỜNG NHẬP GIÁ TIỀN */}
                <label style={{ marginTop: "10px" }}>3. Giá tiền (VNĐ)</label>
                <input
                  type="number"
                  required
                  placeholder="Nhập giá vé..."
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

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
                      required
                      value={formData.row_start}
                      onChange={(e) =>
                        setFormData({ ...formData, row_start: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Hàng kết thúc</label>
                    <input
                      type="number"
                      min={formData.row_start}
                      required
                      value={formData.row_end}
                      onChange={(e) =>
                        setFormData({ ...formData, row_end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#e7f3ff",
                    textAlign: "center",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontSize: "13px" }}>
                    Giới hạn máy bay: <strong>{maxSeats} ghế</strong>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    Đã phân bổ cho chuyến này:{" "}
                    <strong>{seatsAlreadyAllocatedInModal} ghế</strong>
                  </div>
                  <hr
                    style={{ border: "0.5px solid #ccc", margin: "10px 0" }}
                  />
                  <div>
                    Số ghế dự kiến thêm:{" "}
                    <strong
                      style={{
                        fontSize: "24px",
                        color: isOverLimit ? "#e74c3c" : "#0056b3",
                      }}
                    >
                      {currentPlannedSeats}
                    </strong>
                  </div>
                  {isOverLimit && (
                    <div
                      style={{
                        color: "#e74c3c",
                        fontSize: "12px",
                        marginTop: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      ⚠️ Vượt quá tải của máy bay!
                    </div>
                  )}
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
                  style={{ backgroundColor: isOverLimit ? "#ccc" : "#007bff" }}
                  disabled={isOverLimit || currentPlannedSeats <= 0}
                >
                  Xác nhận
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
