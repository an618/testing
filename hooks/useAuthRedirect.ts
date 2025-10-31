"use client";

import { useCallback } from "react";
import { handleApiError, isUnauthorizedError } from "@/utils/authRedirect";

/**
 * Custom hook for handling authentication redirects in React components
 */
export const useAuthRedirect = () => {
  /**
   * Handle API errors and redirect if unauthorized
   */
  const handleError = useCallback(async (error: any) => {
    await handleApiError(error);
  }, []);

  /**
   * Check if an error is a 401 unauthorized error
   */
  const isUnauthorized = useCallback((error: any) => {
    return isUnauthorizedError(error);
  }, []);

  return {
    handleError,
    isUnauthorized,
  };
};
