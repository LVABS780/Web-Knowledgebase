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
    mutationFn: (payload: CreateLetsConnectPayload) =>
      createLetsConnect(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letsConnect"] });
    },
  });
}

export function useLetsConnectQuery() {
  return useQuery<LetsConnect[]>({
    queryKey: ["letsConnect"],
    queryFn: fetchLetsConnect,
  });
}
