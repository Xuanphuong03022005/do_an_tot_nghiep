import axiosClient from "./axiosClient";

const adminFlightApi = {
    getAll: () => axiosClient.get('/admin/flights'),
    create: (data) => axiosClient.post('/admin/flights', data),
    update: (id, data) => axiosClient.put(`/admin/flights/${id}`, data),
    delete: (id) => axiosClient.delete(`/admin/flights/${id}`),

    search: (params) => {
        // Đảm bảo đường dẫn này khớp chính xác với Route::get trong Laravel
        return axiosClient.get("/flights/search", { params });
    }
};

export default adminFlightApi;
