"use client";
import React from "react";
import type { FetchPrintHistoryParams } from "./printHistory";

interface Props {
  filters: FetchPrintHistoryParams;
  onChange: (updated: Partial<FetchPrintHistoryParams>) => void;
  onClear: () => void;
}

export const FilterTabsSection: React.FC<Props> = ({ filters, onChange, onClear }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end", padding: "12px 16px" }}>

      <div>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
          From Date
        </label>
        <input type="date" value={filters.from_date ?? ""}
          onChange={(e) => onChange({ from_date: e.target.value || undefined })}
          style={{ width: 160 }} />
      </div>

      <div>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
          To Date
        </label>
        <input type="date" value={filters.to_date ?? ""}
          onChange={(e) => onChange({ to_date: e.target.value || undefined })}
          style={{ width: 160 }} />
      </div>

      <div>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
          Customer ID
        </label>
        <input type="number" placeholder="e.g. 42" min="1"
          value={filters.customer_id ?? ""}
          onChange={(e) => onChange({ customer_id: e.target.value ? Number(e.target.value) : undefined })}
          style={{ width: 120 }} />
      </div>

      <div>
        <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
          Bank ID
        </label>
        <input type="number" placeholder="e.g. 1" min="1"
          value={filters.bank_id ?? ""}
          onChange={(e) => onChange({ bank_id: e.target.value ? Number(e.target.value) : undefined })}
          style={{ width: 100 }} />
      </div>

      <button className="btn btn-outline" onClick={onClear} style={{ alignSelf: "flex-end" }}>
        Clear Filters
      </button>
    </div>
  </div>
);