import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";

// Khai báo các URL API
const API_URL_PENDING = "http://127.0.0.1:8000/api/admin/booking-pending/61";
const API_STATUS_URL = "http://127.0.0.1:8000/api/admin/change-status-booking";

const BookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL_PENDING);
            const data = response.data;
            if (data && typeof data === "object" && !Array.isArray(data)) {
                setBookings([data]);
            } else {
                setBookings(data || []);
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleViewDetail = async (id) => {
        try {
            setShowModal(true);
            const response = await axios.get(
                `http://127.0.0.1:8000/api/admin/booking-pending/${id}`
            );
            setSelectedBooking(response.data);
        } catch (error) {
            alert("Lỗi tải chi tiết đơn hàng!");
        }
    };

    // Hàm cập nhật trạng thái chung (Dùng cho cả Duyệt và Từ chối)
    const handleUpdateStatus = async (id, newStatus) => {
        const actionText = newStatus === "success" ? "DUYỆT" : "TỪ CHỐI";
        const confirmMsg = `Bạn có chắc chắn muốn ${actionText} đơn hàng ${id} này không?`;

        if (window.confirm(confirmMsg)) {
            try {
                await axios.put(`${API_STATUS_URL}/${id}`, {
                    status: newStatus,
                });
                alert(`${actionText} đơn hàng thành công!`);
                setShowModal(false);
                fetchBookings(); // Load lại dữ liệu để cập nhật bảng
            } catch (error) {
                console.error("Lỗi cập nhật:", error);
                alert("Đã có lỗi xảy ra khi cập nhật trạng thái!");
            }
        }
    };

    if (loading)
        return <div style={{ padding: "20px" }}>Đang kết nối dữ liệu...</div>;

    return (
        <div className="manager-container" style={{ padding: "20px" }}>
            <h3>Quản lý Đặt vé & Đối soát</h3>

            <table
                className="admin-table"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                }}
            >
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderBottom: "2px solid #dee2e6",
                            textAlign: "left",
                        }}
                    >
                        <th style={{ padding: "12px" }}>ID / PNR</th>
                        <th style={{ padding: "12px" }}>TỔNG TIỀN</th>
                        <th style={{ padding: "12px" }}>TRẠNG THÁI</th>
                        <th style={{ padding: "12px" }}>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((item) => (
                        <tr
                            key={item.id}
                            style={{ borderBottom: "1px solid #eee" }}
                        >
                            <td style={{ padding: "12px" }}>
                                <strong>#{item.id}</strong> <br />
                                <small style={{ color: "#007bff" }}>
                                    {item.pnr_code}
                                </small>
                            </td>
                            <td style={{ padding: "12px", fontWeight: "bold" }}>
                                {parseInt(item.total_final).toLocaleString()}đ
                            </td>
                            <td style={{ padding: "12px" }}>
                                <span
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        backgroundColor:
                                            item.status === "success"
                                                ? "#f6ffed"
                                                : "#fff7e6",
                                        color:
                                            item.status === "success"
                                                ? "#52c41a"
                                                : "#faad14",
                                        border: `1px solid ${
                                            item.status === "success"
                                                ? "#b7eb8f"
                                                : "#ffe58f"
                                        }`,
                                    }}
                                >
                                    ●{" "}
                                    {item.status === "success"
                                        ? "Đã duyệt"
                                        : "Đang chờ"}
                                </span>
                            </td>
                            <td style={{ padding: "12px" }}>
                                <button
                                    onClick={() => handleViewDetail(item.id)}
                                    style={{
                                        backgroundColor: "#1890ff",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Kiểm tra đơn
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Đối soát */}
            {showModal && selectedBooking && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "25px",
                            borderRadius: "8px",
                            width: "650px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            Đối soát thanh toán đơn #{selectedBooking.id}
                        </h3>
                        <hr style={{ border: "0.5px solid #eee" }} />

                        <div
                            style={{
                                display: "flex",
                                gap: "25px",
                                marginTop: "20px",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <p>
                                    <strong>Mã PNR:</strong>{" "}
                                    <span style={{ color: "#1890ff" }}>
                                        {selectedBooking.pnr_code}
                                    </span>
                                </p>
                                <p>
                                    <strong>Số tiền cần khớp:</strong>{" "}
                                    <span
                                        style={{
                                            color: "#f5222d",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {parseInt(
                                            selectedBooking.total_final
                                        ).toLocaleString()}
                                        đ
                                    </span>
                                </p>
                                <p>
                                    <strong>Trạng thái hiện tại:</strong>{" "}
                                    {selectedBooking.status}
                                </p>
                            </div>
                            <div style={{ flex: 1, textAlign: "center" }}>
                                <strong>Bằng chứng chuyển khoản:</strong> <br />
                                {selectedBooking.payments?.[0]?.image ? (
                                    <img
                                        src={selectedBooking.payments[0].image}
                                        alt="Bill"
                                        style={{
                                            width: "100%",
                                            marginTop: "10px",
                                            borderRadius: "4px",
                                            border: "1px solid #ddd",
                                            maxHeight: "250px",
                                            objectFit: "contain",
                                        }}
                                    />
                                ) : (
                                    <p
                                        style={{
                                            color: "#999",
                                            padding: "20px",
                                            border: "1px dashed #ccc",
                                            marginTop: "10px",
                                        }}
                                    >
                                        Khách hàng chưa upload ảnh bill
                                    </p>
                                )}
                            </div>
                        </div>

                        <div
                            style={{
                                textAlign: "right",
                                marginTop: "30px",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "12px",
                            }}
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "4px",
                                    border: "1px solid #d9d9d9",
                                    background: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                Đóng
                            </button>

                            {/* Chỉ hiện nút xử lý nếu đơn chưa được Duyệt */}
                            {selectedBooking.status !== "success" && (
                                <>
                                    {/* NÚT TỪ CHỐI */}
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(
                                                selectedBooking.id,
                                                "cancelled"
                                            )
                                        }
                                        style={{
                                            backgroundColor: "#ff4d4f",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Từ chối đơn
                                    </button>

                                    {/* NÚT DUYỆT */}
                                    <button
                                        onClick={() =>
                                            handleUpdateStatus(
                                                selectedBooking.id,
                                                "success"
                                            )
                                        }
                                        style={{
                                            backgroundColor: "#52c41a",
                                            color: "white",
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Duyệt & Xuất vé
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManager;
