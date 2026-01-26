import axiosClient from "./axiosClient";

const authApi = {
    register(data) {
        return axiosClient.post("/register", data);
    },
    login(data) {
        return axiosClient.post("/login", data);
    },
    // Thêm hàm này để Admin lấy danh sách user từ DB

    getAllUsers(email = "") {
        // Nếu có email thì gửi query string ?email=...
        return axiosClient.get(`/admin/users${email ? `?email=${email}` : ""}`);
    },
    getUserHistory(userId) {
        return axiosClient.get(`/users/${userId}/history`);

    }
};

export default authApi;