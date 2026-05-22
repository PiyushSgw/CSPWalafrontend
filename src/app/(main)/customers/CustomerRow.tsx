"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MappedCustomer } from "./customer";

interface Props {
  customer: MappedCustomer;
  onEdit: (customer: MappedCustomer) => void;
}

const getTypeStyles = (type: string) => {
  const value = type?.toLowerCase() ?? "";

  if (value.includes("saving")) return { bg: "#eaf7ee", color: "#16a34a" };
  if (value.includes("current")) return { bg: "#e8f1fb", color: "#0284c7" };
  if (value.includes("jan dhan")) return { bg: "#fef9c3", color: "#ca8a04" };

  return { bg: "#f3f4f6", color: "#374151" };
};

const CustomerRow: React.FC<Props> = ({ customer, onEdit }) => {
  const router = useRouter();
  const typeStyle = getTypeStyles(customer.type || "");

  const handlePrintPB = () => {
    const params = new URLSearchParams({
      customer_id: String(customer.id),
      name: customer.name || "",
      account_number: customer.account_number || "",
      account_type: customer.type || "savings",
      bank: customer.bank || "",
      mobile: customer.mobile || "",
    });
    router.push(`/passbook?${params.toString()}`);
  };

  return (
    <tr className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#fcfcfd] transition-colors">
      <td className="px-4 py-3">
        <div className="text-[13px] font-semibold text-[#111827] leading-[1.2]">
          {customer.name}
        </div>
        <div className="text-[11px] text-[#6b7280] mt-0.5">
          📞 {customer.mobile}
        </div>
      </td>

      <td className="px-4 py-3 text-[12px] text-[#374151] whitespace-nowrap font-mono">
        {customer.accountShort}
      </td>

      <td className="px-4 py-3 text-[12px] text-[#374151] whitespace-nowrap">
        {customer.bank}
      </td>

      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap"
          style={{ background: typeStyle.bg, color: typeStyle.color }}
        >
          {customer.type}
        </span>
      </td>

      <td className="px-4 py-3 text-[12px] text-[#6b7280] whitespace-nowrap">
        {customer.lastPrint || "—"}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-nowrap">
          <button
            type="button"
            onClick={handlePrintPB}
            className="h-[30px] px-3 rounded-[7px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[11px] font-bold transition-colors inline-flex items-center justify-center whitespace-nowrap"
          >
            Print PB
          </button>
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="h-[30px] px-3 rounded-[7px] border border-[#d1d5db] hover:bg-[#f9fafb] text-[#374151] text-[11px] font-bold transition-colors whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;