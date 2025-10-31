import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { getSession } from "next-auth/react";
import { handleApiError } from "@/utils/authRedirect";

// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090/v1/api";

// Function to get session token for API requests
const getSessionToken = async (): Promise<string | null> => {
  try {
    const session = await getSession();
    if (session && typeof session === "object" && "accessToken" in session) {
      const accessToken = (session as unknown as Record<string, unknown>)
        .accessToken;
      if (typeof accessToken === "string") {
        return accessToken;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor for adding auth headers
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Get session token and add to request
      const token = await getSessionToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("❌ API Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      console.error("❌ API Response Error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });

      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized access - redirect to login
        await handleApiError(error);
      } else if (error.response?.status === 404) {
        console.error("🔍 Resource not found");
      } else if (error.response?.status && error.response.status >= 500) {
        console.error("💥 Server error");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the API client instance
export const apiClient = createApiClient();
