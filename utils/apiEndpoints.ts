/**
 * Centralized API endpoints configuration
 * All API endpoints are defined here for easy management and consistency
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090/v1/api";

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: "/auth/login",
    TENANTS_RESOLVE: "/auth/tenants/resolve",
    REGISTER_EMPLOYER: "/auth/register/employer",
  },
  // Configuration endpoints
  SYSTEM: {
    CONFIG: "/system/config",
  },
  // Pricing endpoints
  PLAN_SPONSER: {
    PLANS: "/plan-sponsor/plan/types",
    CREATE: "/plan-sponsor/plan",
    VESTING: "/plan-sponsor/plan/vesting/master",
    STATE: "/plan-sponsor/state",
    DETAILS: "/plan-sponsor/details",
    START_DATE: "/plan-sponsor/plan/start-date",
  },
  // Pricing endpoints
  PRICING: {
    GET: "/pricing",
  },

  // Trustee endpoints
  TRUSTEE: {
    CONFIRM: "/trustee/confirmation",
    SIGN: "/trustee/signature",
  },

  // Vesting endpoints
  VESTING: {
    SCHEDULES: "/vesting/schedules",
  },

  // Documents endpoints
  DOCUMENTS: {
    LIST: "/documents/list",
  },

  // Participants endpoints
  PARTICIPANTS: {
    LIST: "/participants",
  },

  // Finch endpoints
  FINCH: {
    GET_FINCH_URL: "/finch/auth/url",
    CALLBACK: "/finch/auth/callback",
  },
} as const;

/**
 * Helper function to build full URL for an endpoint
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

/**
 * Helper function to build query string for GET requests
 */
export function buildQueryString(
  params: Record<string, string | number | boolean>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Helper function to build full URL with query parameters
 */
export function buildApiUrlWithQuery(
  endpoint: string,
  params: Record<string, string | number | boolean>
): string {
  const baseUrl = buildApiUrl(endpoint);
  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
