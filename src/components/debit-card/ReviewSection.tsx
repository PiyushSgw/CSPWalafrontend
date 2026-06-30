'use client'
import React from 'react'
import { ArrowLeft, CheckCircle, Loader2, Send, CreditCard, User, MapPin, Smartphone } from 'lucide-react'
import type { CustomerSearchResult, DebitCardFormData } from '@/redux/slices/debitCardSlice'

interface Props {
  customer: CustomerSearchResult
  formData: DebitCardFormData
  submitting: boolean
  onSubmit: () => void
  onBack: () => void
}

export function ReviewSection({ customer, formData, submitting, onSubmit, onBack }: Props) {
  const rows: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Customer Name', value: customer.name, icon: <User className="w-4 h-4" /> },
    { label: 'Mobile', value: customer.mobile, icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Account Number', value: formData.accountNumber || customer.account_number || 'N/A', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Branch Name', value: formData.branchName || customer.bank_name || 'N/A', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Card Request Type', value: formData.cardRequestType, icon: <CreditCard className="w-4 h-4" /> },
  ]

  if (formData.cardRequestType === 'Personalized Card') {
    rows.push({ label: 'Card Type', value: formData.cardType, icon: <CreditCard className="w-4 h-4" /> })
  }

  rows.push(
    { label: 'Name On Card', value: formData.nameOnCard, icon: <User className="w-4 h-4" /> },
    { label: 'Delivery Address', value: formData.deliveryAddress, icon: <MapPin className="w-4 h-4" /> },
    { label: 'ATM Usage', value: formData.atmUsage, icon: <CreditCard className="w-4 h-4" /> },
    { label: 'POS Usage', value: formData.posUsage, icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Mobile Number', value: formData.mobileNumber, icon: <Smartphone className="w-4 h-4" /> },
    { label: 'Place', value: formData.place || 'N/A', icon: <MapPin className="w-4 h-4" /> },
  )

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-[#0d8f72]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Review & Confirm</h2>
            <p className="text-sm text-[#6b7280]">Please verify all details before submitting</p>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-lg border border-[#f3f4f6]"
            >
              <div className="w-8 h-8 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center text-[#6b7280] flex-shrink-0">
                {row.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#6b7280]">{row.label}</p>
                <p className="text-sm font-medium text-[#111827]">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl border border-[#e5e7eb] p-4">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Confirm & Generate PDF
            </>
          )}
        </button>
      </div>
    </div>
  )
}
