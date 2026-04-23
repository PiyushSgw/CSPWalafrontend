"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../../../redux/hooks";

type Props = {
  selectedMonth: string;
};

const money = (n: number) => `₹${Number(n || 0).toFixed(2)}`;

const isSameMonth = (dateStr?: string, selectedMonth?: string) => {
  if (!dateStr || !selectedMonth) return true;

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return false;

  const [year, month] = selectedMonth.split("-").map(Number);
  return d.getFullYear() === year && d.getMonth() + 1 === month;
};

export const StatsRowSection: React.FC<Props> = ({ selectedMonth }) => {
  const { list } = useAppSelector((s) => s.printHistory);

  const monthJobs = useMemo(() => {
    return list.filter((job) => isSameMonth(job.created_at, selectedMonth));
  }, [list, selectedMonth]);

  const stats = useMemo(() => {
    const totalPrints = monthJobs.length;
    const passbookPrints = monthJobs.filter((j) => (j.job_type ?? "").toLowerCase() === "passbook").length;
    const formPrints = monthJobs.filter((j) => ["form", "combo", "acct_form", "jan_dhan"].includes((j.job_type ?? "").toLowerCase())).length;
    const totalSpend = monthJobs.reduce((sum, j) => sum + Number(parseFloat(j.charge ?? "0")), 0);

    return {
      totalPrints,
      passbookPrints,
      formPrints,
      totalSpend,
    };
  }, [monthJobs]);

  const cards = [
    {
      label: "Total This Month",
      value: stats.totalPrints,
      sub: "All job types",
      line: "#0f766e",
    },
    {
      label: "Passbook Prints",
      value: stats.passbookPrints,
      sub: "@ ₹5 each",
      line: "#1e3a5f",
    },
    {
      label: "Form Prints",
      value: stats.formPrints,
      sub: "Forms + combos",
      line: "#d97706",
    },
    {
      label: "Spend This Month",
      value: money(stats.totalSpend),
      sub: "Wallet deducted",
      line: "#0f8fb8",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div
            className="h-1 w-full"
            style={{ backgroundColor: card.line }}
          />
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </div>
              <div className="mt-2 text-[28px] font-bold leading-none text-slate-900">
                {card.value}
              </div>
              <div className="mt-2 text-[12px] text-slate-400">
                {card.sub}
              </div>
            </div>

            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[18px] transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            >
              {card.label === "Total This Month" ? "📊" : ""}
              {card.label === "Passbook Prints" ? "📖" : ""}
              {card.label === "Form Prints" ? "📄" : ""}
              {card.label === "Spend This Month" ? "💸" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};