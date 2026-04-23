'use client'

import React, { useMemo, useState } from 'react'
import { CustomerRow } from './CustomerRow'
import { ApiMeta, MappedCustomer } from './customer'

interface Props {
  customers: MappedCustomer[]
  meta?: ApiMeta
  loading?: boolean
}

export const CustomerListSection: React.FC<Props> = ({ customers, meta, loading }) => {
  const [search, setSearch] = useState('')

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase()

    if (!q) return customers

    return customers.filter((cust) => {
      const name = cust.name?.toLowerCase() || ''
      const account =
        cust.accountShort?.toLowerCase() ||
        // cust.account_number?.toLowerCase() ||
        ''
      const mobile = cust.mobile?.toLowerCase() || ''

      return (
        name.includes(q) ||
        account.includes(q) ||
        mobile.includes(q)
      )
    })
  }, [customers, search])

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#e5e7eb] bg-[#fafafa]">
        <div className="text-[14px] font-bold text-[#111827]">All Customers</div>

        <div className="relative w-full max-w-[280px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[14px]">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, account no., mobile..."
            className="w-full h-[40px] rounded-[10px] border border-[#d1d5db] bg-white pl-10 pr-3 text-[13px] text-[#111827] placeholder:text-[#9ca3af] outline-none transition-all focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f3f4f6] border-b border-[#e5e7eb]">
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Account No.
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Bank
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Last Print
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-bold uppercase tracking-[0.04em] text-[#6b7280]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#6b7280]">
                  Loading customers...
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust, i) => (
                <CustomerRow key={cust.id || i} customer={cust} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#6b7280]">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e7eb] text-[12px] text-[#6b7280]">
        <span>
          Showing {filteredCustomers.length} of {meta?.total || customers.length} customers
        </span>

        <div className="flex items-center gap-2">
          <button className="text-[12px] font-semibold text-[#6b7280] px-2 py-1 rounded">
            ← Prev
          </button>

          <span className="min-w-[26px] h-[26px] inline-flex items-center justify-center rounded-[7px] bg-[#1e3a5f] text-white text-[11px] font-bold">
            1
          </span>

          <button className="text-[12px] font-semibold text-[#6b7280] px-2 py-1 rounded">
            2
          </button>

          <button className="text-[12px] font-semibold text-[#6b7280] px-2 py-1 rounded">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}