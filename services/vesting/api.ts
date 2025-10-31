import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import { VestingSchedule } from "./types";

// API functions
export const vestingApi = {
  /**
   * Get master vesting schedules
   * GET /v1/api/vesting/master
   */
  getMasterSchedules: async (): Promise<VestingSchedule[]> => {
    const response = await apiClient.get<VestingSchedule[]>(
      API_ENDPOINTS.PLAN_SPONSER.VESTING
    );
    return response.data;
  },
};
