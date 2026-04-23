'use client';

import Link from 'next/link';
import { useAppSelector } from '../../redux/hooks';

type PrintJobRow = {
  id?: number | string;
  print_job_id?: number | string;
  customer_name?: string;
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
  job_type?: string;
  created_at?: string;
  charge?: string | number | null;
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  Passbook: { bg: 'bg-[#eff2f9]', text: 'text-[#0f2744]' },
  'Form + PB': { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]' },
  'Acct Form': { bg: 'bg-[#eff6ff]', text: 'text-[#0284c7]' },
  'Jan Dhan': { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
  Form: { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]' },
  Combo: { bg: 'bg-[#f5f3ff]', text: 'text-[#7c3aed]' },
};

const formatDateTime = (value?: string) => {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const normalizeJobType = (jobType?: string) => {
  if (!jobType) return 'Passbook';

  const value = jobType.trim().toLowerCase();

  if (value === 'passbook') return 'Passbook';
  if (value === 'form + pb' || value === 'form+pb') return 'Form + PB';
  if (value === 'form') return 'Form';
  if (value === 'combo') return 'Combo';
  if (value === 'acct form' || value === 'acct_form') return 'Acct Form';
  if (value === 'jan dhan' || value === 'jan_dhan') return 'Jan Dhan';

  return jobType;
};

export default function RecentPrintJobs() {
  const printHistoryState = useAppSelector((s: any) => s.printHistory);

  const list: PrintJobRow[] = Array.isArray(printHistoryState?.list)
    ? printHistoryState.list
    : [];

  const loading = Boolean(printHistoryState?.loading);
  const error = printHistoryState?.error;

  // If backend returns latest first
  const jobs = [...list].slice(0, 5);

  // If backend returns oldest first, use this instead:
  // const jobs = [...list].slice(-5).reverse();

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0d8f72] rounded-full flex-shrink-0" />
          Recent Print Jobs
        </h2>

        <Link
          href="/print-history"
          className="text-[11px] font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f5f8] transition-all px-[9px] py-1 rounded-[5px]"
        >
          View all →
        </Link>
      </div>

      {loading && (
        <div className="p-8 text-center text-[#6b7280] text-[13px]">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="p-8 text-center text-red-600 text-[13px]">
          {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="py-12 text-center">
          <span className="text-[40px] block mb-3 opacity-40">🖨️</span>
          <p className="text-[15px] font-bold text-[#374151] mb-1">
            No print jobs yet
          </p>
          <p className="text-[13px] text-[#6b7280]">
            Your recent prints will appear here
          </p>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="overflow-x-auto header_scrollbar-hide">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Customer', 'Type', 'Bank', 'Time', 'Charge', ''].map((h) => (
                  <th
                    key={h}
                    className="bg-[#f3f5f8] px-[14px] py-[10px] text-left text-[11px] font-semibold uppercase tracking-[0.7px] text-[#6b7280] border-b border-[#e5e7eb] whitespace-nowrap first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {jobs.map((j) => {
                const normalizedType = normalizeJobType(j?.job_type);
                const typeStyle = typeConfig[normalizedType] || typeConfig.Passbook;

                return (
                  <tr
                    key={j?.id ?? j?.print_job_id ?? `${j?.account_number}-${j?.created_at}`}
                    className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafbfc] transition-colors"
                  >
                    <td className="px-[14px] py-3 pl-5">
                      <p className="font-semibold text-[13px] text-[#374151] leading-tight">
                        {j?.customer_name || 'N/A'}
                      </p>
                      <p className="text-[11px] text-[#6b7280] font-mono mt-0.5">
                        A/C: {j?.account_number || '—'}
                      </p>
                    </td>

                    <td className="px-[14px] py-3">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold px-[10px] py-[3px] rounded-full ${typeStyle.bg} ${typeStyle.text}`}
                      >
                        {normalizedType}
                      </span>
                    </td>

                    <td className="px-[14px] py-3 text-[13px] text-[#374151]">
                      {j?.bank_name || j?.bank_code || '—'}
                    </td>

                    <td className="px-[14px] py-3 text-[11px] text-[#6b7280] whitespace-nowrap">
                      {formatDateTime(j?.created_at)}
                    </td>

                    <td className="px-[14px] py-3 font-mono text-[13px] text-[#dc2626] font-medium whitespace-nowrap">
                      {j?.charge !== undefined && j?.charge !== null && j?.charge !== ''
                        ? `-₹${Number(j.charge).toFixed(2)}`
                        : '—'}
                    </td>

                    <td className="px-[14px] py-3 pr-5">
                      <button
                        type="button"
                        className="px-[9px] py-1 border-[1.5px] border-[#d1d5db] rounded-[5px] text-[11px] font-bold text-[#374151] bg-transparent hover:bg-[#f3f5f8] transition-colors whitespace-nowrap"
                      >
                        Reprint
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}