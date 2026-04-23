'use client'

import { ArrowLeft, ArrowRight, Loader2, Eye } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setWizardStep } from '@/redux/slices/passbookSlice'

export const PassbookPreviewSection = () => {
  const dispatch = useAppDispatch()
  const { preview, loading, error } = useAppSelector((s) => s.passbook)

  const handleNext = () => {
    dispatch(setWizardStep(4))
  }

  const handlePrev = () => {
    dispatch(setWizardStep(2))
  }

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye size={15} className="text-green-600" />
            <span className="font-semibold text-slate-700 text-sm">
              Passbook Preview
            </span>
          </div>
          {preview && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>{preview.transaction_count} transactions</span>
              <span>·</span>
              <span className="font-mono font-semibold text-slate-700">
                Closing: ₹{preview.closing_balance}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={28} className="animate-spin text-green-600" />
              <p className="text-sm text-slate-500">Generating preview...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {preview?.html && !loading && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Preview label */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  A5 Passbook Preview
                </span>
                <span className="text-xs text-slate-400">
                  Actual PDF may vary slightly
                </span>
              </div>

              {/* HTML preview */}
              <div
                className="p-4 bg-white overflow-auto"
                style={{ maxHeight: '420px' }}
              >
                <div
                  style={{
                    transform: 'scale(0.88)',
                    transformOrigin: 'top left',
                    width: '113%',
                  }}
                  dangerouslySetInnerHTML={{ __html: preview.html }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Edit Transactions
        </button>
        <button
          onClick={handleNext}
          disabled={!preview || loading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Confirm & Print
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
