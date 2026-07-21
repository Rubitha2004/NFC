// Axios service (architecture only – no API calls yet)
import axios from "axios";
import { API_BASE_URL } from "@/shared/utils/constants";

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
    const auth = localStorage.getItem("factory-os-auth");
    if (auth) {
      const { state } = JSON.parse(auth);
      if (state?.token) {
        config.headers.set("Authorization", `Bearer ${state.token}`);
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
