import { API } from "@/lib/api-client";

export type LetsConnect = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  services: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateLetsConnectPayload = {
  name: string;
  email: string;
  phone?: string;
  services: string[];
};

export async function fetchLetsConnect(): Promise<LetsConnect[]> {
  const res = await API.get("/connect");
  return res.data.data as LetsConnect[];
}

export async function createLetsConnect(payload: CreateLetsConnectPayload) {
  const res = await API.post("/connect", payload);
  return res.data;
}
