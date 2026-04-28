"use client";

import { useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  fetchApplicationHistory,
  downloadApplicationPdf,
} from "@/redux/slices/accountOpeningSlice";

type HistoryItem = {
  id?: number | string;
  application_id?: number | string;
  customer_id?: number | string | null;
  bank_name?: string;
  bank?: string;
  account_type?: string;
  full_name?: string;
  mobile?: string;
  include_passbook?: boolean;
  created_at?: string;
  status?: string;
};

const getCharge = (item: HistoryItem) => (item.include_passbook ? 13 : 10);

const getBankShort = (bank?: string) => {
  if (!bank) return "—";
  const map: Record<string, string> = {
    "State Bank of India": "SBI",
    "Punjab National Bank": "PNB",
    "Bank of Baroda": "BOB",
    "Canara Bank": "CAN",
    "Union Bank": "UBI",
    "Bank of India": "BOI",
    IPPB: "IPPB",
    "Central Bank": "CBI",
  };
  return map[bank] || bank;
};

const getAccountTypeLabel = (type?: string) => {
  if (!type) return "—";
  const map: Record<string, string> = {
    savings: "Savings",
    current: "Current",
    jan_dhan: "Jan Dhan",
    minor: "Minor",
  };
  return map[type] || type;
};

const getTypeBadgeClass = (type?: string) => {
  switch (type) {
    case "savings":
      return "bg-blue-50 text-blue-700";
    case "current":
      return "bg-purple-50 text-purple-700";
    case "jan_dhan":
      return "bg-green-50 text-green-700";
    case "minor":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusBadgeClass = (status?: string) => {
  const value = String(status || "").toLowerCase();
  if (
    ["printed", "success", "completed", "submitted", "approved"].includes(value)
  )
    return "bg-green-50 text-green-700";
  if (["preview", "pending", "under_review"].includes(value))
    return "bg-yellow-50 text-yellow-700";
  if (["rejected"].includes(value)) return "bg-red-50 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export default function FormHistory() {
  const dispatch = useAppDispatch();
  const historyRaw = useAppSelector(
    (s) => s.accountOpening.history ?? [],
  ) as HistoryItem[];
  const historyLoading = useAppSelector((s) => s.accountOpening.historyLoading);
  const historyError = useAppSelector((s) => s.accountOpening.historyError);
  const pdfLoading = useAppSelector((s) => s.accountOpening.pdfLoading);

  useEffect(() => {
    dispatch(fetchApplicationHistory());
  }, [dispatch]);

  const history = useMemo(() => {
    return [...historyRaw].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [historyRaw]);

  if (historyLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <div className="mb-3 text-[42px]">⏳</div>
        <p className="text-[13px] text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (historyError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
        <div className="mb-3 text-[42px]">⚠️</div>
        <p className="text-[13px] text-red-600">{historyError}</p>
        <button
          onClick={() => dispatch(fetchApplicationHistory())}
          className="mt-3 rounded-md border border-red-300 px-4 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <div className="mb-3 text-[42px]">🗂️</div>
        <h3 className="mb-1 text-[16px] font-bold text-gray-800">
          No form history found
        </h3>
        <p className="text-[13px] text-gray-500">
          Submitted account opening forms will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-[15px] font-bold text-gray-800">
          📋 Form Print History
        </h3>
        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {[
                "#",
                "Date & Time",
                "Customer",
                "Bank",
                "Form Type",
                "Charge",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => {
              const rowId = item.application_id || item.id || index + 1;
              const charge = getCharge(item);
              const createdDate = item.created_at
                ? new Date(item.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "—";

              return (
                <tr
                  key={String(rowId)}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60"
                >
                  <td className="px-4 py-4 text-[13px] font-medium text-gray-700">
                    {`F-${String(index + 1).padStart(4, "0")}`}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-600">
                    {createdDate}
                  </td>
                  <td className="px-4 py-4 text-[14px] font-semibold text-gray-800">
                    {item.full_name || "Unnamed User"}
                  </td>
                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {getBankShort(item.bank_name || item.bank)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${getTypeBadgeClass(item.account_type)}`}
                    >
                      {getAccountTypeLabel(item.account_type)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[13px] font-medium text-red-600">
                    -₹{charge}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusBadgeClass(item.status)}`}
                    >
                      {item.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      disabled={pdfLoading}
                      onClick={() =>
                        dispatch(downloadApplicationPdf(rowId as number))
                      }
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {pdfLoading ? "..." : "Reprint"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
