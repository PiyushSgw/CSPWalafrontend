'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { TrendingUp } from 'lucide-react'

export const RightSidebarSection = () => {
  const router = useRouter()
  const { selectedCustomer, transactions, wizardStep } = useAppSelector(
    (s) => s.passbook
  )
  const { balance } = useAppSelector((s) => s.wallet)

  const printCharge = 10
  const currentWallet = Number(balance) || 0
  const balanceAfterPrint = currentWallet - printCharge
  const canPrint = currentWallet >= printCharge

  // Calculate closing balance
  const closingBalance = useMemo(() => {
    const openingBalance = parseFloat(selectedCustomer?.opening_balance.toString() || "")
    const totalDebits = transactions.reduce((sum, tx) => sum + (tx.debit || 0), 0)
    const totalCredits = transactions.reduce((sum, tx) => sum + (tx.credit || 0), 0)
    return openingBalance - totalDebits + totalCredits
  }, [selectedCustomer, transactions])

  return (
    <div className="space-y-4">
      {/* Customer Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <span>👤</span>
          <span className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
            Customer Summary
          </span>
        </div>

        <div className="p-4">
          {!selectedCustomer ? (
            <p className="text-xs text-slate-400 text-center py-3">
              No customer selected yet
            </p>
          ) : (
            <div className="space-y-3">
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                  {selectedCustomer.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {selectedCustomer.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono truncate">
                    {selectedCustomer.account_number}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 font-semibold capitalize flex-shrink-0">
                  {selectedCustomer.account_type?.replace('_', ' ')}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs">
                {[
                  ['Bank', selectedCustomer.bank_name],
                  ['Branch', selectedCustomer.branch_name || '—'],
                  ['IFSC', selectedCustomer.ifsc],
                  ['Mobile', selectedCustomer.mobile || '—'],
                  [
                    'Opening Bal',
                    `₹${Number(selectedCustomer.opening_balance).toFixed(2)}`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-semibold text-slate-700 font-mono text-right max-w-[140px] truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions summary — show on step 2+ */}
      {wizardStep >= 2 && transactions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <TrendingUp size={14} className="text-blue-600" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Transaction Summary
            </span>
          </div>
          <div className="p-4 space-y-2 text-xs">
            {[
              ['Total rows', transactions.length],
              [
                'Total debits',
                `₹${transactions
                  .reduce((s, t) => s + (t.debit || 0), 0)
                  .toFixed(2)}`,
              ],
              [
                'Total credits',
                `₹${transactions
                  .reduce((s, t) => s + (t.credit || 0), 0)
                  .toFixed(2)}`,
              ],
              ['Closing balance', `₹${closingBalance.toFixed(2)}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-400">{label}</span>
                <span className="font-semibold text-slate-700 font-mono">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Cost */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e7eb]">
          <span>💰</span>
          <span className="text-xs font-semibold text-[#111827] uppercase tracking-wider">
            Print Cost
          </span>
        </div>
        <div className="p-4 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Passbook print</span>
            <span className="font-bold text-slate-800 font-mono">
              ₹{printCharge}.00
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Current wallet</span>
            <span
              className={`font-bold font-mono ${
                canPrint ? 'text-slate-800' : 'text-red-600'
              }`}
            >
              ₹{currentWallet.toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-[#e5e7eb]" />
          <div className="flex justify-between">
            <span className="text-[#6b7280]">After print</span>
            <span
              className={`font-bold font-mono ${
                balanceAfterPrint >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₹{balanceAfterPrint.toFixed(2)}
            </span>
          </div>

          {!canPrint && (
            <button
              onClick={() => router.push('/wallet')}
              className="w-full mt-1 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              + Recharge Wallet
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex gap-2.5 p-3.5 rounded-xl bg-[#eff6ff] border border-[#bae6fd]">
        <div>💡</div>
        <div className="text-xs text-[#111827]">
          <p className="font-semibold mb-0.5">Free Reprint</p>
          <p className="text-[#111827] leading-relaxed">
            You can reprint this passbook for free within 2 hours of printing.
          </p>
        </div>
      </div>
    </div>
  )
}
