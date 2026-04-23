"use client";

import React from "react";

export type PrintHistoryFilter = "All Jobs" | "Passbooks" | "Forms" | "Combo";

interface Props {
  value: PrintHistoryFilter;
  onChange: (value: PrintHistoryFilter) => void;
}

const tabs: PrintHistoryFilter[] = ["All Jobs", "Passbooks", "Forms", "Combo"];

export const PrintHistoryFilterBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: 4,
        borderRadius: 12,
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
      }}
    >
      {tabs.map((tab) => {
        const active = value === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            style={{
              height: 30,
              minWidth: 96,
              padding: "0 16px",
              borderRadius: 9,
              border: active ? "1px solid #e5e7eb" : "1px solid transparent",
              background: active ? "#ffffff" : "transparent",
              color: active ? "#1f2937" : "#6b7280",
              fontSize: 13,
              fontWeight: active ? 600 : 500,
              boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};