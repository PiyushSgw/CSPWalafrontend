'use client'
import React from 'react'
import { ArrowLeft, CheckCircle, Loader2, Send, User, ShieldCheck, Users, FileSignature } from 'lucide-react'
import type { CustomerSearchResult, ApyFormData } from '@/redux/slices/apySlice'

interface Props {
  customer: CustomerSearchResult | null
  formData: ApyFormData
  isEdit: boolean
  submitting: boolean
  onSubmit: () => void
  onBack: () => void
}

export function ReviewSection({ customer, formData, isEdit, submitting, onSubmit, onBack }: Props) {
  const labelValue = (label: string, value: string | boolean | undefined | null): { label: string; value: string } | null => {
    const v = value === true ? 'Yes' : value === false ? 'No' : value || ''
    if (!v) return null
    return { label, value: String(v) }
  }

  const personal: { label: string; value: string }[] = [
    labelValue('Title', formData.title),
    labelValue('Full Name', formData.fullName),
    labelValue('Date of Birth', formData.dateOfBirth),
    labelValue('Age', formData.age),
    labelValue('Mobile', formData.mobile),
    labelValue('Email', formData.email),
    labelValue('Aadhaar', formData.aadhaar),
    labelValue('Married', formData.isMarried),
    labelValue('Spouse Name', formData.spouseName),
    labelValue('Spouse Aadhaar', formData.spouseAadhaar),
  ].filter(Boolean) as { label: string; value: string }[]

  const nominee: { label: string; value: string }[] = [
    labelValue('Nominee Name', formData.nomineeName),
    labelValue('Nominee Aadhaar', formData.nomineeAadhaar),
    labelValue('Relation', formData.nomineeRelation),
    labelValue('Nominee DOB', formData.nomineeDob),
    labelValue('Guardian Name', formData.guardianName),
  ].filter(Boolean) as { label: string; value: string }[]

  const scheme: { label: string; value: string }[] = [
    labelValue('Contribution Frequency', formData.contributionFrequency),
    labelValue('Pension Amount', formData.pensionAmount ? `₹${formData.pensionAmount}` : ''),
    labelValue('Contribution Amount', formData.contributionAmount ? `₹${formData.contributionAmount}` : ''),
    labelValue('Has Other Social Schemes', formData.hasOtherSocialSchemes),
    labelValue('Income Tax Payer', formData.isIncomeTaxPayer),
    labelValue('FATCA Applicable', formData.isFatcaApplicable),
  ].filter(Boolean) as { label: string; value: string }[]

  const declaration: { label: string; value: string }[] = [
    labelValue('Declaration Date', formData.declarationDate),
    labelValue('Declaration Place', formData.declarationPlace),
  ].filter(Boolean) as { label: string; value: string }[]

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

        {customer && (
          <div className="bg-[#e6f7f3] border border-[#b2e4d8] rounded-xl p-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0d8f72] flex items-center justify-center flex-shrink-0">
                <span className="text-base font-bold text-white">{customer.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">{customer.name}</p>
                <p className="text-xs text-[#6b7280]">{customer.bank_name} &middot; A/c: {customer.account_number}</p>
              </div>
            </div>
          </div>
        )}

        <Section icon={<User className="w-4 h-4" />} title="Personal Information" rows={personal} />
        <Section icon={<Users className="w-4 h-4" />} title="Nominee Details" rows={nominee} />
        <Section icon={<ShieldCheck className="w-4 h-4" />} title="Scheme Details" rows={scheme} />
        <Section icon={<FileSignature className="w-4 h-4" />} title="Declaration" rows={declaration} />
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
              {isEdit ? 'Update Subscription' : 'Submit Subscription'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function Section({ icon, title, rows }: { icon: React.ReactNode; title: string; rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-[#e6f7f3] flex items-center justify-center text-[#0d8f72]">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 bg-[#f9fafb] rounded-lg border border-[#f3f4f6]">
            <div className="flex-1 min-w-0 flex items-center justify-between">
              <p className="text-xs text-[#6b7280]">{row.label}</p>
              <p className="text-sm font-medium text-[#111827]">{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
