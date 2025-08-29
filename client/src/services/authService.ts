import axios from "axios";

const API = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

export interface LoginPayload {
  email?: string;
  phone?: string;
  password?: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: { _id: string; role: string; name?: string; email?: string };
  message: string;
}

export const loginAPI = (payload: LoginPayload) =>
  API.post<LoginResponse>("/login", payload).then((res) => res.data);
