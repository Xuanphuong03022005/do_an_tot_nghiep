import React, { useState, useEffect } from "react";
import authApi from "../api/authApi";

function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [history, setHistory] = useState([]);
    const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Lớp nền tối phía sau
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: "#fff",
        padding: "25px",
        borderRadius: "12px",
        width: "800px", // Độ rộng phù hợp để hiển thị bảng lịch sử
        maxHeight: "85vh",
        overflowY: "auto", // Tự động tạo thanh cuộn nếu danh sách quá dài
        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        position: "relative",
    };
    const fetchUsers = async (email = "") => {
        setLoading(true);
        try {
            const res = await authApi.getAllUsers(email);
            // axiosClient đã bóc tách response.data nên res là dữ liệu thực tế
            const finalData = res.data || res || [];
            setUsers(Array.isArray(finalData) ? finalData : []);
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(searchTerm);
    };

    const viewHistory = async (userId) => {
        try {
            const res = await authApi.getUserHistory(userId);
            // Dữ liệu từ API mới sẽ là mảng các đơn hàng (bookings)
            setHistory(res.data || res || []);
            setShowModal(true);
        } catch (err) {
            alert("Người dùng này chưa có lịch sử đặt vé.");
        }
    };

    if (loading)
        return <div className="p-4 text-center">Đang kết nối hệ thống...</div>;

    return (
        <div
            className="manager-container"
            style={{
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "8px",
            }}
        >
            <div
                className="header-section"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h3 style={{ margin: 0 }}>Quản lý người dùng hệ thống</h3>
                <form onSubmit={handleSearch} style={{ display: "flex" }}>
                    <input
                        type="text"
                        placeholder="Tìm theo email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px 0 0 4px",
                            width: "250px",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "0 4px 4px 0",
                            cursor: "pointer",
                        }}
                    >
                        Tìm kiếm
                    </button>
                </form>
            </div>

            <table width="100%" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr
                        style={{
                            backgroundColor: "#f8f9fa",
                            borderBottom: "2px solid #dee2e6",
                        }}
                    >
                        <th style={{ padding: "12px", textAlign: "left" }}>
                            ID
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                            Tên hành khách
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                            Email
                        </th>
                        {/* Thêm tiêu đề cột mới */}
                        <th style={{ padding: "12px", textAlign: "left" }}>
                            Số điện thoại
                        </th>
                        <th style={{ padding: "12px", textAlign: "left" }}>
                            Địa chỉ
                        </th>
                        <th style={{ padding: "12px", textAlign: "center" }}>
                            Thao tác
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                style={{ borderBottom: "1px solid #eee" }}
                            >
                                <td style={{ padding: "12px" }}>{user.id}</td>
                                <td style={{ padding: "12px" }}>
                                    <strong>{user.name}</strong>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    {user.email}
                                </td>
                                {/* Hiển thị dữ liệu Phone và Address */}
                                <td style={{ padding: "12px" }}>
                                    {user.phone || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px",
                                        maxWidth: "200px",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {user.address || "N/A"}
                                </td>
                                <td
                                    style={{
                                        padding: "12px",
                                        textAlign: "center",
                                    }}
                                >
                                    <button
                                        onClick={() => viewHistory(user.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#007bff",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Lịch sử bay
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                style={{ padding: "30px", textAlign: "center" }}
                            >
                                Không có dữ liệu. Hãy kiểm tra Route Laravel
                                (404).
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "15px",
                            }}
                        >
                            <h4 style={{ margin: 0 }}>
                                Lịch sử đặt vé khách hàng #{history[0]?.user_id}
                            </h4>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                }}
                            >
                                &times;
                            </button>
                        </div>

                        <table
                            width="100%"
                            style={{
                                borderCollapse: "collapse",
                                fontSize: "14px",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: "#f8f9fa",
                                        borderBottom: "2px solid #eee",
                                    }}
                                >
                                    <th
                                        style={{
                                            padding: "10px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Mã PNR
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Chuyến bay
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Hạng ghế
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Tổng tiền
                                    </th>
                                    <th
                                        style={{
                                            padding: "10px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: "1px solid #eee",
                                            }}
                                        >
                                            <td style={{ padding: "10px" }}>
                                                <strong>{item.pnr_code}</strong>
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                {/* Hiển thị số hiệu chuyến bay từ quan hệ ticket.flight */}
                                                {item.ticket?.flight
                                                    ?.flight_number || "N/A"}
                                                <br />
                                                <small
                                                    style={{ color: "#666" }}
                                                >
                                                    {
                                                        item.ticket?.flight
                                                            ?.departure_time
                                                    }
                                                </small>
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                {item.ticket?.seat_class
                                                    ?.name || "N/A"}
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                {/* Sử dụng total_final theo đúng cấu trúc bảng bookings của bạn */}
                                                {item.total_final
                                                    ? parseInt(
                                                          item.total_final
                                                      ).toLocaleString()
                                                    : 0}
                                                đ
                                            </td>
                                            <td
                                                style={{
                                                    padding: "10px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        backgroundColor:
                                                            item.status ===
                                                                "success" ||
                                                            item.status ===
                                                                "ticketed"
                                                                ? "#d4edda"
                                                                : item.status ===
                                                                  "pending"
                                                                ? "#fff3cd"
                                                                : "#f8d7da",
                                                        color:
                                                            item.status ===
                                                                "success" ||
                                                            item.status ===
                                                                "ticketed"
                                                                ? "#155724"
                                                                : item.status ===
                                                                  "pending"
                                                                ? "#856404"
                                                                : "#721c24",
                                                    }}
                                                >
                                                    {item.status
                                                        ? item.status.toUpperCase()
                                                        : "N/A"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            style={{
                                                padding: "20px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Không có dữ liệu bay
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div style={{ textAlign: "right", marginTop: "20px" }}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn-close-modal"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManager;
