import axios from "axios";

const api = axios.create({
    baseURL: "https://api.carekobooks.space"
})

export default api;