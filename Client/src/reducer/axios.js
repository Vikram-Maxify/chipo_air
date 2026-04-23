import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5004/api/auth", // 👈 tumhara auth route
  withCredentials: true,
});

// 🔹 SEND OTP
export const sendOtpAPI = (data) => API.post("/send-otp", data);

// 🔹 VERIFY OTP
export const verifyOtpAPI = (data) => API.post("/verify-otp", data);

// 🔹 SET PASSWORD
export const setPasswordAPI = (data) => API.post("/set-password", data);

export default API;