'use client'
import React from 'react'
import { CheckCircle, FileText, Download, Loader2, RotateCcw, ExternalLink } from 'lucide-react'
import type { ServiceRequest, SelectedService } from '@/redux/slices/serviceRequestSlice'

interface Props {
  requests: ServiceRequest[]
  selectedServices: SelectedService[]
  pdfGenerating: boolean
  onGeneratePDF: (requestId: string) => void
  onDownloadPDF: (requestId: string) => void
  onNewRequest: () => void
}

export function DoneSection({ requests, selectedServices, pdfGenerating, onGeneratePDF, onDownloadPDF, onNewRequest }: Props) {
  if (requests.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-[#e6f7f3] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#0d8f72]" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-1">
          {requests.length > 1
            ? `${requests.length} Requests Submitted Successfully!`
            : 'Request Submitted Successfully!'}
        </h2>
        <p className="text-sm text-[#6b7280] mb-6">
          {requests.length > 1
            ? 'All service requests have been received and are being processed.'
            : 'Your service request has been received and is being processed.'}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {requests.map((req) => {
          const svc = selectedServices.find((s) => s.serviceId === req.service_id)
          return (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 rounded-lg border border-[#f3f4f6] bg-[#fafafa]"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111827]">{svc?.name || req.service_name || 'Service Request'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono text-[#9ca3af]">Ref: {req.id}</span>
                  <span className="text-xs text-[#d1d5db]">|</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#e6f7f3] text-[#0d8f72]">
                    {req.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {req.pdf_generated ? (
                  <button
                    onClick={() => onDownloadPDF(req.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d8f72] text-white text-xs font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                ) : (
                  <button
                    onClick={() => onGeneratePDF(req.id)}
                    disabled={pdfGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2744] text-white text-xs font-semibold rounded-lg hover:bg-[#1a3d6e] disabled:opacity-50 transition-colors"
                  >
                    {pdfGenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    Generate PDF
                  </button>
                )}
                <a
                  href={`/service-request/${req.id}`}
                  className="p-1.5 rounded-lg hover:bg-[#f3f4f6] text-[#9ca3af] transition-colors"
                  title="View Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNewRequest}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#374151] text-sm font-semibold rounded-lg border border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New Request
        </button>
      </div>
    </div>
  )
}
