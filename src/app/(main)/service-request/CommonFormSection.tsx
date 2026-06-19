'use client'
import React from 'react'
import { User } from 'lucide-react'
import { DynamicFormSection } from './DynamicFormSection'
import type { FormConfig } from '@/redux/slices/serviceRequestSlice'

interface Props {
  formConfig: FormConfig
  formData: Record<string, any>
  onChange: (name: string, value: any) => void
  errors: Record<string, string>
}

export function CommonFormSection({ formConfig, formData, onChange, errors }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[#b2e4d8] p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
          <User className="w-5 h-5 text-[#0d8f72]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#111827]">{formConfig.title}</h2>
          {formConfig.description && (
            <p className="text-sm text-[#6b7280]">{formConfig.description}</p>
          )}
        </div>
      </div>
      <DynamicFormSection
        formConfig={formConfig}
        formData={formData}
        onChange={onChange}
        errors={errors}
      />
    </div>
  )
}
