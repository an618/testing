"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  planSponserApi,
  CompanyPlanRequest,
  PlanType,
} from "@/services/plan-sponser";
import { queryKeys } from "@/utils/queryKeys";

// Traditional plan state interface
export interface TraditionalPlanState {
  // Employer contribution
  employerContribution: {
    type: string;
    percentage: string;
    vesting: string;
  };

  // Employee eligibility
  minAge: string;
  timeEmployed: string;

  // Auto-enrollment
  employeeContribution: string;
  annualIncrease: {
    mode: "minimum" | "custom";
    annualIncrease?: string;
    maxContribution?: string;
  };

  // Profit sharing
  profitSharingFormula: string;
  vestingSchedule: string;

  // Default contribution (locked)
  defaultContribution: string;
}

// Hook for managing traditional plan data
export const useTraditionalPlan = () => {
  const [planState, setPlanState] = useState<TraditionalPlanState>({
    employerContribution: {
      type: "100% match up to 3%",
      percentage: "100%",
      vesting: "Immediate",
    },
    minAge: "At least 21 years old",
    timeEmployed: "No requirement",
    employeeContribution: "5%",
    annualIncrease: { mode: "minimum" },
    profitSharingFormula: "Pro-rata",
    vestingSchedule: "2 year cliff",
    defaultContribution: "None",
  });

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("traditionalPlanState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setPlanState((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved traditional plan state:", error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("traditionalPlanState", JSON.stringify(planState));
  }, [planState]);

  // Fetch plan types to get the correct traditional plan ID
  const { data: planTypes = [] } = useQuery({
    queryKey: queryKeys.planTypes.lists(),
    queryFn: () => planSponserApi.getAllPlanTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Find the traditional plan type
  const traditionalPlanType = planTypes.find(
    (plan: PlanType) =>
      plan.name.toLowerCase().includes("traditional") ||
      plan.name.toLowerCase().includes("401k") ||
      plan.name.toLowerCase().includes("standard")
  );

  // Update specific fields
  const updatePlanState = (updates: Partial<TraditionalPlanState>) => {
    setPlanState((prev) => ({ ...prev, ...updates }));
  };

  // Clear saved state
  const clearPlanState = () => {
    localStorage.removeItem("traditionalPlanState");
    setPlanState({
      employerContribution: {
        type: "100% match up to 3%",
        percentage: "100%",
        vesting: "Immediate",
      },
      minAge: "At least 21 years old",
      timeEmployed: "No requirement",
      employeeContribution: "5%",
      annualIncrease: { mode: "minimum" },
      profitSharingFormula: "Pro-rata",
      vestingSchedule: "2 year cliff",
      defaultContribution: "None",
    });
  };

  // Convert plan state to API request format
  const buildApiRequest = (): CompanyPlanRequest => {
    // Parse numeric values from strings
    const parsePercentage = (str: string) => parseInt(str.replace("%", ""), 10);
    const parseAge = (str: string) => {
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 21;
    };
    const parseTimeEmployed = (str: string) => {
      if (str.includes("No requirement")) return 0;
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    if (!traditionalPlanType) {
      throw new Error("Traditional plan type not found");
    }

    return {
      tenantId: "tenant-123", // This should come from user context
      planTypeId: traditionalPlanType.id, // Use actual plan type ID from API
      employeeContributionConfig: {
        hasEmployeeContribution: true,
        defaultContributionRate: parsePercentage(
          planState.employeeContribution
        ),
        isAutoEnrollment: true,
        enrollmentAnnualIncrease:
          planState.annualIncrease.mode === "custom"
            ? parsePercentage(planState.annualIncrease.annualIncrease || "2%")
            : 2,
        enrollmentMaxRate:
          planState.annualIncrease.mode === "custom"
            ? parsePercentage(planState.annualIncrease.maxContribution || "10%")
            : 10,
      },
      eligibility: {
        minimumEntryAge: parseAge(planState.minAge),
        timeEmployedMonths: parseTimeEmployed(planState.timeEmployed),
      },
    };
  };

  // API mutation for creating traditional plan
  const createTraditionalPlanMutation = useMutation({
    mutationFn: (data: CompanyPlanRequest) =>
      planSponserApi.createCompanyPlan(data),
    onSuccess: (data) => {
      // Clear saved state after successful submission
      clearPlanState();
      return data;
    },
    onError: (error) => {
      console.error("Failed to create traditional plan:", error);
      throw error;
    },
  });

  // Submit the complete traditional plan
  const submitTraditionalPlan = async () => {
    if (!traditionalPlanType) {
      throw new Error("Traditional plan type not found. Please try again.");
    }

    const requestData = buildApiRequest();
    return createTraditionalPlanMutation.mutateAsync(requestData);
  };

  return {
    planState,
    updatePlanState,
    clearPlanState,
    submitTraditionalPlan,
    isSubmitting: createTraditionalPlanMutation.isPending,
    submitError: createTraditionalPlanMutation.error,
    resetSubmitError: createTraditionalPlanMutation.reset,
    traditionalPlanType,
    isPlanTypesLoading: !planTypes.length && !traditionalPlanType,
  };
};
