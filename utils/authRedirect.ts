/**
 * Utility functions for handling authentication redirects
 */

import { signOut } from "next-auth/react";

/**
 * Handle 401 unauthorized responses by clearing session and redirecting to login
 */
export const handleUnauthorizedRedirect = async (): Promise<void> => {
  try {
    // Clear any stored session data
    localStorage.removeItem("loginEmail");
    localStorage.removeItem("loginPassword");

    // Sign out the user and redirect to login
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  } catch (error) {
    console.error("❌ Error during logout:", error);
    // Fallback: redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

/**
 * Check if the current response is a 401 unauthorized error
 */
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401;
};

/**
 * Handle API errors and redirect if unauthorized
 */
export const handleApiError = async (error: any): Promise<void> => {
  if (isUnauthorizedError(error)) {
    console.error("🚫 Unauthorized access - redirecting to login");
    await handleUnauthorizedRedirect();
  }
};
