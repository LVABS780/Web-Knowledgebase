import { API } from "@/lib/api-client";

export type LetsConnect = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  services: string[];
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateLetsConnectPayload = {
  name: string;
  email: string;
  phone?: string;
  services: string[];
};

export async function fetchLetsConnect(
  companyId?: string
): Promise<LetsConnect[]> {
  const url = companyId ? `/connect/${companyId}` : "/connect";
  const res = await API.get(url);
  return res.data.data as LetsConnect[];
}

export async function createLetsConnect(
  payload: CreateLetsConnectPayload & { companyId: string }
) {
  const { companyId, ...body } = payload;
  const res = await API.post(`/connect/${companyId}`, body);
  return res.data;
}
