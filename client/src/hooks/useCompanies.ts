import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  createCompaniesBulk,
  deleteCompany,
  fetchCompanies,
  fetchCompanyById,
  updateCompany,
  CreateCompanyPayload,
  BulkCreateCompanyPayload,
  UpdateCompanyPayload,
  CompanyItem,
} from "@/services/companyService";

export function useCompaniesQuery() {
  return useQuery<CompanyItem[]>({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });
}

export function useCompanyById(
  companyId: string | undefined,
  enabled: boolean = true
) {
  return useQuery<CompanyItem>({
    queryKey: ["company", companyId],
    queryFn: () => fetchCompanyById(companyId!),
    enabled: enabled && !!companyId,
  });
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => createCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useBulkCreateCompaniesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BulkCreateCompanyPayload) =>
      createCompaniesBulk(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload) => updateCompany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (companyId: string) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}
