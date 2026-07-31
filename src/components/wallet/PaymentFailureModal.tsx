'use client'

interface Props {
  isOpen: boolean
  reason?: string | null
  onRetry: () => void
  onClose: () => void
}

const REASON_LABELS: Record<string, string> = {
  'Payment cancelled': 'Payment was cancelled',
}

function formatReason(reason?: string | null): string | null {
  if (!reason || !reason.trim()) return null
  const normalized = reason.trim()
  return REASON_LABELS[normalized] || normalized
}

export function PaymentFailureModal({ isOpen, reason, onRetry, onClose }: Props) {
  if (!isOpen) return null

  const displayReason = formatReason(reason)

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

          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h2 className="text-[17px] font-bold text-[#111827] mb-1.5">Payment Failed</h2>
          <p className="text-[13px] text-[#6b7280] mb-4">
            We couldn&apos;t complete your payment. Please try again.
          </p>

          {displayReason && (
            <div className="bg-[#fef2f2] border border-[#fecaca] rounded-[10px] px-4 py-3 mb-4 text-left">
              <div className="text-[11px] font-bold text-[#b91c1c] uppercase tracking-wide mb-0.5">
                Reason
              </div>
              <div className="text-[13px] font-semibold text-[#991b1b]">{displayReason}</div>
            </div>
          )}

          <button
            onClick={onRetry}
            className="w-full h-[42px] rounded-[10px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[14px] font-bold transition-colors mb-2"
          >
            Pay Again
          </button>
          <button
            onClick={onClose}
            className="w-full h-[38px] rounded-[10px] border border-[#d1d5db] text-[#374151] text-[13px] font-semibold hover:bg-[#f3f4f6] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
