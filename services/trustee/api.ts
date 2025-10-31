import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/utils/apiEndpoints";
import {
  TrusteeConfirmationRequest,
  TrusteeConfirmationResponse,
  TrusteeSignatureRequest,
  TrusteeSignatureResponse,
} from "./types";

export const trusteeApi = {
  /**
   * Confirm trustee agreement
   * POST /v1/api/trustee/confirmation
   */
  confirm: async (
    data: TrusteeConfirmationRequest
  ): Promise<TrusteeConfirmationResponse> => {
    const response = await apiClient.post<TrusteeConfirmationResponse>(
      API_ENDPOINTS.TRUSTEE.CONFIRM,
      data
    );
    return response.data;
  },
  /**
   * Submit trustee signature
   * POST /v1/api/trustee/signature
   */
  sign: async (
    data: TrusteeSignatureRequest
  ): Promise<TrusteeSignatureResponse> => {
    const response = await apiClient.post<TrusteeSignatureResponse>(
      API_ENDPOINTS.TRUSTEE.SIGN,
      data
    );
    return response.data;
  },
};
