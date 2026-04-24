'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { TrendingUp } from 'lucide-react'

export const RightSidebarSection = () => {
  const router = useRouter()
  const { selectedCustomer, transactions, wizardStep } = useAppSelector((s) => s.passbook)
  const { balance } = useAppSelector((s) => s.wallet)

  const printCharge = 10
  const currentWallet = Number(balance) || 20
  const balanceAfterPrint = currentWallet - printCharge
  const canPrint = currentWallet >= printCharge

  const safeTxns = Array.isArray(transactions) ? transactions : []

  const closingBalance = useMemo(() => {
    const opening = Number(selectedCustomer?.opening_balance || 0)
    const totalDebits = safeTxns.reduce((s, t) => s + Number(t.debit || 0), 0)
    const totalCredits = safeTxns.reduce((s, t) => s + Number(t.credit || 0), 0)
    return opening - totalDebits + totalCredits
  }, [selectedCustomer, safeTxns])

  return (
    <div className="space-y-4">
      {/* Customer Summary */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span>👤</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
            Customer Summary
          </span>
        </div>

        <div className="p-4">
          {!selectedCustomer ? (
            <p className="py-3 text-center text-xs text-slate-400">No customer selected yet</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className='text-lg'>
                   👩
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {selectedCustomer.name}
                  </p>
                  <p className="truncate font-mono text-xs text-slate-400">
                   A/C:{selectedCustomer.account_number}
                  </p>
                </div>

                <span className="flex-shrink-0 rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-xs font-semibold capitalize text-green-700">
                  {selectedCustomer.account_type?.replace('_', ' ') || 'Savings'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  ['Bank', selectedCustomer.bank_name || '—'],
                  ['Branch', selectedCustomer.branch_name || selectedCustomer.branch || '—'],
                  ['IFSC', selectedCustomer.ifsc_code || selectedCustomer.ifsc || '—'],
                  ['Mobile', selectedCustomer.mobile_number || selectedCustomer.mobile || '—'],
                  [
                    'Opening Bal',
                    `₹${Number(selectedCustomer.opening_balance || 0).toFixed(2)}`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <span className="shrink-0 text-slate-400">{label}</span>
                    <span className="min-w-0 max-w-[140px] truncate text-right font-mono font-semibold text-slate-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Cost */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-4 py-3">
          <span>💰</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#111827]">
            Print Cost
          </span>
        </div>

        <div className="space-y-2.5 p-4 text-xs">
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Passbook print</span>
            <span className="font-mono font-bold text-slate-800">₹{printCharge}.00</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#6b7280]">Current wallet</span>
            <span className={`font-mono font-bold ${canPrint ? 'text-slate-800' : 'text-red-600'}`}>
              ₹{currentWallet.toFixed(2)}
            </span>
          </div>

          <div className="h-px bg-[#e5e7eb]" />

          <div className="flex justify-between">
            <span className="text-[#6b7280]">After print</span>
            <span
              className={`font-mono font-bold ${
                balanceAfterPrint >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{balanceAfterPrint.toFixed(2)}
            </span>
          </div>

          {!canPrint && (
            <button
              onClick={() => router.push('/wallet')}
              className="mt-1 w-full rounded-lg border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
            >
              + Recharge Wallet
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-2.5 rounded-xl border border-[#bae6fd] bg-[#eff6ff] p-3.5">
        <div>💡</div>
        <div className="text-xs text-[#111827]">
          <p className="mb-0.5 font-semibold">Free Reprint</p>
          <p className="leading-relaxed text-[#111827]">
            You can reprint this passbook for free within 2 hours of printing.
          </p>
        </div>
      </div>
    </div>
  )
}