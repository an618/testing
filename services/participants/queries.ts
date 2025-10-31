"use client";

import { useQuery } from "@tanstack/react-query";
import { participantsApi } from "./api";
import { ParticipantsListParams } from "./types";
import { queryKeys } from "@/utils/queryKeys";

/**
 * Hook for fetching participants list
 *
 * @param params - Query parameters for participants list
 * @returns React Query hook for participants list
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useParticipantsList({
 *   page: 1,
 *   size: 10,
 *   search: 'john'
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return (
 *   <div>
 *     {data?.data.map(participant => (
 *       <div key={participant.id}>{participant.name}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useParticipantsList = (params?: ParticipantsListParams) => {
  return useQuery({
    queryKey: queryKeys.participants.list(params),
    queryFn: () => participantsApi.getParticipantsList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

