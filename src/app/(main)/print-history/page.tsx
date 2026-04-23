
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchPrintHistory, clearError } from "@/redux/slices/printHistorySlice";
import { PageHeaderSection }  from "./PageHeaderSection";
import { FilterTabsSection }  from "./FilterTabsSection";
import { StatsRowSection }    from "./StatsRowSection";
import { PrintJobLogSection } from "./PrintJobLogSection";
import type { FetchPrintHistoryParams } from "./printHistory";
import { isAuthError } from "@/utils/authError";


debugger;
const DEFAULT_FILTERS: FetchPrintHistoryParams = {
  page: 1, limit: 20,
};

export default function PrintHistoryPage() {
 
  const dispatch   = useAppDispatch();
  const { error }  = useAppSelector((s) => s.printHistory);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const [filters, setFilters]     = useState<FetchPrintHistoryParams>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const load = (params: FetchPrintHistoryParams) =>
    dispatch(fetchPrintHistory(params));

  // Initial load
  useEffect(() => {
    load({ ...DEFAULT_FILTERS });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When filters change, debounce then fetch from page 1
  const handleFilterChange = (updated: Partial<FetchPrintHistoryParams>) => {
    const next = { ...filters, ...updated, page: 1 };
    setFilters(next);
    setCurrentPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(next), 400);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    dispatch(clearError());
    load(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    const next = { ...filters, page };
    setFilters(next);
    setCurrentPage(page);
    load(next);
  };

  return (
    <div className="page active" id="page-print-history">
      <PageHeaderSection />

      {error && !isAuthError(error) && (
        <div style={{
          marginBottom: 16, padding: "12px 16px", borderRadius: 8, fontSize: 14,
          background: "var(--color-background-danger)",
          color: "var(--color-text-danger)",
        }}>
          {error}
        </div>
      )}

      <FilterTabsSection
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <StatsRowSection />

      <PrintJobLogSection
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}