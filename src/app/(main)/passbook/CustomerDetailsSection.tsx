'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, ArrowRight, Search, User, CheckCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  createCustomer,
  fetchCustomer,
  searchCustomers,
  setSelectedCustomer,
  setWizardStep,
} from '@/redux/slices/passbookSlice'
import api from '@/utils/axios'
import toast from 'react-hot-toast'

// ─── Constants ──────────────────────────────────────────────────────────────

const ACCOUNT_TYPES = [
  { value: 'Savings Account', label: 'Savings Account' },
  { value: 'Current Account', label: 'Current Account' },
  { value: 'Jan Dhan (PMJDY)', label: 'Jan Dhan (PMJDY)' },
  { value: 'Recurring Deposit', label: 'Recurring Deposit' },
  { value: 'Fixed Deposit', label: 'Fixed Deposit' },
]

// ─── Styles ─────────────────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-[9px] border border-[#d1d5db] rounded-[8px] text-[13px] text-[#111827] bg-white placeholder-[#9ca3af] outline-none transition-all focus:border-[#0d8f72] focus:ring-2 focus:ring-[rgba(13,143,114,0.12)]'

const labelCls = 'block text-[12px] font-semibold text-[#374151] mb-[5px]'

// ─── Types ───────────────────────────────────────────────────────────────────

type FormState = {
  name: string
  account_number: string
  account_type: string
  ifsc: string
  bank_id: string
  mobile: string
  opening_balance: string
  customer_photo: File | null
}

const initialForm: FormState = {
  name: '',
  account_number: '',
  account_type: 'Savings Account',
  ifsc: '',
  bank_id: '',
  mobile: '',
  opening_balance: '0',
  customer_photo: null,
}

// ─── Component ───────────────────────────────────────────────────────────────

export const CustomerDetailsSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, loading, error } = useAppSelector((s) => s.passbook)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [banks, setBanks] = useState<{ id: number; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)

  const searchRef = useRef<HTMLDivElement>(null)

  // ── Helpers ────────────────────────────────────────────────────────────────

  const mapCustomerToForm = (c: any): FormState => ({
    name: c.name || '',
    account_number: c.account_number || c.accountNumber || '',
    account_type: c.account_type || c.accountType || 'Savings Account',
    ifsc: c.ifsc || c.ifsc_code || c.ifscCode || '',
    bank_id: String(c.bank_id || c.bankId || ''),
    mobile: c.mobile || c.mobile_number || c.mobileNumber || '',
    opening_balance: String(c.opening_balance ?? c.openingBalance ?? 0),
    customer_photo: null,
  })

  const updateField = (key: keyof FormState, value: string | File | null) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    api
      .get('/api/public/banks')
      .then((r) => setBanks(r.data.data || []))
      .catch(() => toast.error('Failed to load banks'))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    const timer = setTimeout(async () => {
      const result = await dispatch(searchCustomers(searchQuery))
      if (searchCustomers.fulfilled.match(result)) {
        setSearchResults(result.payload || [])
        setShowDropdown(true)
      } else {
        setSearchResults([])
        setShowDropdown(false)
      }
    }, 350)
    return () => clearTimeout(timer)
  }, [searchQuery, dispatch])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleIFSCBlur = async () => {
    if (!form.ifsc.trim()) return
    try {
      const res = await api.get(`/api/csp/customers/${form.ifsc}`)
      const data = res.data.data
      setForm((prev) => ({
        ...prev,
        bank_id: String(data.bank_id || data.bankId || prev.bank_id),
      }))
      if (data.bank_name) toast.success(`Bank: ${data.bank_name}`)
    } catch {
      toast.error('IFSC not found')
    }
  }

  const selectExistingCustomer = async (customerId: number) => {
    const result = await dispatch(fetchCustomer(customerId))
    if (fetchCustomer.fulfilled.match(result)) {
      const customer = result.payload
      dispatch(setSelectedCustomer(customer))
      setForm(mapCustomerToForm(customer))
      setSearchQuery(customer.name || '')
      setShowDropdown(false)
      toast.success('Customer selected')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.account_number || !form.ifsc || !form.bank_id) {
      toast.error('Please fill all required fields')
      return
    }

    const isExisting =
      !!selectedCustomer?.id && selectedCustomer.account_number === form.account_number

    if (isExisting) {
      dispatch(setWizardStep(2))
      toast.success('Using existing customer')
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        name: form.name,
        account_number: form.account_number,
        account_type: form.account_type,
        ifsc: form.ifsc.toUpperCase(),
        bank_id: Number(form.bank_id),
        mobile: form.mobile || undefined,
        opening_balance: parseFloat(form.opening_balance) || 0,
      }
      const result = await dispatch(createCustomer(payload))
      if (createCustomer.fulfilled.match(result)) {
        dispatch(setSelectedCustomer(result.payload))
        toast.success('Customer created successfully')
        dispatch(setWizardStep(2))
      } else {
        toast.error((result.payload as string) || 'Failed to create customer')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isBusy = submitting || loading

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-[14px] border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="flex items-center gap-2">
            <span>👤</span>
          <span className="text-[14px] font-bold text-[#111827]">Customer Details</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <label className={labelCls}>Search Existing Customer</label>
          <div className="flex items-center gap-[10px] px-[12px] py-[9px] bg-white border border-[#d1d5db] rounded-[9px] transition-all focus-within:border-[#0d8f72] focus-within:ring-2 focus-within:ring-[rgba(13,143,114,0.12)]">
            <Search size={13} className="text-[#9ca3af] flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or account number..."
              className="flex-1 border-none outline-none text-[13px] text-[#111827] placeholder-[#9ca3af] bg-transparent"
            />
            {loading && <Loader2 size={13} className="text-[#6b7280] animate-spin flex-shrink-0" />}
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#e5e7eb] shadow-lg z-20 overflow-hidden max-h-64 overflow-y-auto">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectExistingCustomer(c.id)}
                  className="w-full flex items-center gap-3 px-4 py-[10px] hover:bg-[#f0fdf9] transition-colors text-left border-b border-[#f3f5f8] last:border-0"
                >
                  <div className="w-8 h-8 rounded-[8px] bg-[#e8f5f1] flex items-center justify-center text-[#0d8f72] font-bold text-[12px] flex-shrink-0">
                    {c.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827]">{c.name}</p>
                    <p className="text-[11px] text-[#6b7280] font-mono truncate">
                      {c.account_number} · {c.bank_name}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-[2px] rounded-full bg-[#f3f4f6] text-[#6b7280] flex-shrink-0">
                    {c.account_type}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && searchResults.length === 0 && !loading && searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[10px] border border-[#e5e7eb] shadow-md z-20 px-4 py-3 text-[13px] text-[#6b7280]">
              No customers found — create a new one below
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#e5e7eb]" />
          <span className="text-[11px] text-[#9ca3af] font-medium">or fill new customer details</span>
          <div className="flex-1 h-px bg-[#e5e7eb]" />
        </div>

        {error && (
          <div className="px-4 py-3 rounded-[8px] bg-red-50 border border-red-200 text-red-600 text-[13px]">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
            <input type="text" required value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="As per bank records" className={inputCls} />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Account Number <span className="text-red-500">*</span></label>
            <input type="text" required value={form.account_number} onChange={(e) => updateField('account_number', e.target.value)} placeholder="Bank account number" className={`${inputCls} font-mono`} />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Account Type <span className="text-red-500">*</span></label>
            <select value={form.account_type} onChange={(e) => updateField('account_type', e.target.value)} className={inputCls}>
              {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>IFSC Code <span className="text-red-500">*</span></label>
            <input type="text" required value={form.ifsc} onChange={(e) => updateField('ifsc', e.target.value.toUpperCase())} onBlur={handleIFSCBlur} placeholder="SBIN0001234" maxLength={11} className={`${inputCls} uppercase font-mono`} />
            <p className="text-[11px] text-[#9ca3af]">Bank auto-fills on blur</p>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Bank <span className="text-red-500">*</span></label>
            <select value={form.bank_id} onChange={(e) => updateField('bank_id', e.target.value)} className={inputCls}>
              <option value="">Select bank</option>
              {banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Mobile Number</label>
            <input type="tel" value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} placeholder="9876543210" maxLength={10} className={inputCls} />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Opening Balance (₹) <span className="text-red-500">*</span></label>
            <input type="number" min="0" step="0.01" value={form.opening_balance} onChange={(e) => updateField('opening_balance', e.target.value)} className={`${inputCls} font-mono`} />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className={labelCls}>Customer Photo</label>
            <input type="file" accept="image/*" onChange={(e) => updateField('customer_photo', e.target.files?.[0] || null)} className={inputCls} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#e5e7eb]">
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center gap-2 px-5 py-[9px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[13px] font-bold rounded-[9px] transition-all disabled:opacity-50 shadow-sm"
          >
            {isBusy ? (
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
