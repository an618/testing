"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { isPublicRoute } from "@/utils/routeUtils";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useSession();
  const pathname = usePathname();

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brandStart to-brandEnd">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <span className="ml-3 text-lg text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Allow public routes (login and register)
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  // // All other routes require authentication
  // if (status === "unauthenticated") {
  //   router.push(redirectTo);
  //   return null; // Redirect will happen
  // }

  return <>{children}</>;
}
