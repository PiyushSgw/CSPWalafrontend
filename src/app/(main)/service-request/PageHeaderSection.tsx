'use client'
import React from 'react'
import { FileText, RotateCcw } from 'lucide-react'

interface Props {
  onReset?: () => void
}

export function PageHeaderSection({ onReset }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#0d8f72]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Service Requests</h1>
          <p className="text-sm text-[#6b7280]">Submit and manage banking service requests</p>
        </div>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New Request
        </button>
      )}
    </div>
  )
}
