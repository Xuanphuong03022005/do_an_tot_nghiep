import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

const FlightManager = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [selectedAirlineTickets, setSelectedAirlineTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [airports, setAirports] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null); // Lưu dữ liệu chuyến bay chọn xem
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    flight_number: "",
    dep_code: "",
    arr_code: "",
    airline_id: "",
    departure_date: "",
    dep_time: "",
    arr_time: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/admin/flight";

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resAirlines, resFlights, resAirports] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/admin/airline"),
        axios.get("http://127.0.0.1:8000/api/admin/flights"),
        axios.get("http://127.0.0.1:8000/api/admin/airports"),
      ]);
      setAirlines(resAirlines.data);
      setFlights(resFlights.data || []);
      setAirports(resAirports.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // Hiển thị xác nhận trước khi xóa
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa chuyến bay này? Hành động này không thể hoàn tác."
      )
    ) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/admin/flight/${id}`);
        alert("Xóa thành công!");

        // Cập nhật lại danh sách hiển thị mà không cần load lại trang
        setFlights(flights.filter((f) => f.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert(
          "Không thể xóa chuyến bay. Lỗi: " +
            (error.response?.data?.message || "Lỗi hệ thống")
        );
      }
    }
  };

  // FlightManager.jsx
  const handleViewDetail = async (id) => {
    try {
      // Gọi trực tiếp để tránh sai sót từ biến API_URL
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/flight/${id}`
      );
      setSelectedFlight(res.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response?.data);
      alert("Không thể tải chi tiết. Hãy xem lỗi cụ thể ở tab Network.");
    }
  };

  const handleAirlineChange = async (airlineId) => {
    setFormData({ ...formData, airline_id: airlineId });
    if (!airlineId) {
      setSelectedAirlineTickets([]);
      return;
    }
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/tickets?airline_id=${airlineId}`
      );
      const tickets = res.data.data.data || res.data.data || [];

      // FIX: Khởi tạo thêm trường 'inputPrice' cho mỗi hạng vé để người dùng nhập
      const ticketsWithPrice = tickets.map((t) => ({ ...t, inputPrice: "" }));
      setSelectedAirlineTickets(ticketsWithPrice);
    } catch (error) {
      setSelectedAirlineTickets([]);
    }
  };

  // Hàm xử lý khi thay đổi giá tiền của từng hạng vé
  const handlePriceChange = (id, value) => {
    const updatedTickets = selectedAirlineTickets.map((t) =>
      t.id === id ? { ...t, inputPrice: value } : t
    );
    setSelectedAirlineTickets(updatedTickets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem tất cả hạng vé đã được nhập giá chưa
    if (
      selectedAirlineTickets.some((t) => !t.inputPrice || t.inputPrice <= 0)
    ) {
      alert("Vui lòng nhập giá tiền hợp lệ cho tất cả hạng vé!");
      return;
    }

    const payload = {
      flight_number: formData.flight_number,
      airline_id: formData.airline_id,
      dep_code: formData.dep_code,
      arr_code: formData.arr_code,
      departure_time: `${formData.departure_date} ${formData.dep_time}:00`,
      arrival_time: `${formData.departure_date} ${formData.arr_time}:00`,
      // Gửi mảng giá tiền do người dùng nhập lên Backend
      seat_classes: selectedAirlineTickets.map((t) => ({
        id: t.class_id,
        price: parseFloat(t.inputPrice),
      })),
    };

    try {
      await axios.post(API_URL, payload);
      alert("Thêm chuyến bay thành công!");
      setIsModalOpen(false);
      fetchInitialData();
    } catch (error) {
      alert(
        "Lỗi: " + (error.response?.data?.message || "Kiểm tra lại dữ liệu")
      );
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
                  <label>Sân bay đi (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="HAN"
                    onChange={(e) =>
                      setFormData({ ...formData, dep_code: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Sân bay đến (Code)</label>
                  <input
                    type="text"
                    required
                    placeholder="SGN"
                    onChange={(e) =>
                      setFormData({ ...formData, arr_code: e.target.value })
                    }
                  />
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

              <div
                className="seat-info-section"
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f9f9f9",
                  borderRadius: "5px",
                }}
              >
                <h5>Phân bổ giá vé cho chuyến bay này:</h5>
                {selectedAirlineTickets.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {selectedAirlineTickets.map((ticket) => (
                      <li
                        key={ticket.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                          borderBottom: "1px solid #eee",
                          paddingBottom: "8px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <strong>
                            {ticket.seat_class?.name ||
                              `Hạng ${ticket.class_id}`}
                          </strong>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Số lượng: {ticket.total_seats} ghế
                          </div>
                        </div>
                        <div style={{ flex: 1, textAlign: "right" }}>
                          <input
                            type="number"
                            placeholder="Nhập giá vé (VNĐ)"
                            required
                            style={{
                              width: "150px",
                              padding: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            value={ticket.inputPrice}
                            onChange={(e) =>
                              handlePriceChange(ticket.id, e.target.value)
                            }
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "red", fontSize: "13px" }}>
                    Vui lòng chọn máy bay để cấu hình giá vé.
                  </p>
                )}
              </div>

              <div className="modal-actions" style={{ marginTop: "20px" }}>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={selectedAirlineTickets.length === 0}
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
            style={{ width: "600px", textAlign: "left" }}
          >
            <h4
              style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}
            >
              Chi tiết chuyến bay: {selectedFlight.flight_number}
            </h4>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "15px",
              }}
            >
              <div>
                <p>
                  <strong>Máy bay:</strong> {selectedFlight.airline?.name}
                </p>
                <p>
                  <strong>Lộ trình:</strong> {selectedFlight.dep_code} ✈{" "}
                  {selectedFlight.arr_code}
                </p>
              </div>
              <div>
                <p>
                  <strong>Khởi hành:</strong> {selectedFlight.departure_time}
                </p>
                <p>
                  <strong>Giờ đến (dự kiến):</strong>{" "}
                  {selectedFlight.arrival_time}
                </p>
              </div>
            </div>

            <h5 style={{ marginTop: "20px", color: "#2c3e50" }}>
              Danh sách vé & Giá đã cấu hình:
            </h5>
            <table className="data-table" style={{ marginTop: "10px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th>Hạng vé</th>
                  <th>Số lượng</th>
                  <th>Giá bán</th>
                </tr>
              </thead>
              <tbody>
                {selectedFlight.tickets?.map((t) => (
                  <tr key={t.id}>
                    <td>{t.seat_class?.name}</td>
                    <td>{t.total_seats} ghế</td>
                    <td style={{ color: "green", fontWeight: "bold" }}>
                      {new Intl.NumberFormat().format(t.price)}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions" style={{ marginTop: "20px" }}>
              <button
                className="btn-cancel"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightManager;
