import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrlWithQuery } from "@/utils/apiEndpoints";
import { DocumentsListResponse, DocumentsListParams } from "./types";

/**
 * Documents API functions
 */
export const documentsApi = {
  /**
   * Get list of documents
   */
  getDocumentsList: async (
    params?: DocumentsListParams
  ): Promise<DocumentsListResponse> => {
    const url = buildApiUrlWithQuery(
      API_ENDPOINTS.DOCUMENTS.LIST,
      (params ?? {}) as Record<string, string | number | boolean>
    );
    const response = await apiClient.get<DocumentsListResponse>(url);
    return response.data;
  },
};
