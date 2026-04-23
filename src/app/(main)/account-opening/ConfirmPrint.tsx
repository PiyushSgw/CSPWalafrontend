'use client';

interface Props {
  bank: string;
  accountType: string;
  customerName: string;
  includePassbook: boolean;
  walletBalance: number;
  onBack: () => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export default function ConfirmPrint({
  bank,
  accountType,
  customerName,
  includePassbook,
  walletBalance,
  onBack,
  onConfirm,
  loading = false,
}: Props) {
  const charge = includePassbook ? 13 : 10;
  const remaining = walletBalance - charge;
  const canPrint = remaining >= 0 && !loading && !!customerName?.trim();

  return (
    <div className="max-w-[560px] mx-auto">
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
        <span className="text-[48px] block mb-3">📋</span>

        <div className="text-[16px] font-extrabold text-gray-800 mb-1.5">
          Ready to Print Account Opening Form
        </div>

        <div className="text-[13px] text-gray-500 mb-2">
          {bank} {accountType} · Customer:{' '}
          <strong>{customerName?.trim() || 'Not filled'}</strong>
        </div>

        <div className="flex gap-3 justify-center my-3.5 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700">
            📋 Account Form
          </span>

          {includePassbook && (
            <>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700">
                📖 Passbook Cover
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700">
                🔗 Combo Rate Applied
              </span>
            </>
          )}
        </div>

        <div className="font-mono text-[28px] text-[#0f2744] font-medium my-3">
          ₹{charge}.00
        </div>

        <div className="text-[12px] text-gray-400">
          Wallet: ₹{walletBalance}.00 → ₹{remaining}.00 after print
        </div>

        {!customerName?.trim() && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[12px] text-amber-700 font-semibold">
            Please fill customer name before generating PDF.
          </div>
        )}

        {remaining < 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600 font-semibold">
            ❌ Insufficient balance! Please recharge your wallet.
          </div>
        )}

        <div className="flex gap-3 justify-center mt-5 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Please wait...' : '← Edit Details'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!canPrint}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[13px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Processing...' : '✅ Confirm & Print PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}