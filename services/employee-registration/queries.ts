"use client";

import { useMutation } from "@tanstack/react-query";
import { employeeRegistrationApi } from "./api";
import {
  EmployeeRegistrationRequest,
  EmployeeRegistrationResponse,
} from "./types";

/**
 * Hook for employee registration
 *
 * @returns React Query mutation for employee registration
 *
 * @example
 * ```tsx
 * const registerEmployee = useEmployeeRegistration();
 *
 * const handleSubmit = async (formData: EmployeeRegistrationRequest) => {
 *   try {
 *     const result = await registerEmployee.mutateAsync(formData);
 *     console.log('Registration successful:', result);
 *     // Handle success - redirect to login or dashboard
 *   } catch (error) {
 *     console.error('Registration failed:', error);
 *     // Handle error
 *   }
 * };
 *
 * return (
 *   <form onSubmit={handleSubmit}>
 *     <button
 *       type="submit"
 *       disabled={registerEmployee.isPending}
 *     >
 *       {registerEmployee.isPending ? 'Registering...' : 'Register'}
 *     </button>
 *   </form>
 * );
 * ```
 */
export const useEmployeeRegistration = () => {
  return useMutation<
    EmployeeRegistrationResponse,
    Error,
    EmployeeRegistrationRequest
  >({
    mutationFn: employeeRegistrationApi.register,
    onSuccess: (data) => {
      console.log("Employee registration successful:", data);
    },
    onError: (error) => {
      console.error("Employee registration failed:", error);
    },
  });
};
