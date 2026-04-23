'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MappedCustomer } from './customer'

interface Props {
  customer: MappedCustomer
}

const getTypeStyles = (type: string) => {
  const value = type?.toLowerCase()

  if (value.includes('saving')) {
    return {
      bg: '#eaf7ee',
      color: '#16a34a',
    }
  }

  if (value.includes('current')) {
    return {
      bg: '#e8f1fb',
      color: '#0284c7',
    }
  }

  if (value.includes('jan dhan')) {
    return {
      bg: '#eaf7ee',
      color: '#16a34a',
    }
  }

  return {
    bg: '#f3f4f6',
    color: '#374151',
  }
}

export const CustomerRow: React.FC<Props> = ({ customer }) => {
  const router = useRouter()
  const typeStyle = getTypeStyles(customer.type || '')

  const handlePrintPB = () => {
    router.push(`/passbook?customerId=${customer.id}`)
  }

  const handleEdit = () => {
    console.log('Edit customer:', customer)
  }

  return (
    <tr className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#fcfcfd] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div>
            <div className="text-[13px] font-semibold text-[#111827] leading-[1.2]">
              {customer.name}
            </div>
            <div className="text-[11px] text-[#6b7280] mt-0.5">
              📞 {customer.mobile}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-[12px] text-[#374151] whitespace-nowrap">
        {customer.accountShort}
      </td>

      <td className="px-4 py-3 text-[12px] text-[#374151] whitespace-nowrap">
        {customer.bank}
      </td>

      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] font-semibold whitespace-nowrap"
          style={{ background: typeStyle.bg, color: typeStyle.color }}
        >
          {customer.type}
        </span>
      </td>

      <td className="px-4 py-3 text-[12px] text-[#6b7280] whitespace-nowrap">
        {customer.lastPrint}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
          <button
            type="button"
            onClick={handlePrintPB}
            className="h-[30px] px-3 rounded-[7px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[11px] font-bold transition-colors inline-flex items-center justify-center leading-none whitespace-nowrap"
          >
            Print PB
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="h-[30px] px-3 rounded-[7px] border border-[#d1d5db] bg-white hover:bg-[#f9fafb] text-[#374151] text-[11px] font-semibold transition-colors inline-flex items-center justify-center leading-none whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  )
}