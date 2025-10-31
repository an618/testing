import { useQuery } from "@tanstack/react-query";
import { systemApi } from "./api";
import { queryKeys } from "@/utils/queryKeys";

interface UseConfigOptions {
  enabled?: boolean;
}

export const useConfig = (options?: UseConfigOptions) => {
  return useQuery({
    queryKey: queryKeys.config.all,
    queryFn: systemApi.getConfig,
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (React Query v5 uses gcTime instead of cacheTime)
    refetchOnWindowFocus: false,
  });
};
