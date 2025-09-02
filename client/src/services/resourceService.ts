import { API } from "@/lib/api-client";

export type Resource = {
  _id: string;
  title: string;
  description: string;
  sections?: { subtitle: string; description: string }[];
  createdBy: string;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ResourceCreator = {
  _id: string;
  name: string;
  email: string;
};

export type ResourceCompany = {
  _id: string;
  name: string;
};

export type ResourceItem = {
  _id: string;
  title: string;
  description: string;
  sections?: { subtitle: string; description: string }[];
  createdBy: ResourceCreator;
  companyId: ResourceCompany;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateResourcePayload = {
  title: string;
  description: string;
  sections?: { subtitle: string; description: string }[];
};

export type UpdateResourcePayload = {
  resourceId: string;
  title?: string;
  description?: string;
  sections?: { subtitle: string; description: string }[];
  isActive?: boolean;
};

export async function fetchResources(params?: {
  search?: string;
  isActive?: boolean;
}): Promise<ResourceItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const url = `/resource${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const res = await API.get(url);
  return res.data.data as ResourceItem[];
}

export async function fetchResourceById(
  resourceId: string
): Promise<ResourceItem> {
  const res = await API.get(`/resource/${resourceId}`);
  return res.data.data as ResourceItem;
}

export async function createResource(payload: CreateResourcePayload) {
  const res = await API.post("/resource", payload);
  return res.data;
}

export async function updateResource(payload: UpdateResourcePayload) {
  const { resourceId, ...body } = payload;
  const res = await API.put(`/resource/${resourceId}`, body);
  return res.data;
}

export async function deleteResource(resourceId: string) {
  const res = await API.delete(`/resource/${resourceId}`);
  return res.data;
}

export async function fetchResourcesByCompany(
  companyId: string,
  params?: {
    search?: string;
    isActive?: boolean;
  }
): Promise<ResourceItem[]> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append("search", params.search);
  if (params?.isActive !== undefined)
    queryParams.append("isActive", params.isActive.toString());

  const url = `/resource/company/${companyId}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const res = await API.get(url);
  return res.data.data as ResourceItem[];
}
