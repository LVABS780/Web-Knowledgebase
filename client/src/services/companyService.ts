import { API } from "@/lib/api-client";

export type Company = {
  _id: string;
  address: string;
  isActive: boolean;
  superAdminId: string;
};

export type CompanyAdmin = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  companyId: string;
};

export type CompanyItem = {
  company: Company;
  companyAdmin: CompanyAdmin | null;
  superAdmin: {
    _id: string;
    name?: string;
    email?: string;
  } | null;
};

export type CreateCompanyPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  address?: string;
};

export async function fetchCompanies(): Promise<CompanyItem[]> {
  const res = await API.get("/company");
  return res.data.data as CompanyItem[];
}

export async function createCompany(payload: CreateCompanyPayload) {
  const res = await API.post("/company", payload);
  return res.data;
}

export type UpdateCompanyPayload = {
  companyId: string;
  companyAddress?: string;
  isActive?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};

export async function updateCompany(payload: UpdateCompanyPayload) {
  const { companyId, ...body } = payload;
  const res = await API.patch(`/company/${companyId}`, body);
  return res.data;
}

export async function deleteCompany(companyId: string) {
  const res = await API.delete(`/company/${companyId}`);
  return res.data;
}
