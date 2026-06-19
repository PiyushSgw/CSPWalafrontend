'use client'
import React, { useEffect, useState } from 'react'
import { Building2, Search } from 'lucide-react'

interface Bank {
  id: number
  name: string
  short_code: string
  logo_url?: string
}

interface Props {
  banks: Bank[]
  loading: boolean
  selectedBankId: number | null
  onSelect: (bankId: number) => void
  onLoadBanks: () => void
}

export function BankSelectionSection({ banks, loading, selectedBankId, onSelect, onLoadBanks }: Props) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (banks.length === 0) onLoadBanks()
  }, [])

  const filtered = banks.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.short_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
      <h2 className="text-lg font-semibold text-[#111827] mb-4">Select Bank</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
        <input
          type="text"
          placeholder="Search banks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(13,143,114,0.12)] focus:border-[#0d8f72] placeholder-[#9ca3af]"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-[#f3f4f6] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onSelect(bank.id)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all ${
                selectedBankId === bank.id
                  ? 'border-[#0d8f72] bg-[#e6f7f3] ring-2 ring-[#b2e4d8]'
                  : 'border-[#e5e7eb] hover:border-[#0d8f72] hover:bg-[#f9fafb]'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedBankId === bank.id ? 'bg-[#0d8f72] text-white' : 'bg-[#e6f7f3] text-[#0d8f72]'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-[#374151] text-center leading-tight">
                {bank.name}
              </span>
              <span className="text-xs text-[#9ca3af] font-mono">{bank.short_code}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-[#9ca3af] py-8">
              No banks found matching your search.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
