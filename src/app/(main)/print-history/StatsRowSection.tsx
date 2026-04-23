"use client";
import React from "react";
import { useAppSelector } from "../../../redux/hooks";

export const StatsRowSection: React.FC = () => {
  const { stats } = useAppSelector((s) => s.printHistory);

  const cards = [
    { label: "Total Jobs",    value: stats.totalJobs },
    { label: "Total Pages",   value: stats.totalPages },
    { label: "Total Charges", value: `₹${stats.totalCharge.toFixed(2)}` },
    { label: "Free Jobs",     value: stats.freeJobs },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
      {cards.map((c) => (
        <div key={c.label} style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          padding: "1rem",
        }}>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "var(--color-text-primary)" }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
};