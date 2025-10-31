import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "./api";
import { DocumentsListParams } from "./types";

/**
 * React Query hooks for Documents service
 */

/**
 * Hook to fetch documents list
 */
export const useDocumentsList = (params?: DocumentsListParams) => {
  return useQuery({
    queryKey: ["documents", "list", params],
    queryFn: () => documentsApi.getDocumentsList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
