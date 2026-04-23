"use client";
import React from "react";
import { useAppSelector } from "../../../redux/hooks";
import { PrintJobRow } from "./PrintJobRow";

interface Props {
  currentPage: number;
  onPageChange: (p: number) => void;
}

export const PrintJobLogSection: React.FC<Props> = ({ currentPage, onPageChange }) => {
  const { mappedList, meta, loading, error } = useAppSelector((s) => s.printHistory);
console.log(mappedList);
  const total = meta?.total ?? 0;
  const from  = total === 0 ? 0 : (currentPage - 1) * 20 + 1;
  const to    = Math.min(currentPage * 20, total);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Print Log ({total})</div>
      </div>

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
              <tr><td colSpan={9} style={{ textAlign: "center", padding: 40 }}>Loading...</td></tr>
            ) : error ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--color-text-danger)" }}>
                  {error}
                </td>
              </tr>
            ) : mappedList.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 40, color: "var(--color-text-secondary)" }}>
                  No print jobs found
                </td>
              </tr>
            ) : (
              mappedList.map((job) => (
                <PrintJobRow key={job.id} {...job} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div style={{
          padding: "12px 16px",
          borderTop: "0.5px solid var(--color-border-tertiary)",
          display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12,
        }}>
          <span>Showing {from}–{to} of {total} jobs</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>← Prev</button>
            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => onPageChange(n)}
                style={n === currentPage ? { background: "var(--color-background-info)", color: "var(--color-text-info)" } : {}}>
                {n}
              </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === meta.totalPages}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};