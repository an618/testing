import { useQuery } from "@tanstack/react-query";
import { tenantApi } from "./api";
import { TenantResolveResponse } from "./types";

export const useTenantResolve = (
  email: string,
  role: string = "EMPLOYER",
  enabled: boolean = true
) => {
  return useQuery<TenantResolveResponse>({
    queryKey: ["tenant-resolve", email, role],
    queryFn: () => tenantApi.resolve(email, role),
    enabled: enabled && !!email && email.trim().length > 0,
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
