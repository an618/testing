"use client";

import { useState, useEffect, memo } from "react";
import { LuSearch } from "react-icons/lu";
import SecondaryButton from "./SecondaryButton";
import { useLanguage } from "@/hooks/useLanguage";
import { PiCaretUpDownFill } from "react-icons/pi";

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableProps<T = unknown> {
  data: T[];
  columns: TableColumn<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFields?: string[];
  searchValue?: string;
  pagination?: boolean;
  itemsPerPage?: number;
  sortable?: boolean;
  className?: string;
  addButton?: boolean;
  addButtonLabel?: string;
  onAdd?: () => void;
  onSearchChange?: (searchTerm: string) => void;
  onSearch?: () => void;
  onSort?: (field: string, direction: "asc" | "desc") => void;
  onPageChange?: (page: number) => void;
  currentSortField?: string;
  currentSortDirection?: "asc" | "desc";
  currentPage?: number;
  totalPages?: number;
}

function TableComponent<T = unknown>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search by name",
  searchValue,
  pagination = true,
  itemsPerPage = 10,
  sortable = true,
  className = "",
  addButton = false,
  addButtonLabel,
  onAdd,
  onSearchChange,
  onSearch,
  onSort,
  onPageChange,
  currentSortField,
  currentSortDirection = "asc",
  currentPage = 1,
  totalPages = 1,
}: TableProps<T>) {
  const { t } = useLanguage();
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm =
    searchValue !== undefined ? searchValue : internalSearchTerm;
  const [sortField, setSortField] = useState<string | null>(
    currentSortField || null
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    currentSortDirection
  );
  const [page, setPage] = useState(currentPage);

  // Sync internal page state with external currentPage prop
  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  // Calculate pagination
  const itemsPerPageValue = itemsPerPage || 10;
  const startIndex = (page - 1) * itemsPerPageValue;
  const endIndex = startIndex + itemsPerPageValue;

  // Calculate total pages based on data length if not provided
  const calculatedTotalPages =
    totalPages || Math.ceil(data.length / itemsPerPageValue);

  // Use server-side data directly if server-side handling is enabled
  // Otherwise, slice the data for client-side pagination
  const displayData = onPageChange ? data : data.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field: string) => {
    if (!sortable) return;

    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    // Call server-side sort handler if provided
    if (onSort) {
      onSort(field, newDirection);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    // Validate page boundaries
    if (newPage < 1 || newPage > calculatedTotalPages) {
      return;
    }

    setPage(newPage);

    // Call server-side page change handler if provided
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Handle search input change (on every keystroke)
  const handleSearchInputChange = (term: string) => {
    // Update controlled or internal state
    if (searchValue !== undefined) {
      // Controlled mode
      onSearchChange?.(term);
    } else {
      // Uncontrolled mode
      setInternalSearchTerm(term);
    }
  };

  // Handle search submit (on Enter or blur)
  const handleSearchSubmit = () => {
    // Reset to page 1 when searching
    setPage(1);

    // Call server-side search handler if provided
    if (onSearch) {
      onSearch();
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Get nested value from object
  const getNestedValue = (obj: unknown, path: string) => {
    return path
      .split(".")
      .reduce(
        (current, key) => (current as Record<string, unknown>)?.[key],
        obj
      );
  };

  // Render cell content
  const renderCell = (row: T, column: TableColumn<T>) => {
    const value = getNestedValue(row, column.key);

    if (column.render) {
      return column.render(value, row);
    }

    return value?.toString() || "";
  };

  // Generate page numbers for pagination with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = Math.max(1, calculatedTotalPages);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: "page", number: i });
      }
    } else {
      // Always show first page
      pages.push({ type: "page", number: 1 });

      if (page > 3) {
        // Show ellipsis if current page is far from start
        pages.push({ type: "ellipsis" });
      }

      // Calculate range of pages to show around current page
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust range if we're near the beginning or end
      if (page <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Add pages in the calculated range
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push({ type: "page", number: i });
        }
      }

      if (page < totalPages - 2) {
        // Show ellipsis if current page is far from end
        pages.push({ type: "ellipsis" });
      }

      // Always show last page (if there's more than 1 page)
      if (totalPages > 1) {
        pages.push({ type: "page", number: totalPages });
      }
    }

    return pages;
  };

  return (
    <div className={`w-full ${className}`}>
      {(searchable || addButton) && (
        <div className="flex items-center justify-between">
          {searchable ? (
            <div className="w-80 flex items-center justify-between px-3 py-4 border border-gray-300 bg-white rounded-xl text-gray-900">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                onBlur={handleSearchSubmit}
                className="placeholder:font-normal placeholder:text-base placeholder:text-custom-gray-500 w-full outline-none"
                autoComplete="off"
              />
              <LuSearch className="right-3 top-1/2 transform h-6 w-6 text-gray-700" />
            </div>
          ) : (
            <div />
          )}

          {addButton && (
            <SecondaryButton
              text={`+ ${t(addButtonLabel ?? "Table.addButton")}`}
              onClick={onAdd ?? (() => {})}
              containerClassName="!w-fit rounded-[20px] opacity-100"
              className="flex items-center justify-center h-10 px-4 py-2 gap-1 rounded-[20px] font-medium text-base !bg-[#F5F8FF]"
            />
          )}
        </div>
      )}

      {/* Table - Full Width */}
      <div className="bg-white rounded-4xl overflow-hidden p-5 mt-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-custom-quaternary-100">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-base font-semibold text-custom-gray-600 tracking-wider first:rounded-l-lg last:rounded-r-lg"
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <span>{column.label}</span>
                      {column.sortable !== false && sortable && (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="focus:outline-none"
                        >
                          <PiCaretUpDownFill className="h-4 w-4 text-custom-gray-700 cursor-pointer" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-custom-gray-100">
                 {displayData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-16 text-center text-gray-500"
                  >
                    No participants found
                  </td>
                </tr>
              ) : (
                displayData.map((row, index) => (
                  <tr key={index} className="px-3 py-2">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-3 py-4 text-sm text-gray-900"
                        style={{ width: column.width }}
                      >
                        <div className="break-words">
                          {renderCell(row, column)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="border-t border-gray-200 pt-4 flex justify-center">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-custom-tertiary-100 text-gray-700 hover:bg-custom-quaternary-200 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((item, index) => {
                  if (item.type === "ellipsis") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex items-center justify-center w-8 h-8 text-base text-gray-500 cursor-pointer"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item.number}
                      onClick={() =>
                        item.number && handlePageChange(item.number)
                      }
                      className={`flex items-center justify-center w-8 h-8 text-base rounded-lg cursor-pointer transition-colors ${
                        page === item.number
                          ? "bg-custom-quaternary-100 text-custom-gray-700 border border-custom-tertiary-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {item.number}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === calculatedTotalPages}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-custom-tertiary-100 text-gray-700 hover:bg-custom-quaternary-200 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
const Table = memo(TableComponent) as typeof TableComponent;

export default Table;
