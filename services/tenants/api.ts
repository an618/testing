import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrlWithQuery } from "@/utils/apiEndpoints";
import { TenantResolveResponse } from "./types";

export const tenantApi = {
  resolve: async (
    email: string,
    role: string = "EMPLOYER"
  ): Promise<TenantResolveResponse> => {
    const url = buildApiUrlWithQuery(API_ENDPOINTS.AUTH.TENANTS_RESOLVE, {
      email,
      role,
    });
    const response = await apiClient.get(url);
    return response.data;
  },
};
