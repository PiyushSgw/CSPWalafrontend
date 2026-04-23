'use client';

import { RefreshCw, BookOpen } from 'lucide-react';

interface Props {
  onReset: () => void;
}

export const PageHeaderSection: React.FC<Props> = ({ onReset }) => {
  return (
    <div className="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1
          className="text-2xl font-bold text-slate-800 flex items-center gap-2"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
         📖 Passbook Printing
        </h1>
        <p className="text-[12.5px] text-slate-500 mt-1">
          Enter customer details and generate A5 passbook PDF — ₹10 per print
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg  text-[12.5px] font-semibold text-[#374151] "
        >
          📋 Load Existing Customer
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3.5 py-1 border border-slate-200 rounded-lg bg-[#0d8f72] text-[12.5px] font-semibold text-white hover:bg-[#16a34a] shadow-sm transition-colors"
        >
         + New Print Job
        </button>
      </div>
    </div>
  );
};