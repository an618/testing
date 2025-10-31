import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planSponserApi } from "./api";
import { queryKeys } from "@/utils/queryKeys";

/**
 * Hook for fetching plan state
 *
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query result with plan state data
 *
 * @example
 * ```tsx
 * const { data: planState, isLoading, error } = usePlanState();
 *
 * if (isLoading) return <div>Loading plan state...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     <h2>Plan Status: {planState?.status}</h2>
 *     <p>Current Step: {planState?.currentStep}</p>
 *     <p>Progress: {planState?.progress}%</p>
 *   </div>
 * );
 * ```
 */
export const usePlanState = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.pricing.all, "state"],
    queryFn: planSponserApi.getPlanState,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for state data)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time state
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for fetching plan details
 *
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query result with plan details data
 *
 * @example
 * ```tsx
 * const { data: planDetails, isLoading, error } = usePlanDetails();
 *
 * if (isLoading) return <div>Loading plan details...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     <h2>Legal Name: {planDetails?.legalName}</h2>
 *     <p>EIN: {planDetails?.ein}</p>
 *     <p>Entity Type: {planDetails?.entityType}</p>
 *   </div>
 * );
 * ```
 */
export const usePlanDetails = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.pricing.all, "details"],
    queryFn: planSponserApi.getPlanDetails,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes (details change less frequently)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount: number, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook for creating/updating plan details
 *
 * @returns React Query mutation for plan details
 *
 * @example
 * ```tsx
 * const createPlanDetails = useCreatePlanDetails();
 *
 * const handleSubmit = async (formData: PlanDetails) => {
 *   try {
 *     await createPlanDetails.mutateAsync(formData);
 *     // Handle success
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */
export const useCreatePlanDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planSponserApi.createPlanDetails,
    onSuccess: (data) => {
      // Invalidate and refetch plan details after successful creation
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.pricing.all, "details"],
      });

      // Optionally set the data directly in cache
      queryClient.setQueryData([...queryKeys.pricing.all, "details"], data);
    },
    onError: (error) => {
      console.error("Failed to create plan details:", error);
    },
  });
};

/**
 * Hook for saving plan start date and milestone dates
 *
 * @returns React Query mutation for plan start date
 *
 * @example
 * ```tsx
 * const savePlanStartDate = useSavePlanStartDate();
 *
 * const handleSaveDates = async (dateData: PlanStartDate) => {
 *   try {
 *     await savePlanStartDate.mutateAsync(dateData);
 *     // Handle success
 *   } catch (error) {
 *     // Handle error
 *   }
 * };
 * ```
 */
export const useSavePlanStartDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: planSponserApi.savePlanStartDate,
    onSuccess: () => {
      // Invalidate plan state and details queries after successful save
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.pricing.all, "state"],
      });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.pricing.all, "details"],
      });
    },
    onError: (error) => {
      console.error("Failed to save plan start date:", error);
    },
  });
};

/**
 * Hook for fetching all plan types
 *
 * @returns React Query result with all plan types
 */
export const usePlanTypes = () => {
  return useQuery({
    queryKey: [...queryKeys.pricing.all, "types"],
    queryFn: planSponserApi.getAllPlanTypes,
  });
};

/**
 * Hook for creating company plan
 *
 * @returns React Query mutation for company plan
 */
export const useCreateCompanyPlan = () => {
  return useMutation({
    mutationFn: planSponserApi.createCompanyPlan,
  });
};
