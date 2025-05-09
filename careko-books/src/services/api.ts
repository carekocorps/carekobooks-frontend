import axios from "axios";

const api = axios.create({
    baseURL: "https://api.fanclub-bbb.shop"
})

export default api;