import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLetsConnect,
  createLetsConnect,
  type LetsConnect,
  type CreateLetsConnectPayload,
} from "../services/connectServices";

export function useCreateLetsConnectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLetsConnectPayload & { companyId: string }) =>
      createLetsConnect(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["letsConnect"] });
      queryClient.invalidateQueries({
        queryKey: ["letsConnect", variables.companyId],
      });
    },
  });
}

export function useLetsConnectQuery(companyId?: string) {
  const queryKey = companyId ? ["letsConnect", companyId] : ["letsConnect"];

  return useQuery<LetsConnect[]>({
    queryKey,
    queryFn: () => fetchLetsConnect(companyId),
  });
}
