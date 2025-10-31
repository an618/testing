"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { Table, TableColumn } from "@/components/ui";
import { useParticipantsList } from "@/services/participants/queries";

export default function ParticipantsPage() {
  const { t } = useLanguage();

  // State for pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState(""); // Local input state
  const [searchTerm, setSearchTerm] = useState(""); // API search term
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  // Debounce the search term
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout to update search term after 500ms of no typing
    debounceTimeoutRef.current = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1); // Reset to first page when search term changes
    }, 500);

    // Cleanup on unmount or when inputValue changes
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [inputValue]);

  // Memoize user object to prevent DashboardLayout re-renders
  const user = useMemo(
    () => ({
      firstName: "Guest",
      lastName: "",
      role: "employee" as const,
      id: "",
      email: "",
    }),
    []
  );

  // Use API call instead of dummy data
  const {
    data: participantsData,
    isLoading,
    error,
  } = useParticipantsList({
    page: currentPage - 1, // API uses 0-based indexing
    size: itemsPerPage,
    search: searchTerm || undefined,
  });

  // Safely extract data with proper fallbacks
  const participants = participantsData?.content || [];
  const totalPages = participantsData?.totalPages || 1;

  // Memoize table columns to prevent re-renders
  const columns: TableColumn[] = useMemo(
    () => [
      {
        key: "fullName",
        label: "Name",
        sortable: true,
        width: "20%",
        render: (value) => (
          <span className="inline-flex items-center px-4 py-2 rounded-[10px] text-base bg-custom-quaternary-100 text-black">
            {String(value)}
          </span>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        width: "15%",
        render: (value) => {
          return (
            <span
              className={`inline-flex items-center px-4 py-2 text-base text-custom-gray-600
            }`}
            >
              {String(value)}
            </span>
          );
        },
      },
      {
        key: "accountNumber",
        label: "Account Number",
        sortable: true,
        width: "20%",
        render: (value) => (
          <span className="text-base text-custom-gray-600">
            {String(value)}
          </span>
        ),
      },
      {
        key: "portfolioType",
        label: "Portfolio Type",
        sortable: true,
        width: "20%",
        render: (value) => (
          <span className="text-base text-custom-gray-600">
            {String(value)}
          </span>
        ),
      },
      {
        key: "balance",
        label: "Balance",
        sortable: true,
        width: "10%",
        render: (value) => (
          <span className="text-base text-custom-gray-600">
            $
            {Number(value).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        key: "vestedStatus",
        label: "Vested Non-Elective (%)",
        sortable: true,
        width: "15%",
        render: (value) => (
          <span className="text-base text-custom-gray-600">
            {String(value)}
          </span>
        ),
      },
    ],
    []
  );

  // Memoize event handlers to prevent re-renders
  const handleInputChange = useCallback((term: string) => {
    setInputValue(term); // Update local input value, debounce will trigger API
  }, []);

  const handleSearchSubmit = useCallback(() => {
    // Clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    // Trigger immediate API call when user presses Enter or blurs
    setSearchTerm(inputValue);
    setCurrentPage(1);
  }, [inputValue]);

  const handleSort = useCallback((field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <DashboardLayout title={t("Sidebar.navigation.participants")} user={user}>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading participants...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading participants: {error.message}
          </div>
        </div>
      ) : (
        <Table
          data={participants}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search by name"
          searchValue={inputValue}
          searchFields={["fullName", "status", "portfolioType"]}
          pagination={true}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          sortable={true}
          addButton
          addButtonLabel="Add"
          onSearchChange={handleInputChange}
          onSearch={handleSearchSubmit}
          onSort={handleSort}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          currentSortField={sortField}
          currentSortDirection={sortDirection}
        />
      )}
    </DashboardLayout>
  );
}
