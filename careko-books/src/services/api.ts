import axios from "axios";

const api = axios.create({
    baseURL: "https://api.carekobooks.space",
    withCredentials: true
})

export default api;