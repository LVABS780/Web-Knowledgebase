import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export interface CommonResponse {
  message: string;
}

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
