import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrl } from "@/utils/apiEndpoints";
import {
  EmployeeRegistrationRequest,
  EmployeeRegistrationResponse,
} from "./types";

export const employeeRegistrationApi = {
  register: async (
    data: EmployeeRegistrationRequest
  ): Promise<EmployeeRegistrationResponse> => {
    const url = buildApiUrl(API_ENDPOINTS.AUTH.REGISTER_EMPLOYER);
    const response = await apiClient.post<EmployeeRegistrationResponse>(
      url,
      data
    );
    return response.data;
  },
};
