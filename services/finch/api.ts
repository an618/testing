import { apiClient } from "@/api/client";
import {
  FinchUrlResponse,
  FinchCallbackRequest,
  FinchCallbackResponse,
} from "./types";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";

// API functions
export const finchApi = {
  /**
   * Get Finch authorization URL
   * GET /v1/api/finch/getfinchur
   */
  getFinchUrl: async (): Promise<FinchUrlResponse> => {
    const response = await apiClient.get<FinchUrlResponse>(
      API_ENDPOINTS.FINCH.GET_FINCH_URL
    );
    return response.data;
  },

  /**
   * Send Finch OAuth callback code
   * POST /v1/api/finch/callback
   */
  sendCallback: async (
    data: FinchCallbackRequest
  ): Promise<FinchCallbackResponse> => {
    const response = await apiClient.post<FinchCallbackResponse>(
      API_ENDPOINTS.FINCH.CALLBACK,
      data,
      {
        headers: {
          // "X-Tenant-ID": "1",
        },
      }
    );
    return response.data;
  },
};
