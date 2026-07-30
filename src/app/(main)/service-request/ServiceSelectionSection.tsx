'use client'
import React from 'react'
import { ClipboardList, ArrowLeft, Check, ArrowRight } from 'lucide-react'
import type { BankService, SelectedService } from '@/redux/slices/serviceRequestSlice'

interface Props {
  services: BankService[]
  loading: boolean
  bankName: string
  selectedServices: SelectedService[]
  onToggle: (svc: SelectedService) => void
  onContinue: () => void
  onBack: () => void
}

export function ServiceSelectionSection({ services, loading, bankName, selectedServices, onToggle, onContinue, onBack }: Props) {
  const isSelected = (bankServiceId: number) =>
    selectedServices.some((s) => s.bankServiceId === bankServiceId)

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-[#f3f4f6] text-[#6b7280] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#111827]">Select Services</h2>
          <p className="text-sm text-[#6b7280]">{bankName} &mdash; choose one or more services</p>
        </div>
        {selectedServices.length > 0 && (
          <span className="text-xs font-medium text-[#0d8f72] bg-[#e6f7f3] px-2.5 py-1 rounded-full">
            {selectedServices.length} selected
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#f3f4f6] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <p className="text-center text-sm text-[#9ca3af] py-8">
          No services available for this bank.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((svc) => {
            const sel = isSelected(svc.bank_service_id)
            return (
              <button
                key={svc.bank_service_id}
                onClick={() => onToggle({ serviceId: svc.service_id, bankServiceId: svc.bank_service_id, name: svc.name, code: svc.code })}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all text-left ${
                  sel
                    ? 'border-[#0d8f72] bg-[#e6f7f3] ring-2 ring-[#b2e4d8]'
                    : 'border-[#e5e7eb] hover:border-[#0d8f72] hover:bg-[#f9fafb]'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  sel ? 'bg-[#0d8f72] text-white' : 'bg-[#e6f7f3] text-[#0d8f72]'
                }`}>
                  {sel ? <Check className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold text-[#111827]">{svc.name}</p>
                  {svc.description && (
                    <p className="text-xs text-[#6b7280] mt-0.5 line-clamp-2">{svc.description}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedServices.length > 0 && (
        <div className="flex justify-end mt-5 pt-4 border-t border-[#f3f4f6]">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
          >
            Continue with {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
