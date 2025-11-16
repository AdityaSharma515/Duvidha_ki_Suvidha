import axios from "axios";

const API = axios.create({
  baseURL: process.env.BACKEND+"/api/v1" || "http://localhost:5001/api/v1",
});

// 🔐 Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
