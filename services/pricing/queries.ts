"use client";

import { useQuery } from "@tanstack/react-query";
import { pricingApi } from "./api";
import { queryKeys } from "@/utils/queryKeys";

// Hook for fetching core pricing
export const useCorePricing = () => {
  return useQuery({
    queryKey: [...queryKeys.pricing.all, "core"],
    queryFn: () => pricingApi.getCorePricing(),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
