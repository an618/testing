"use client";

import { useQuery } from "@tanstack/react-query";
import { vestingApi } from "./api";
import { queryKeys } from "@/utils/queryKeys";

// Hook for fetching master vesting schedules
export const useMasterVestingSchedules = () => {
  return useQuery({
    queryKey: [...queryKeys.vesting.all, "master"],
    queryFn: () => vestingApi.getMasterSchedules(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
