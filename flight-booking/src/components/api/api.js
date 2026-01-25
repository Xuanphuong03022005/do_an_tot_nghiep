import axios from "axios";
const api = axios.create({
    baseURL: "http://book-flight-tickets.vn/api",
    headers: {
        "Content-Type": "application/json",
    },
}); 
export default api;