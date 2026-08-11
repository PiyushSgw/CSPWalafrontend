'use client';

interface Props {
  onLoadExisting: () => void;
  onNewPrintJob: () => void;
}

export const PageHeaderSection: React.FC<Props> = ({ onLoadExisting, onNewPrintJob }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <h1
          className="text-2xl font-bold text-slate-800 flex items-center gap-2"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
         📖 Passbook Printing
        </h1>
        <p className="text-[12.5px] text-slate-500 mt-1 truncate">
          Enter customer details and generate A5 passbook PDF — ₹10 per print
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={onLoadExisting}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-lg  text-[12.5px] font-semibold text-[#374151] hover:bg-slate-50 transition-colors"
        >
          📋 Load Existing Customer
        </button>
        <button
          type="button"
          onClick={onNewPrintJob}
          className="flex items-center gap-1.5 px-3.5 py-1 border border-slate-200 rounded-lg bg-[#0d8f72] text-[12.5px] font-semibold text-white hover:bg-[#16a34a] shadow-sm transition-colors"
        >
         + New Print Job
        </button>
      </div>
    </div>
  );
};