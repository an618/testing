import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrlWithQuery } from "@/utils/apiEndpoints";
import { ParticipantsListResponse, ParticipantsListParams } from "./types";

/**
 * Participants API functions
 */
export const participantsApi = {
  /**
   * Get list of participants
   */
  getParticipantsList: async (
    params?: ParticipantsListParams
  ): Promise<ParticipantsListResponse> => {
    const url = buildApiUrlWithQuery(
      API_ENDPOINTS.PARTICIPANTS.LIST,
      (params ?? {}) as Record<string, string | number | boolean>
    );
    const response = await apiClient.get<ParticipantsListResponse>(url);
    return response.data;
  },
};

