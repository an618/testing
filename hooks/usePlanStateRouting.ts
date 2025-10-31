"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePlanState } from "@/services/plan-sponser";

/**
 * Custom hook for handling plan state routing
 * Automatically redirects users to the correct page based on their current plan state
 */
export const usePlanStateRouting = () => {
  const router = useRouter();
  const { data: planState, isLoading } = usePlanState();

  useEffect(() => {
    // Only redirect if we have plan state data and it's not loading
    if (!isLoading && planState?.currentState) {
      const currentState = planState.currentState;

      // Define the routing logic
      const routingMap: Record<string, string> = {
        PLAN_DETAILS: "/pricing",
        BUISNESS_DETAILS: "/get-started/business",
        PRICING: "/get-started/pricing",
        PLAN_START_DATE: "/get-started/date",
        TRUSTEE: "/get-started/trustee",
        SIGN: "/get-started/sign",
        FINCH: "/finch",
      };

      const targetRoute = routingMap[currentState];

      if (targetRoute) {
        // Only redirect if we're not already on the target route
        const currentPath = window.location.pathname;
        if (currentPath !== targetRoute) {
          // router.push(targetRoute);
        }
      }
    }
  }, [planState, isLoading, router]);

  return {
    planState,
    isLoading,
  };
};
