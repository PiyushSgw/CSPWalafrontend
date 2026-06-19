'use client'
import React from 'react'
import { Loader2 } from 'lucide-react'
import type { FormConfig } from '@/redux/slices/serviceRequestSlice'

interface Props {
  formConfig: FormConfig
  formData: Record<string, any>
  onChange: (name: string, value: any) => void
  errors: Record<string, string>
  loading?: boolean
}

function normalizeOptions(opts: { value: string; label: string }[] | string[] | undefined): { value: string; label: string }[] {
  if (!opts) return []
  if (typeof opts[0] === 'string') {
    return (opts as string[]).map((s) => ({ value: s, label: s }))
  }
  return opts as { value: string; label: string }[]
}

export function DynamicFormSection({ formConfig, formData, onChange, errors, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#0d8f72] animate-spin" />
          <span className="ml-2 text-sm text-[#6b7280]">Loading form...</span>
        </div>
      </div>
    )
  }

  const renderField = (field: FormConfig['fields'][number]) => {
    const val = formData[field.name]
    const err = errors[field.name]
    const inputClass = `w-full px-3 py-[9px] text-[13px] border rounded-[8px] outline-none transition-all focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72] ${
      err ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-[#d1d5db] bg-white'
    } placeholder-[#9ca3af]`

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={val ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        )

      case 'select':
        return (
          <select
            value={val ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClass}
          >
            <option value="">Select {field.label}</option>
            {normalizeOptions(field.options).map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={val ?? false}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="w-4 h-4 rounded border-[#d1d5db] text-[#0d8f72] focus:ring-[rgba(13,143,114,0.3)]"
            />
            <span className="text-sm text-[#6b7280]">{field.placeholder || field.label}</span>
          </label>
        )

      case 'checkbox-group': {
        const options = normalizeOptions(field.options)
        const selected: string[] = Array.isArray(val) ? val : []
        return (
          <div className="flex flex-wrap gap-4">
            {options.map((opt) => {
              const checked = selected.includes(opt.value)
              return (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? selected.filter((v) => v !== opt.value)
                        : [...selected, opt.value]
                      onChange(field.name, next)
                    }}
                    className="w-4 h-4 rounded border-[#d1d5db] text-[#0d8f72] focus:ring-[rgba(13,143,114,0.3)]"
                  />
                  <span className="text-sm text-[#6b7280]">{opt.label}</span>
                </label>
              )
            })}
          </div>
        )
      }

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4">
            {normalizeOptions(field.options).map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={val === opt.value}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-4 h-4 text-[#0d8f72] focus:ring-[rgba(13,143,114,0.3)]"
                />
                <span className="text-sm text-[#6b7280]">{opt.label}</span>
              </label>
            ))}
          </div>
        )

      case 'email':
        return (
          <input
            type="email"
            value={val ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={inputClass}
          />
        )

      default:
        return (
          <input
            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            value={val ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className={inputClass}
          />
        )
    }
  }

  return (
    <div className="space-y-4">
      {formConfig.fields.map((field) => (
        <div key={field.name}>
          <label className="block text-[12px] font-semibold text-[#374151] mb-[5px]">
            {field.label}
            {field.required && <span className="text-[#dc2626] ml-0.5">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <p className="mt-1 text-xs text-[#dc2626]">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export function validateFormConfig(formConfig: FormConfig, formData: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {}
  formConfig.fields.forEach((f) => {
    if (f.required) {
      const val = formData[f.name]
      if (f.type === 'checkbox-group') {
        if (!Array.isArray(val) || val.length === 0) {
          errors[f.name] = `${f.label} is required`
        }
      } else if (val === undefined || val === null || String(val).trim() === '') {
        errors[f.name] = `${f.label} is required`
      }
    }
  })
  return errors
}
