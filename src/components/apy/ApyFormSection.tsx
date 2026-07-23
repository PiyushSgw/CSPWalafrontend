'use client'
import React, { useEffect } from 'react'
import { ArrowRight, ArrowLeft, User, Users, ShieldCheck, FileSignature } from 'lucide-react'
import type { ApyFormData } from '@/redux/slices/apySlice'

interface Props {
  formData: ApyFormData
  onChange: (data: Partial<ApyFormData>) => void
  onContinue: () => void
  onBack: () => void
}

const TITLE_OPTIONS = ['Mr.', 'Ms.', 'Dr.']
const NOMINEE_RELATIONS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Other']
const FREQUENCY_OPTIONS = ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly']

export function ApyFormSection({ formData, onChange, onContinue, onBack }: Props) {
  const val = (v: any) => typeof v === 'string' ? v.trim() : ''
  const canContinue = () => {
    const missing: string[] = []
    if (!formData.title) missing.push('title')
    if (!val(formData.fullName)) missing.push('fullName')
    if (!val(formData.mobile)) missing.push('mobile')
    if (!val(formData.aadhaar)) missing.push('aadhaar')
    if (!val(formData.nomineeName)) missing.push('nomineeName')
    if (!formData.nomineeRelation) missing.push('nomineeRelation')
    if (!formData.contributionFrequency) missing.push('contributionFrequency')
    if (!formData.pensionAmount) missing.push('pensionAmount')
    if (formData.isMarried && !val(formData.spouseName)) missing.push('spouseName')
    if (missing.length > 0) console.log('[APY] canContinue=false, missing fields:', missing, { formData })
    else console.log('[APY] canContinue=true, all required fields filled')
    return missing.length === 0
  }

  useEffect(() => {
    if (formData.nomineeRelation === 'Spouse') {
      const updates: Partial<ApyFormData> = {}
      if (formData.nomineeName !== formData.spouseName) {
        updates.spouseName = formData.nomineeName
      }
      if (formData.nomineeAadhaar !== formData.spouseAadhaar) {
        updates.spouseAadhaar = formData.nomineeAadhaar
      }
      if (Object.keys(updates).length > 0) {
        onChange(updates)
      }
    }
  }, [formData.nomineeRelation, formData.nomineeName, formData.nomineeAadhaar, onChange])

  const inputClass = (val?: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72] ${
      val !== undefined && !val ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-[#d1d5db] bg-white'
    }`

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
          <User className="w-5 h-5 text-[#0d8f72]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">Atal Pension Yojana</h2>
          <p className="text-sm text-[#6b7280]">Fill in the APY subscription details</p>
        </div>
      </div>

      <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-[#0d8f72]" />
          <h3 className="text-sm font-semibold text-[#111827]">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Title <span className="text-[#dc2626]">*</span></label>
            <select
              value={formData.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className={inputClass(formData.title)}
            >
              <option value="">Select Title</option>
              {TITLE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Full Name <span className="text-[#dc2626]">*</span></label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onChange({ dateOfBirth: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => onChange({ age: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
              min={18}
              max={40}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Mobile <span className="text-[#dc2626]">*</span></label>
            <input
              type="text"
              value={formData.mobile}
              onChange={(e) => onChange({ mobile: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
              maxLength={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Aadhaar Number <span className="text-[#dc2626]">*</span></label>
            <input
              type="text"
              value={formData.aadhaar}
              onChange={(e) => onChange({ aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
              maxLength={12}
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isMarried}
                onChange={(e) => onChange({ isMarried: e.target.checked })}
                className="w-4 h-4 accent-[#0d8f72]"
              />
              <span className="text-sm font-medium text-[#374151]">Married</span>
            </label>
          </div>
          {formData.isMarried && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-[#e6f7f3] ml-2">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Spouse Name <span className="text-[#dc2626]">*</span></label>
                <input
                  type="text"
                  value={formData.spouseName}
                  onChange={(e) => onChange({ spouseName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Spouse Aadhaar</label>
                <input
                  type="text"
                  value={formData.spouseAadhaar}
                  onChange={(e) => onChange({ spouseAadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
                  maxLength={12}
                  inputMode="numeric"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-[#0d8f72]" />
          <h3 className="text-sm font-semibold text-[#111827]">Nominee Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Nominee Name <span className="text-[#dc2626]">*</span></label>
            <input
              type="text"
              value={formData.nomineeName}
              onChange={(e) => onChange({ nomineeName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Nominee Aadhaar</label>
            <input
              type="text"
              value={formData.nomineeAadhaar}
              onChange={(e) => onChange({ nomineeAadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
              maxLength={12}
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Nominee Address</label>
          <input
            type="text"
            value={formData.nomineeAddress}
            onChange={(e) => onChange({ nomineeAddress: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            placeholder="Nominee's full address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Relation with Nominee <span className="text-[#dc2626]">*</span></label>
            <select
              value={formData.nomineeRelation}
              onChange={(e) => onChange({ nomineeRelation: e.target.value })}
              className={inputClass(formData.nomineeRelation)}
            >
              <option value="">Select Relation</option>
              {NOMINEE_RELATIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Nominee DOB</label>
            <input
              type="date"
              value={formData.nomineeDob}
              onChange={(e) => onChange({ nomineeDob: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Guardian Name</label>
            <input
              type="text"
              value={formData.guardianName}
              onChange={(e) => onChange({ guardianName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
        </div>
      </div>

      <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#0d8f72]" />
          <h3 className="text-sm font-semibold text-[#111827]">Scheme Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Contribution Frequency <span className="text-[#dc2626]">*</span></label>
            <select
              value={formData.contributionFrequency}
              onChange={(e) => onChange({ contributionFrequency: e.target.value })}
              className={inputClass(formData.contributionFrequency)}
            >
              <option value="">Select Frequency</option>
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Pension Amount (₹) <span className="text-[#dc2626]">*</span></label>
            <select
              value={formData.pensionAmount}
              onChange={(e) => onChange({ pensionAmount: e.target.value })}
              className={inputClass(formData.pensionAmount)}
            >
              <option value="">Select Pension Amount</option>
              {['1000', '2000', '3000', '4000', '5000'].map((a) => (
                <option key={a} value={a}>₹{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Contribution Amount (₹)</label>
            <input
              type="number"
              value={formData.contributionAmount}
              onChange={(e) => onChange({ contributionAmount: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasOtherSocialSchemes}
              onChange={(e) => onChange({ hasOtherSocialSchemes: e.target.checked })}
              className="w-4 h-4 accent-[#0d8f72]"
            />
            <span className="text-sm text-[#374151]">Has other social security schemes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isIncomeTaxPayer}
              onChange={(e) => onChange({ isIncomeTaxPayer: e.target.checked })}
              className="w-4 h-4 accent-[#0d8f72]"
            />
            <span className="text-sm text-[#374151]">Is Income Tax Payer</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFatcaApplicable}
              onChange={(e) => onChange({ isFatcaApplicable: e.target.checked })}
              className="w-4 h-4 accent-[#0d8f72]"
            />
            <span className="text-sm text-[#374151]">FATCA Declaration Applicable</span>
          </label>
        </div>
      </div>

      <div className="border border-[#e5e7eb] rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileSignature className="w-4 h-4 text-[#0d8f72]" />
          <h3 className="text-sm font-semibold text-[#111827]">Declaration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Declaration Date</label>
            <input
              type="date"
              value={formData.declarationDate}
              onChange={(e) => onChange({ declarationDate: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Declaration Place</label>
            <input
              type="text"
              value={formData.declarationPlace}
              onChange={(e) => onChange({ declarationPlace: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={!canContinue()}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Review Details
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
