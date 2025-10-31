import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrl } from "@/utils/apiEndpoints";
import { CorePricingResponse } from "./types";

// API functions
export const pricingApi = {
  /**
   * Get core pricing information
   * GET /v1/api/pricing/calculate
   */
  getCorePricing: async (): Promise<CorePricingResponse> => {
    const url = buildApiUrl(API_ENDPOINTS.PRICING.GET);
    const response = await apiClient.get<CorePricingResponse>(url);
    return response.data;
  },
};
