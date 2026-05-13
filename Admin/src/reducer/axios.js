import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5004/api",
    // baseURL:"/api",
    withCredentials: true,
});

export default API;