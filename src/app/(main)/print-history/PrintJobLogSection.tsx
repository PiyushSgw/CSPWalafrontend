"use client";

import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { PrintJobRow } from "./PrintJobRow";
import type { PrintHistoryFilter } from "./PrintHistoryFilterBar";

interface Props {
  currentPage: number;
  onPageChange: (p: number) => void;
  activeFilter: PrintHistoryFilter;
  startDate: string;
  endDate: string;
}

export const PrintJobLogSection: React.FC<Props> = ({
  currentPage,
  onPageChange,
  activeFilter,
  startDate,
  endDate,
}) => {
  const { mappedList, meta, loading, error } = useAppSelector(
    (s) => s.printHistory
  );

  const [search, setSearch] = useState("");

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();

    let baseList = mappedList;

    if (activeFilter === "Passbooks") {
      baseList = mappedList.filter((job) => job.type === "Passbook");
    } else if (activeFilter === "Forms") {
      baseList = mappedList.filter(
        (job) =>
          job.type === "Form" ||
          job.type === "Acct Form" ||
          job.type === "Jan Dhan"
      );
} else if (activeFilter === "Combo") {
  baseList = mappedList.filter(
    (job) => (job.type as string) === "Combo" || (job.type as string) === "Form + PB"
  );
}

    // NEW: date filter
    if (startDate || endDate) {
      baseList = baseList.filter((job) => {
        const rawDate = String(
          job.createdAtRaw ?? job.dateTime ?? ""
        ).trim();

        const jobDate = new Date(rawDate);
        if (Number.isNaN(jobDate.getTime())) return false;

        if (startDate) {
          const start = new Date(`${startDate}T00:00:00`);
          if (jobDate < start) return false;
        }

        if (endDate) {
          const end = new Date(`${endDate}T23:59:59.999`);
          if (jobDate > end) return false;
        }

        return true;
      });
    }

    if (!q) return baseList;

    return baseList.filter((job) => {
      const jobId = String(job.id ?? "").toLowerCase();
      const customer = String(job.customer ?? "").toLowerCase();
      const normalizedId = jobId.replace(/[^a-z0-9]/gi, "");

      return (
        customer.includes(q) ||
        jobId.includes(q) ||
        normalizedId.includes(q.replace(/[^a-z0-9]/gi, ""))
      );
    });
  }, [mappedList, search, activeFilter, startDate, endDate]);

  const total =
    search.trim() || activeFilter !== "All Jobs" || startDate || endDate
      ? filteredList.length
      : meta?.total ?? 0;

  const from = total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const to = Math.min(currentPage * 20, total);

  return (
    <div className="card">
      {/* HEADER */}
      <div
        className="card-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div className="card-title">Print Job Log ({total})</div>

        {/* SEARCH BOX */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 260,
          }}
        >
          <div className="relative w-56">
            <div className="w-full h-10 border border-gray-300 rounded-xl bg-white"></div>

            <span
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: "var(--color-text-secondary)",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onPageChange(1);
              }}
              placeholder="Search customer..."
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                padding: "0 14px 0 42px",
                borderRadius: 12,
                border: "none",
                background: "transparent",
                color: "var(--color-text-primary)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Date / Time</th>
              <th>Customer</th>
              <th>Bank</th>
              <th>Type</th>
              <th>Pages</th>
              <th>Charge</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 40 }}>
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--color-text-danger)",
                  }}
                >
                  {error}
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--color-text-secondary)",
                  }}
                >
                  No print jobs found
                </td>
              </tr>
            ) : (
              filteredList.map((job) => (
                <PrintJobRow key={job.id} {...job} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {meta && meta.totalPages > 1 && !search.trim() && !startDate && !endDate && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "0.5px solid var(--color-border-tertiary)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
          }}
        >
          <span>
            Showing {from}–{to} of {total} jobs
          </span>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>

            {Array.from(
              { length: Math.min(5, meta.totalPages) },
              (_, i) => i + 1
            ).map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                style={
                  n === currentPage
                    ? {
                        background: "var(--color-background-info)",
                        color: "var(--color-text-info)",
                      }
                    : {}
                }
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === meta.totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};