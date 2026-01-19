import axiosClient from "./axiosClient";

const authApi = {
    register(data) {
        return axiosClient.post("/register", data);
    },
    login(data) {
        return axiosClient.post("/login", data);
    },
    // Thêm hàm này để Admin lấy danh sách user từ DB
    getAllUsers() {
        return axiosClient.get("/users");
    }
};

export default authApi;