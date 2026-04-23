"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchPrintHistory,
  clearError,
} from "@/redux/slices/printHistorySlice";
import { PageHeaderSection } from "./PageHeaderSection";
import { StatsRowSection } from "./StatsRowSection";
import { PrintJobLogSection } from "./PrintJobLogSection";
import type { FetchPrintHistoryParams } from "./printHistory";
import { isAuthError } from "@/utils/authError";
import {
  PrintHistoryFilter,
  PrintHistoryFilterBar,
} from "./PrintHistoryFilterBar";

const DEFAULT_FILTERS: FetchPrintHistoryParams = {
  page: 1,
  limit: 20,
};

export default function PrintHistoryPage() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.printHistory);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [filters, setFilters] = useState<FetchPrintHistoryParams>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] =
    useState<PrintHistoryFilter>("All Jobs");

  // NEW: date popup state
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = (params: FetchPrintHistoryParams) => dispatch(fetchPrintHistory(params));

  useEffect(() => {
    load({ ...DEFAULT_FILTERS });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleFilterChange = (value: PrintHistoryFilter) => {
    setActiveFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const next = { ...filters, page };
    setFilters(next);
    setCurrentPage(page);
    load(next);
  };

  return (
    <div className="page active" id="page-print-history">
      <PageHeaderSection
        showDatePopup={showDatePopup}
        setShowDatePopup={setShowDatePopup}
        startDate={startDate}
        endDate={endDate}
        setStartDate={(value) => {
          setStartDate(value);
          setCurrentPage(1);
        }}
        setEndDate={(value) => {
          setEndDate(value);
          setCurrentPage(1);
        }}
        onApplyDateFilter={() => {
          setShowDatePopup(false);
          setCurrentPage(1);
        }}
        onClearDateFilter={() => {
          setStartDate("");
          setEndDate("");
          setShowDatePopup(false);
          setCurrentPage(1);
        }}
      />

      {error && !isAuthError(error) && (
        <div
          style={{
            marginBottom: 16,
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
            background: "var(--color-background-danger)",
            color: "var(--color-text-danger)",
          }}
        >
          {error}
        </div>
      )}

      <StatsRowSection selectedMonth={""} />

      <div className="my-5">
        <PrintHistoryFilterBar
          value={activeFilter}
          onChange={handleFilterChange}
        />
      </div>

      <PrintJobLogSection
        currentPage={currentPage}
        onPageChange={handlePageChange}
        activeFilter={activeFilter}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}