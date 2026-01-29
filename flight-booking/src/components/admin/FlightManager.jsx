import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";
// --- QUẢN LÝ API TẬP TRUNG ---
const BASE_URL = "http://127.0.0.1:8000/api";
const API_ENDPOINTS = {
  AIRLINES: `${BASE_URL}/admin/airline`,
  FLIGHTS: `${BASE_URL}/admin/flights`,
  FLIGHT_DETAIL: `${BASE_URL}/admin/flight`,
  AIRPORTS: `${BASE_URL}/admin/airports`,
  TICKETS: `${BASE_URL}/admin/tickets`,
};
const FlightManager = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [selectedAirlineTickets, setSelectedAirlineTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [airports, setAirports] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    flight_number: "",
    departure_airport_id: "",
    arrival_airport_id: "",
    airline_id: "",
    departure_date: "",
    dep_time: "",
    arr_time: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // 1. Load dữ liệu ban đầu
  const fetchInitialData = async () => {
    try {
      const [resAirlines, resFlights, resAirports] = await Promise.all([
        axios.get(API_ENDPOINTS.AIRLINES),
        axios.get(API_ENDPOINTS.FLIGHTS),
        axios.get(API_ENDPOINTS.AIRPORTS),
      ]);

      setAirlines(resAirlines.data);
      const flightArray = resFlights.data?.data || [];
      setFlights(Array.isArray(flightArray) ? flightArray : []);
      setAirports(resAirports.data || []);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Xóa chuyến bay
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`${API_ENDPOINTS.FLIGHT_DETAIL}/${id}`);
        alert("Xóa thành công!");
        setFlights(flights.filter((f) => f.id !== id));
      } catch (error) {
        alert("Lỗi: " + (error.response?.data?.message || "Hệ thống"));
      }
    }
  };

  // 3. Xem chi tiết
  const handleViewDetail = async (id) => {
    try {
      const res = await axios.get(`${API_ENDPOINTS.FLIGHT_DETAIL}/${id}`);
      setSelectedFlight(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert("Không thể tải chi tiết.");
    }
  };

  // 4. Khi chọn Máy bay (để lấy cấu hình vé của hãng đó)
  const handleAirlineChange = async (airlineId) => {
    setFormData({ ...formData, airline_id: airlineId });
    if (!airlineId) {
      setSelectedAirlineTickets([]);
      return;
    }
    try {
      // URL có tham số query
      const res = await axios.get(
        `${API_ENDPOINTS.TICKETS}?airline_id=${airlineId}`
      );
      const tickets = res.data.data.data || res.data.data || [];
      const ticketsWithPrice = tickets.map((t) => ({ ...t, inputPrice: "" }));
      setSelectedAirlineTickets(ticketsWithPrice);
    } catch (error) {
      setSelectedAirlineTickets([]);
    }
  };

  const handlePriceChange = (id, value) => {
    const updatedTickets = selectedAirlineTickets.map((t) =>
      t.id === id ? { ...t, inputPrice: value } : t
    );
    setSelectedAirlineTickets(updatedTickets);
  };

  // 5. Submit thêm chuyến bay mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      airline_id: Number(formData.airline_id),
      departure_airport_id: Number(formData.departure_airport_id),
      arrival_airport_id: Number(formData.arrival_airport_id),
      flight_number: formData.flight_number,

      outbound_flight: {
        departure_time: `${formData.departure_date} ${formData.dep_time}:00`,
        arrival_time: `${formData.departure_date} ${formData.arr_time}:00`,
      },
    };

    try {
      await axios.post(API_ENDPOINTS.FLIGHT_DETAIL, payload);
      alert("Tạo chuyến bay thành công!");
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || "Hệ thống"));
    }
  };

  return (
    <div className="manager-section">
      <div className="header-flex">
        <h3>Quản lý Chuyến bay</h3>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          + Thêm Chuyến bay mới
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Số hiệu</th>
            <th>Lộ trình</th>
            <th>Máy bay</th>
            <th>Khởi hành</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((f) => (
            <tr key={f.id}>
              <td>
                <strong>{f.flight_number}</strong>
              </td>
              <td>
                {f.dep_code} ✈ {f.arr_code}
              </td>
              <td>{f.airline?.name}</td>
              <td>{f.departure_time}</td>
              <td>
                <button
                  className="btn-action btn-edit"
                  onClick={() => handleViewDetail(f.id)}
                >
                  Xem
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(f.id)} // Gắn sự kiện ở đây
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
          <div className="modal-content" style={{ width: "650px" }}>
            <h4>Thêm chuyến bay mới</h4>
            <form onSubmit={handleSubmit}>
              <div
                className="form-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div className="form-group">
                  <label>Số hiệu chuyến bay</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: VN123"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        flight_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Chọn máy bay (Airline)</label>
                  <select
                    required
                    onChange={(e) => handleAirlineChange(e.target.value)}
                  >
                    <option value="">-- Chọn máy bay --</option>
                    {airlines.map((al) => (
                      <option key={al.id} value={al.id}>
                        {al.name} ({al.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sân bay đi</label>
                  <select
                    required
                    value={formData.departure_airport_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure_airport_id: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn sân bay đi --</option>
                    {airports.map((ap) => (
                      <option key={ap.id} value={ap.id}>
                        {ap.name} ({ap.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Sân bay đến</label>
                  <select
                    required
                    value={formData.arrival_airport_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        arrival_airport_id: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn sân bay đến --</option>
                    {airports.map((ap) => (
                      <option key={ap.id} value={ap.id}>
                        {ap.name} ({ap.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày xuất phát</label>
                  <input
                    type="date"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        departure_date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Giờ xuất phát / Giờ đến</label>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      type="time"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, dep_time: e.target.value })
                      }
                    />
                    <input
                      type="time"
                      required
                      onChange={(e) =>
                        setFormData({ ...formData, arr_time: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button
                  type="submit"
                  className="btn-save"
                  // Nút chỉ bị khóa nếu thiếu 1 trong 3 thông tin cơ bản này
                  disabled={
                    !formData.airline_id ||
                    !formData.departure_airport_id ||
                    !formData.arrival_airport_id ||
                    !formData.departure_date ||
                    !formData.dep_time ||
                    !formData.arr_time
                  }
                >
                  Lưu chuyến bay
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
      {isDetailModalOpen && selectedFlight && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ width: "650px", textAlign: "left" }}
          >
            <h4
              style={{
                borderBottom: "2px solid #eee",
                paddingBottom: "10px",
                color: "#007bff",
              }}
            >
              CHI TIẾT CHUYẾN BAY: {selectedFlight.flight_number}
            </h4>

            <div
              className="form-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Số hiệu chuyến bay</label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.flight_number || ""}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Máy bay (Airline)</label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.airline?.name || "N/A"}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Sân bay đi</label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.departure_airport?.name || "N/A"}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>Sân bay đến</label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.arrival_airport?.name || "N/A"}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>
                  Thời gian xuất phát
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.departure_time || ""}
                />
              </div>
              <div className="form-group">
                <label style={{ fontWeight: "bold" }}>
                  Thời gian đến (dự kiến)
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  value={selectedFlight.arrival_time || ""}
                />
              </div>
            </div>

            <div
              className="seat-info-section"
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f1f8ff",
                borderRadius: "5px",
                border: "1px solid #cce5ff",
              }}
            >
              <h5 style={{ marginBottom: "10px", color: "#004085" }}>
                Cấu hình giá vé đã lưu:
              </h5>
              {selectedFlight.tickets && selectedFlight.tickets.length > 0 ? (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {selectedFlight.tickets.map((t) => (
                    <li
                      key={t.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                        borderBottom: "1px solid #dee2e6",
                        paddingBottom: "5px",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#333" }}>
                          {t.seat_class?.name || `Hạng ${t.class_id}`}
                        </strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Số lượng: {t.total_seats} ghế ({t.row_start} -{" "}
                          {t.row_end})
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#28a745",
                          fontSize: "16px",
                        }}
                      >
                        {new Intl.NumberFormat("vi-VN").format(t.price)} VNĐ
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: "#721c24", fontStyle: "italic" }}>
                  Chưa có dữ liệu vé cho chuyến bay này.
                </p>
              )}
            </div>

            <div
              className="modal-actions"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn-cancel"
                onClick={() => setIsDetailModalOpen(false)}
                style={{ padding: "8px 20px" }}
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightManager;
