// Axios service (architecture only – no API calls yet)
import axios from "axios";
import { API_BASE_URL } from "@/shared/utils/constants";
import { useAuthStore } from "@/store/auth.store";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else if (config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("factory-os-auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
