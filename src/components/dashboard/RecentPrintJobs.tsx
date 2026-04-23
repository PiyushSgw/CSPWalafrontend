'use client';
import { useEffect, useState } from 'react';
import api from '../../utils/axios';
// import "../../app/styles.css"; 

const typeConfig: any = {
 Passbook: { bg: 'bg-[#eff2f9]', text: 'text-[#0f2744]' },
  'Form + PB': { bg: 'bg-[#fffbeb]', text: 'text-[#d97706]' },
  'Acct Form': { bg: 'bg-[#eff6ff]', text: 'text-[#0284c7]' },
  'Jan Dhan': { bg: 'bg-[#f0fdf4]', text: 'text-[#16a34a]' },
};

export default function RecentPrintJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/csp/dashboard/print-jobs')
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <h2 className="text-[14px] font-bold text-[#111827] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0d8f72] rounded-full flex-shrink-0" />
          Recent Print Jobs
        </h2>
         <a
          href="/print-history"
          className="text-[11px] font-bold text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f5f8] transition-all px-[9px] py-1 rounded-[5px]"
        >
          View all →
        </a>
      </div>

            {loading && (
        <div className="p-8 text-center text-[#6b7280] text-[13px]">
          Loading...
        </div>
      )}

      {/* Empty  */}
       {!loading && jobs.length === 0 && (
        <div className="py-12 text-center">
          <span className="text-[40px] block mb-3 opacity-40">🖨️</span>
          <p className="text-[15px] font-bold text-[#374151] mb-1">No print jobs yet</p>
          <p className="text-[13px] text-[#6b7280]">Your recent prints will appear here</p>
        </div>
      )}

      {/* Table */}
      {!loading && jobs.length > 0 && (
        <div className="overflow-x-auto header_scrollbar-hide">
          <table className="w-full border-collapse text-[13px]">
            {/* Table Head */}
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
              {jobs.map((j, i) => {
                 const typeStyle = typeConfig[j.type] || typeConfig.Passbook;
                return (
                 <tr
                    key={i}
                    className="border-b border-[#e5e7eb] last:border-0 hover:bg-[#fafbfc] transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-[14px] py-3 pl-5">
                      <p className="font-semibold text-[13px] text-[#374151] leading-tight">
                        {j.customerName}
                      </p>
                      <p className="text-[11px] text-[#6b7280] font-mono mt-0.5">
                        A/C: {j.accountNo}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-[14px] py-3">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold px-[10px] py-[3px] rounded-full ${typeStyle.bg} ${typeStyle.text}`}
                      >
                        {j.type}
                      </span>
                    </td>

                    {/* Bank */}
                    <td className="px-[14px] py-3 text-[13px] text-[#374151] ">
                      {j.bank}
                    </td>

                    {/* Time */}
                    <td className="px-[14px] py-3 text-[11px] text-[#6b7280] whitespace-nowrap">
                      {j.time}
                    </td>

                    {/* Charge */}
                    <td className="px-[14px] py-3 font-mono text-[13px] text-[#dc2626] font-medium whitespace-nowrap">
                      {j.charge ? `-₹${j.charge}` : '—'}
                    </td>

                    {/* Reprint */}
                    <td className="px-[14px] py-3 pr-5">
                      <button className="px-[9px] py-1 border-[1.5px] border-[#d1d5db] rounded-[5px] text-[11px] font-bold text-[#374151] bg-transparent hover:bg-[#f3f5f8] transition-colors whitespace-nowrap">
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