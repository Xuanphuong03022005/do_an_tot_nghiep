import axiosClient from "./axiosClient";

const authApi = {

    login(data) {
        return axiosClient.post("/login", data);
    },
    // Thêm hàm này để Admin lấy danh sách user từ DB

    getAllUsers(email = "") {
        // Nếu có email thì gửi query string ?email=...
        return axiosClient.get(`/admin/users${email ? `?email=${email}` : ""}`);
    },
    createUser(data) {
        return axiosClient.post("/admin/users", data);
    },
    updateUser(id, data) {
        return axiosClient.put(`/admin/users/${id}`, data);
    },
    deleteUser(id) {
        return axiosClient.delete(`/admin/users/${id}`);
    }
};

export default authApi;