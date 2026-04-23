'use client';

interface Props {
  includePassbook: boolean;
  onToggle: (val: boolean) => void;
}

export default function PrintOptions({
  includePassbook,
  onToggle,
}: Props) {
  const total = includePassbook ? 13 : 10;

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h3 className="text-[14px] font-bold text-gray-800">🖨️ Print Options</h3>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3 rounded-[10px] border-2 border-teal-600 bg-teal-50 p-3.5 opacity-95">
          <input
            id="account-form"
            type="checkbox"
            checked
            readOnly
            aria-label="Account Opening Form included"
            className="h-4 w-4 accent-teal-600"
          />
          <label htmlFor="account-form" className="flex-1 cursor-default">
            <div className="text-[13px] font-bold text-gray-800">
              📋 Account Opening Form
            </div>
            <div className="text-[11px] text-gray-500">
              Pre-filled bank account opening form PDF
            </div>
          </label>
          <span className="font-mono text-[14px] font-bold text-[#0f2744]">
            ₹10
          </span>
        </div>

        <div
          className={`flex items-center gap-3 rounded-[10px] border-[1.5px] p-3.5 transition-all ${
            includePassbook
              ? 'border-teal-600 bg-teal-50'
              : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
          }`}
        >
          <input
            id="passbook-option"
            type="checkbox"
            checked={includePassbook}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 accent-teal-600"
          />
          <label htmlFor="passbook-option" className="flex-1 cursor-pointer">
            <div className="text-[13px] font-bold text-gray-800">
              📖 + Passbook First Page
            </div>
            <div className="text-[11px] text-gray-500">
              Print passbook cover with same customer data
            </div>
          </label>
          <span
            className={`font-mono text-[14px] font-bold ${
              includePassbook ? 'text-[#0f2744]' : 'text-gray-400'
            }`}
          >
            +₹3
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-[13px] text-gray-500">Total Charge</span>
          <span className="font-mono text-[18px] font-bold text-[#0f2744]">
            ₹{total}.00
          </span>
        </div>
      </div>
    </div>
  );
}