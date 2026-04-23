'use client';

interface Props {
  includePassbook: boolean;
  onToggle: (val: boolean) => void;
}

export default function PrintOptions({ includePassbook, onToggle }: Props) {
  const total = includePassbook ? 13 : 10;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-4">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-gray-800">🖨️ Print Options</h3>
      </div>
      <div className="p-5 space-y-3">

        {/* Always included */}
        <label className="flex items-center gap-3 p-3.5 border-2 border-teal-600 rounded-[10px] bg-teal-50 cursor-pointer">
          <input type="checkbox" checked readOnly
            className="w-4 h-4 accent-teal-600" />
          <div className="flex-1">
            <div className="text-[13px] font-bold text-gray-800">📋 Account Opening Form</div>
            <div className="text-[11px] text-gray-500">Pre-filled bank account opening form PDF</div>
          </div>
          <span className="font-mono text-[14px] font-bold text-[#0f2744]">₹10</span>
        </label>

        {/* Combo option */}
        <label className={`flex items-center gap-3 p-3.5 border-[1.5px] rounded-[10px] cursor-pointer transition-all ${
          includePassbook ? 'border-teal-600 bg-teal-50' : 'border-gray-200'
        }`}>
          <input type="checkbox" checked={includePassbook}
            onChange={(e) => onToggle(e.target.checked)}
            className="w-4 h-4 accent-teal-600" />
          <div className="flex-1">
            <div className="text-[13px] font-bold text-gray-800">📖 + Passbook First Page</div>
            <div className="text-[11px] text-gray-500">Print passbook cover with same customer data</div>
          </div>
          <span className="font-mono text-[14px] font-bold text-gray-400">+₹3</span>
        </label>

        {/* Total */}
        <div className="mt-3 px-4 py-3 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="text-[13px] text-gray-500">Total Charge</span>
          <span className="font-mono text-[18px] font-bold text-[#0f2744]">
            ₹{total}.00
          </span>
        </div>
      </div>
    </div>
  );
}