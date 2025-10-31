import { apiClient } from "@/api/client";
import { API_ENDPOINTS, buildApiUrl } from "@/utils/apiEndpoints";
import {
  CompanyPlanRequest,
  CompanyPlanResponse,
  PlanDetails,
  PlanStartDate,
  PlanState,
  PlanType,
  PricingPlan,
} from "./types";

// API functions
export const planSponserApi = {
  /**
   * Get available pricing plans
   * GET /v1/api/pricing/plans
   */
  getPricingPlans: async (): Promise<PricingPlan[]> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.PLANS);
    const response = await apiClient.get<PricingPlan[]>(url);
    return response.data;
  },

  /**
   * Get plan state
   * GET /v1/api/plan-sponsor/state
   */
  getPlanState: async (): Promise<PlanState> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.STATE);
    const response = await apiClient.get<PlanState>(url);
    return response.data;
  },

  /**
   * Get plan details
   * GET /v1/api/plan-sponsor/details
   */
  getPlanDetails: async (): Promise<PlanDetails> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.DETAILS);
    const response = await apiClient.get<PlanDetails>(url);
    return response.data;
  },

  /**
   * Create or update plan details
   * POST /v1/api/plan-sponsor/details
   */
  createPlanDetails: async (data: PlanDetails): Promise<PlanDetails> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.DETAILS);
    const response = await apiClient.post<PlanDetails>(url, data);
    return response.data;
  },

  /**
   * Save plan start date and milestone dates
   * POST /v1/api/plan-sponsor/plan/start-date
   */
  savePlanStartDate: async (data: PlanStartDate): Promise<void> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.START_DATE);
    await apiClient.post(url, data);
  },

  createPlan: async (
    data: CompanyPlanRequest
  ): Promise<CompanyPlanResponse> => {
    const response = await apiClient.post<CompanyPlanResponse>(
      API_ENDPOINTS.PLAN_SPONSER.CREATE,
      data
    );
    return response.data;
  },

  /**
   * Fetch all plan types
   * GET /v1/api/plan-sponsor/plan/types
   */
  getAllPlanTypes: async (): Promise<PlanType[]> => {
    const url = buildApiUrl(API_ENDPOINTS.PLAN_SPONSER.PLANS);
    const response = await apiClient.get<PlanType[]>(url);
    return response.data;
  },

  /**
   * Create company plan
   * POST /v1/api/plan-sponsor/plan
   */
  createCompanyPlan: async (
    data: CompanyPlanRequest
  ): Promise<CompanyPlanResponse> => {
    const response = await apiClient.post<CompanyPlanResponse>(
      API_ENDPOINTS.PLAN_SPONSER.CREATE,
      data
    );
    return response.data;
  },
};
