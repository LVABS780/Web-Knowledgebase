import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createResource,
  deleteResource,
  fetchResources,
  fetchResourceById,
  updateResource,
  fetchResourcesByCompany,
  CreateResourcePayload,
  UpdateResourcePayload,
  ResourceItem,
  fetchCategories,
  type ResourceCategory,
} from "@/services/resourceService";

export function useResourcesQuery(params?: {
  search?: string;
  isActive?: boolean;
}) {
  return useQuery<ResourceItem[]>({
    queryKey: ["resources", params],
    queryFn: () => fetchResources(params),
  });
}

export function useResourceById(
  resourceId: string | undefined,
  enabled: boolean = true
) {
  return useQuery<ResourceItem>({
    queryKey: ["resource", resourceId],
    queryFn: () => fetchResourceById(resourceId!),
    enabled: enabled && !!resourceId,
  });
}

export function useResourcesByCompany(
  companyId: string,
  params?: {
    search?: string;
    isActive?: boolean;
  },
  enabled: boolean = true
) {
  return useQuery<ResourceItem[]>({
    queryKey: ["resources", "company", companyId],
    queryFn: () => fetchResourcesByCompany(companyId, params),
    enabled: enabled && !!companyId,
  });
}

export function useCreateResourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateResourcePayload) => createResource(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useUpdateResourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateResourcePayload) => updateResource(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      queryClient.invalidateQueries({
        queryKey: ["resource", variables.resourceId],
      });
    },
  });
}

export function useDeleteResourceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourceId: string) => deleteResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
}

export function useResourceCategories() {
  return useQuery<ResourceCategory[]>({
    queryKey: ["resource", "categories"],
    queryFn: () => fetchCategories(),
  });
}
