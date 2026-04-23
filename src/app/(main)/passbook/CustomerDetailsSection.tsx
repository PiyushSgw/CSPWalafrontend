'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { searchCustomers, createCustomer, fetchCustomer, setSelectedCustomer, setWizardStep } from '@/redux/slices/passbookSlice'
import api from '@/utils/axios'
import toast from 'react-hot-toast'

const ACCOUNT_TYPES = [
  { value: 'Savings Account', label: 'Savings Account' },
  { value: 'Current Account', label: 'Current Account' },
  { value: 'Jan Dhan (PMJDY)', label: 'Jan Dhan (PMJDY)' },
  { value: 'Recurring Deposit', label: 'Recurring Deposit' },
  { value: 'Fixed Deposit', label: 'Fixed Deposit' },
]

const inputClass = `
  w-full px-3 py-[9px] border-[1.5px] border-[#d1d5db] rounded-[8px]
  text-[13px] text-[#111827] bg-white placeholder-[#9ca3af]
  outline-none transition-all
  focus:border-[#0d8f72] focus:ring-[3px] focus:ring-[rgba(13,143,114,0.1)]
`

const labelClass = 'block text-[12px] font-semibold text-[#374151] mb-[6px]'

export const CustomerDetailsSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, loading, error } = useAppSelector((s) => s.passbook)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [banks, setBanks] = useState<{ id: number; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    name: '',
    account_number: '',
    account_type: 'Savings Account',
    ifsc: '',
    bank_id: '',
    mobile: '',
    opening_balance: '0',
  })

  // Load banks on mount
  useEffect(() => {
    api
      .get('/api/public/banks')
      .then((r) => setBanks(r.data.data || []))
      .catch(() => toast.error('Failed to load banks'))
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Search customers
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    const timeout = setTimeout(async () => {
      debugger
      const result = await dispatch(searchCustomers(searchQuery))
      if (searchCustomers.fulfilled.match(result)) {
        setSearchResults(result.payload || [])
        setShowDropdown(true)
      } else {
        setSearchResults([])
      }
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchQuery, dispatch])

  // Auto-fill IFSC
  const handleIFSCBlur = async () => {
    if (form.ifsc.length !== 11) return
    try {
      const res = await api.get(`/api/public/ifsc/${form.ifsc}`)
      const data = res.data.data
      setForm((f) => ({ ...f, bank_id: String(data.bank_id) }))
      toast.success(`Bank: ${data.bank_name}`)
    } catch {
      toast.error('IFSC not found')
    }
  }

  // Select existing customer
  const selectExistingCustomer = async (customerId: number) => {
    const result = await dispatch(fetchCustomer(customerId))
    if (fetchCustomer.fulfilled.match(result)) {
      const customer = result.payload
      setForm({
        name: customer.name,
        account_number: customer.account_number,
        account_type: customer.account_type,
        ifsc: customer.ifsc_code,
        bank_id: String(customer.bank_id),
        mobile: customer.mobile_number || '',
        opening_balance: String(customer.opening_balance),
      })
      setSearchQuery(customer.name)
      setShowDropdown(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!form.name || !form.account_number || !form.ifsc || !form.bank_id) {
      toast.error('Please fill all required fields')
      return
    }

    // If customer was fetched, move to next step
    if (selectedCustomer) {
      dispatch(setWizardStep(2))
      return
    }

    // Otherwise create new customer
    setSubmitting(true)
    const result = await dispatch(
      createCustomer({
        name: form.name,
        account_number: form.account_number,
        account_type: form.account_type,
        ifsc: form.ifsc.toUpperCase(),
        bank_id: parseInt(form.bank_id),
        mobile: form.mobile || undefined,
        opening_balance: parseFloat(form.opening_balance) || 0,
      })
    )

    setSubmitting(false)

    if (createCustomer.fulfilled.match(result)) {
      toast.success('Customer saved!')
      dispatch(setWizardStep(2))
    } else {
      // toast.error(result.payload || 'Failed to create customer')
    }
  }

  const updateField = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#111827]">
          <span>👤</span>
          Customer Details
        </div>
        {selectedCustomer && (
          <span className="inline-flex items-center text-[11px] font-bold px-[10px] py-[3px] rounded-full bg-[#f0fdf4] text-[#16a34a]">
            ✓ Existing Customer
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Search Section */}
        <div ref={searchRef} className="relative">
          <label className={labelClass}>Search Existing Customer</label>

          <div className="flex items-center gap-[10px] px-[14px] py-[9px] bg-white border-[1.5px] border-[#d1d5db] rounded-[9px] transition-all focus-within:border-[#0d8f72] focus-within:ring-[3px] focus-within:ring-[rgba(13,143,114,0.1)]">
            <span>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or account number..."
              className="flex-1 border-none outline-none text-[13px] text-[#111827] placeholder-[#9ca3af] bg-transparent"
            />
            {loading && <Loader2 size={14} className="text-[#6b7280] animate-spin flex-shrink-0" />}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#e5e7eb] shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectExistingCustomer(c.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#e6f7f3] transition-colors text-left border-b border-[#f3f5f8] last:border-0"
                >
                  <div className="w-8 h-8 rounded-[7px] bg-[#eff2f9] flex items-center justify-center text-[#0f2744] font-bold text-[12px] flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827]">{c.name}</p>
                    <p className="text-[11px] text-[#6b7280] font-mono">
                      {c.account_number} · {c.bank_name}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-bold px-[10px] py-[3px] rounded-full bg-[#f3f4f6] text-[#6b7280] capitalize flex-shrink-0">
                    {c.account_type?.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchResults.length === 0 && !loading && searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#e5e7eb] shadow-lg z-20 px-4 py-3 text-[13px] text-[#6b7280]">
              No customers found — create a new one below
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-[11px] text-[#6b7280] font-medium">or fill new customer details</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              Full Name <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="As per bank records"
              className={inputClass}
            />
          </div>

          {/* Account Number */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              Account Number <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.account_number}
              onChange={(e) => updateField('account_number', e.target.value)}
              placeholder="Bank account number"
              className={`${inputClass} font-mono`}
            />
          </div>

          {/* Account Type */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              Account Type <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={form.account_type}
              onChange={(e) => updateField('account_type', e.target.value)}
              className={inputClass}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* IFSC Code */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              IFSC Code <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.ifsc}
              onChange={(e) => updateField('ifsc', e.target.value)}
              onBlur={handleIFSCBlur}
              placeholder="SBIN0001234"
              maxLength={11}
              className={`${inputClass} font-mono uppercase`}
            />
            <p className="text-[11px] text-[#6b7280]">Auto-fills bank on blur</p>
          </div>

          {/* Bank */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              Bank <span className="text-[#dc2626]">*</span>
            </label>
            <select
              value={form.bank_id}
              onChange={(e) => updateField('bank_id', e.target.value)}
              required
              className={inputClass}
            >
              <option value="">Select Bank</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>Mobile Number</label>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="9876543210"
              maxLength={10}
              className={inputClass}
            />
          </div>

          {/* Opening Balance */}
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass}>
              Opening Balance (₹) <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.opening_balance}
              onChange={(e) => updateField('opening_balance', e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-[#e5e7eb]">
          <button
            type="submit"
            disabled={submitting || loading}
            className="inline-flex items-center gap-[7px] px-[18px] py-[9px] bg-[#0d8f72] hover:opacity-90 hover:-translate-y-px text-white text-[13px] font-bold rounded-[8px] border-[1.5px] border-[#0d8f72] transition-all disabled:opacity-50 shadow-sm"
          >
            {submitting || loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Next: Add Transactions
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
