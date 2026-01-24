import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
// JWT auto-added
//✅ Global error handling

