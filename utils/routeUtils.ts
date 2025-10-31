/**
 * Utility functions for route handling and authentication
 */

// Define public routes that don't require authentication
export const PUBLIC_ROUTES = ["/login", "/register"] as const;

/**
 * Check if a given pathname is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if a given pathname is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
  return !isPublicRoute(pathname);
}

/**
 * Get the default redirect URL for unauthenticated users
 */
export function getDefaultRedirectUrl(): string {
  return "/login";
}

/**
 * Get the default redirect URL for authenticated users
 */
export function getAuthenticatedRedirectUrl(): string {
  return "/dashboard";
}
