'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, User, X, Loader2, Check, ArrowRight } from 'lucide-react'
import type { CustomerSearchResult } from '@/redux/slices/apySlice'

interface Props {
  searchResults: CustomerSearchResult[]
  searchLoading: boolean
  selectedCustomer: CustomerSearchResult | null
  onSearch: (query: string) => void
  onSelect: (customer: CustomerSearchResult | null) => void
  onContinue: () => void
  onClearSearch: () => void
}

export function CustomerSearchSection({
  searchResults,
  searchLoading,
  selectedCustomer,
  onSearch,
  onSelect,
  onContinue,
  onClearSearch,
}: Props) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query.trim().length < 2) {
      onClearSearch()
      setShowDropdown(false)
      return
    }
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim())
      setShowDropdown(true)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (customer: CustomerSearchResult) => {
    onSelect(customer)
    setShowDropdown(false)
    setQuery('')
  }

  const handleClearSelection = () => {
    onSelect(null)
    setQuery('')
  }

  if (selectedCustomer) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
            <User className="w-5 h-5 text-[#0d8f72]" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#111827]">Selected Customer</h2>
            <p className="text-sm text-[#6b7280]">Customer information loaded</p>
          </div>
        </div>

        <div className="bg-[#e6f7f3] border border-[#b2e4d8] rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0d8f72] flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#111827]">{selectedCustomer.name}</h3>
                <span className="px-2 py-0.5 bg-[#0d8f72] text-white text-[10px] font-bold rounded-full">
                  SELECTED
                </span>
              </div>
              <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1">
                <p className="text-xs text-[#6b7280]">
                  Mobile: <span className="font-medium text-[#374151]">{selectedCustomer.mobile}</span>
                </p>
                <p className="text-xs text-[#6b7280]">
                  Account: <span className="font-medium text-[#374151]">{selectedCustomer.account_number || 'N/A'}</span>
                </p>
                <p className="text-xs text-[#6b7280]">
                  Bank: <span className="font-medium text-[#374151]">{selectedCustomer.bank_name}</span>
                </p>
                <p className="text-xs text-[#6b7280]">
                  Aadhar: <span className="font-medium text-[#374151]">{selectedCustomer.aadhar_number || 'N/A'}</span>
                </p>
                {selectedCustomer.address && (
                  <p className="text-xs text-[#6b7280] col-span-2">
                    Address: <span className="font-medium text-[#374151]">{selectedCustomer.address}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClearSelection}
              className="p-1.5 rounded-lg hover:bg-[#d1f0e8] text-[#0d8f72] transition-colors flex-shrink-0"
              title="Change customer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-5 pt-4 border-t border-[#f3f4f6]">
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
          >
            Continue to Form
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
          <User className="w-5 h-5 text-[#0d8f72]" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#111827]">Select Customer</h2>
          <p className="text-sm text-[#6b7280]">
            Search by customer name, mobile number, account number, or Aadhar number
          </p>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Type at least 2 characters to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72] placeholder-[#9ca3af]"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0d8f72] animate-spin" />
          )}
        </div>

        {showDropdown && query.trim().length >= 2 && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-xl shadow-lg max-h-72 overflow-y-auto">
            {searchLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-[#0d8f72] animate-spin" />
                <span className="ml-2 text-sm text-[#6b7280]">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <p className="text-center text-sm text-[#9ca3af] py-6">
                No customers found matching &quot;{query}&quot;
              </p>
            ) : (
              <div className="py-2">
                {searchResults.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelect(customer)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9fafb] transition-colors text-left group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#e6f7f3] flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#0d8f72]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111827]">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-[#6b7280]">{customer.mobile}</span>
                        {customer.account_number && (
                          <>
                            <span className="text-xs text-[#d1d5db]">|</span>
                            <span className="text-xs text-[#6b7280]">A/c: {customer.account_number}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-[#0d8f72] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!showDropdown && query.trim().length < 2 && !searchLoading && (
        <p className="text-center text-sm text-[#9ca3af] py-6">
          Start typing to search for a customer
        </p>
      )}
    </div>
  )
}
