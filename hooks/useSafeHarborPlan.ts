"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  planSponserApi,
  SafeHarborPlanRequest,
  PlanType,
} from "@/services/plan-sponser";
import { queryKeys } from "@/utils/queryKeys";

// Safe Harbor plan state interface
export interface SafeHarborPlanState {
  // Page 1: Safe Harbor Type Selection
  safeHarborType: "basic" | "custom" | "nonelective" | null;

  // Page 2: Summary/Configuration
  employerContribution: {
    type: string;
    percentage: string;
    vesting: string;
  };
  employeeContribution: string;
  annualIncrease: {
    mode: "minimum" | "custom";
    annualIncrease?: string;
    maxContribution?: string;
  };
  profitSharingFormula: string;
  vestingSchedule: string;
  vestingScheduleId: string | null;
  minAge: string;
  timeEmployed: string;

  // Page 3: Employer Contribution Details
  offerMatch: "yes" | "no" | null;
  matchPercentage: string;
  maxMatchPercent: string;
  matchVesting: string;
}

// Hook for managing safe harbor plan data
export const useSafeHarborPlan = () => {
  const [planState, setPlanState] = useState<SafeHarborPlanState>({
    safeHarborType: null,
    employerContribution: {
      type: "Employer match",
      percentage: "4% basic",
      vesting: "Immediate",
    },
    employeeContribution: "4%",
    annualIncrease: { mode: "minimum" },
    profitSharingFormula: "Pro-rata",
    vestingSchedule: "2 year cliff",
    vestingScheduleId: null,
    minAge: "At least 18 years old",
    timeEmployed: "No requirement",
    offerMatch: null,
    matchPercentage: "100%",
    maxMatchPercent: "3%",
    matchVesting: "Immediate",
  });
  const [mounted, setMounted] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem("safeHarborPlanState");
    console.log("savedState", savedState);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setPlanState((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved safe harbor plan state:", error);
      }
    } else {
      setPlanState({
        safeHarborType: null,
        employerContribution: {
          type: "Employer match",
          percentage: "4% basic",
          vesting: "Immediate",
        },
        employeeContribution: "4%",
        annualIncrease: { mode: "minimum" },
        profitSharingFormula: "Pro-rata",
        vestingSchedule: "2 year cliff",
        vestingScheduleId: null,
        minAge: "At least 18 years old",
        timeEmployed: "No requirement",
        offerMatch: null,
        matchPercentage: "100%",
        maxMatchPercent: "3%",
        matchVesting: "Immediate",
      });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("safeHarborPlanState", JSON.stringify(planState));
    }
  }, [planState, mounted]);

  // Update specific fields
  const updatePlanState = (updates: Partial<SafeHarborPlanState>) => {
    setPlanState((prev) => ({ ...prev, ...updates }));
  };

  // Clear saved state
  const clearPlanState = () => {
    localStorage.removeItem("safeHarborPlanState");
    setPlanState({
      safeHarborType: null,
      employerContribution: {
        type: "Employer match",
        percentage: "4% basic",
        vesting: "Immediate",
      },
      employeeContribution: "4%",
      annualIncrease: { mode: "minimum" },
      profitSharingFormula: "Pro-rata",
      vestingSchedule: "2 year cliff",
      vestingScheduleId: null,
      minAge: "At least 18 years old",
      timeEmployed: "No requirement",
      offerMatch: null,
      matchPercentage: "100%",
      maxMatchPercent: "3%",
      matchVesting: "Immediate",
    });
  };

  // Fetch plan types to get the correct safe harbor plan ID
  const { data: planTypes = [] } = useQuery({
    queryKey: queryKeys.planTypes.lists(),
    queryFn: () => planSponserApi.getAllPlanTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Find the safe harbor plan type
  const safeHarborPlanType = planTypes.find(
    (plan: PlanType) =>
      plan.name.toLowerCase().includes("safe harbor") ||
      plan.name.toLowerCase().includes("safe-harbor")
  );

  // Convert plan state to API request format
  const buildApiRequest = (): SafeHarborPlanRequest => {
    // Parse numeric values from strings
    const parsePercentage = (str: string) => parseInt(str.replace("%", ""), 10);
    const parseAge = (str: string) => {
      // Handle both formats: "19" (just number) and "At least 18 years old" (descriptive)
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 18;
    };
    const parseTimeEmployed = (str: string) => {
      if (str.includes("No requirement")) return 0;
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    if (!safeHarborPlanType) {
      throw new Error("Safe Harbor plan type not found");
    }

    return {
      tenantId: "tenant-123", // This should come from user context
      planTypeId: safeHarborPlanType.id, // Use actual plan type ID from API
      safeHarborType: planState.safeHarborType!,
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
            ? parsePercentage(planState.annualIncrease.maxContribution || "15%")
            : 15,
      },
      eligibility: {
        minimumEntryAge: parseAge(planState.minAge),
        timeEmployedMonths: parseTimeEmployed(planState.timeEmployed),
      },
      employerContributionConfig: {
        type: planState.offerMatch === "yes" ? "match" : "nonelective",
        matchPercentage:
          planState.offerMatch === "yes"
            ? parsePercentage(planState.matchPercentage)
            : undefined,
        matchLimitPercent:
          planState.offerMatch === "yes"
            ? parsePercentage(planState.maxMatchPercent)
            : undefined,
        nonElectivePercent:
          planState.safeHarborType === "nonelective" ? 3 : undefined,
        vestingSchedule: planState.matchVesting,
      },
      profitSharingConfig: {
        isEnabled: true,
        formula: planState.profitSharingFormula,
        vestingSchedule: planState.vestingScheduleId || "",
      },
      autoEnrollmentConfig: {
        defaultContributionRate: parsePercentage(
          planState.employeeContribution
        ),
        annualIncrease:
          planState.annualIncrease.mode === "custom"
            ? parsePercentage(planState.annualIncrease.annualIncrease || "2%")
            : 2,
        maxContributionRate:
          planState.annualIncrease.mode === "custom"
            ? parsePercentage(planState.annualIncrease.maxContribution || "15%")
            : 15,
      },
    };
  };

  // API mutation for creating safe harbor plan
  const createSafeHarborPlanMutation = useMutation({
    mutationFn: (data: SafeHarborPlanRequest) =>
      planSponserApi.createCompanyPlan(data),
    onSuccess: (data) => {
      // Clear saved state after successful submission
      clearPlanState();
      return data;
    },
    onError: (error) => {
      console.error("Failed to create safe harbor plan:", error);
      throw error;
    },
  });

  // Submit the complete safe harbor plan
  const submitSafeHarborPlan = async () => {
    if (!safeHarborPlanType) {
      throw new Error("Safe Harbor plan type not found. Please try again.");
    }

    const requestData = buildApiRequest();
    return createSafeHarborPlanMutation.mutateAsync(requestData);
  };

  return {
    planState,
    updatePlanState,
    clearPlanState,
    submitSafeHarborPlan,
    isSubmitting: createSafeHarborPlanMutation.isPending,
    submitError: createSafeHarborPlanMutation.error,
    resetSubmitError: createSafeHarborPlanMutation.reset,
    safeHarborPlanType,
    isPlanTypesLoading: !planTypes.length && !safeHarborPlanType,
  };
};
