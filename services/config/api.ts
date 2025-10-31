import { apiClient } from "@/api/client";
import { AppConfig } from "./types";
import { API_ENDPOINTS, buildApiUrl } from "@/utils/apiEndpoints";

export const systemApi = {
  /**
   * Fetch app configuration
   * GET /v1/api/config/global
   */
  getConfig: async (): Promise<AppConfig> => {
    const url = buildApiUrl(API_ENDPOINTS.SYSTEM.CONFIG);
    const response = await apiClient.get<AppConfig>(url);
    return response.data;
  },
};
