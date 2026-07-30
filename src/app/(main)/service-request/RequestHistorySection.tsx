'use client'
import React from 'react'
import { Clock, FileText, Download, Loader2 } from 'lucide-react'

interface Props {
  requests: any[]
  loading: boolean
  onDownload: (requestId: string) => void
  onGenerate: (requestId: string) => void
  pdfGenerating: boolean
}

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-[#f3f4f6] text-[#6b7280]',
  SUBMITTED: 'bg-[#e6f7f3] text-[#0d8f72]',
  PROCESSING: 'bg-[#fffbeb] text-[#d97706]',
  COMPLETED: 'bg-[#e6f7f3] text-[#0d8f72]',
  REJECTED: 'bg-[#fef2f2] text-[#dc2626]',
}

export function RequestHistorySection({ requests, loading, onDownload, onGenerate, pdfGenerating }: Props) {
  const getServiceList = (req: any): string => {
    const rd = req.request_data || {}
    if (Array.isArray(rd.selectedServices)) {
      return rd.selectedServices.join(', ')
    }
    return req.service_name || 'Service Request'
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#9ca3af]" />
        <h2 className="text-lg font-semibold text-[#111827]">Recent Requests</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[#f3f4f6] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-sm text-[#9ca3af] py-6">
          No service requests yet. Submit your first request above.
        </p>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#f3f4f6] hover:border-[#e5e7eb] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#111827] truncate max-w-[200px]">
                  {getServiceList(req)}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#9ca3af] font-mono">{req.bank_code}</span>
                  <span className="text-xs text-[#d1d5db]">|</span>
                  <span className="text-xs text-[#9ca3af]">
                    {req.customer_name || 'No customer'}
                  </span>
                  <span className="text-xs text-[#d1d5db]">|</span>
                  <span className="text-xs text-[#9ca3af]">
                    {new Date(req.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                      STATUS_STYLES[req.status] || 'bg-[#f3f4f6] text-[#6b7280]'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {req.pdf_generated ? (
                  <button
                    onClick={() => onDownload(req.id)}
                    className="p-2 rounded-lg hover:bg-[#e6f7f3] text-[#0d8f72] transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                ) : req.status !== 'DRAFT' ? (
                  <button
                    onClick={() => onGenerate(req.id)}
                    disabled={pdfGenerating}
                    className="p-2 rounded-lg hover:bg-[#e6f7f3] text-[#0d8f72] transition-colors"
                    title="Generate PDF"
                  >
                    {pdfGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
