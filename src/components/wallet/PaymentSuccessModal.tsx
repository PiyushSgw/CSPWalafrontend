'use client'

interface Props {
  isOpen: boolean
  walletBalance: number
  rechargeAmount: number
  onClose: () => void
}

export function PaymentSuccessModal({
  isOpen,
  walletBalance,
  rechargeAmount,
  onClose,
}: Props) {
  if (!isOpen) return null

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white w-full max-w-[400px] rounded-[14px] shadow-xl border border-[#e5e7eb] overflow-hidden animate-fadeUp">
        <div className="relative px-6 pt-6 pb-5 text-center">

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] text-[#6b7280] text-[18px] leading-none"
          >
            ×
          </button>

          {/* Success Icon */}
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#ecfdf5] border border-[#bbf7d0] flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 className="text-[17px] font-bold text-[#111827] mb-1.5">
            Payment Successful
          </h2>

          <p className="text-[13px] text-[#6b7280] mb-5">
            Your payment has been completed successfully.
          </p>

          {/* Recharge Amount */}
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[10px] px-4 py-3 mb-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#166534] mb-1">
              Recharge Amount
            </div>

            <div className="text-[22px] font-bold text-[#15803d]">
              + ₹{rechargeAmount.toFixed(2)}
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-[10px] px-4 py-3 mb-5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#6b7280] mb-1">
              Updated Wallet Balance
            </div>

            <div className="text-[24px] font-bold text-[#111827]">
              ₹{walletBalance.toFixed(2)}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full h-[42px] rounded-[10px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[14px] font-bold transition-colors"
          >
            Continue
          </button>

        </div>
      </div>
    </div>
  )
}