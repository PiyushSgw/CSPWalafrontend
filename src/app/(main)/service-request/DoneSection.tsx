'use client'
import React from 'react'
import { CheckCircle, FileText, Download, Loader2, RotateCcw, Check } from 'lucide-react'
import type { ServiceRequest, SelectedService } from '@/redux/slices/serviceRequestSlice'

interface Props {
  request: ServiceRequest | null
  selectedServices: SelectedService[]
  bankName: string
  pdfGenerating: boolean
  onGeneratePDF: (requestId: string) => void
  onDownloadPDF: (requestId: string) => void
  onNewRequest: () => void
}

export function DoneSection({ request, selectedServices, bankName, pdfGenerating, onGeneratePDF, onDownloadPDF, onNewRequest }: Props) {
  if (!request) return null

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 rounded-full bg-[#e6f7f3] flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-[#0d8f72]" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-1">
          Request Submitted Successfully!
        </h2>
        <p className="text-sm text-[#6b7280] mb-6">
          Your service request has been received and is being processed.
        </p>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] p-5 mb-6 bg-[#fafafa]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-[#111827]">{bankName}</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e6f7f3] text-[#0d8f72]">
            {request.status}
          </span>
        </div>

        <div className="text-xs text-[#9ca3af] font-mono mb-3">
          Ref: {request.id}
        </div>

        <div className="mb-3">
          <p className="text-xs font-semibold text-[#6b7280] mb-2 uppercase tracking-wide">Services Requested:</p>
          <div className="space-y-1.5">
            {selectedServices.map((svc) => (
              <div key={svc.bankServiceId} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#0d8f72] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-[#374151]">{svc.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center pt-3 border-t border-[#e5e7eb]">
          {request.pdf_generated ? (
            <button
              onClick={() => onDownloadPDF(request.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          ) : (
            <button
              onClick={() => onGeneratePDF(request.id)}
              disabled={pdfGenerating}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0f2744] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3d6e] disabled:opacity-50 transition-colors"
            >
              {pdfGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              Generate PDF
            </button>
          )}
        </div>
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
