'use client'

import { useMemo } from 'react'
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  addTransaction,
  removeTransaction,
  updateTransaction,
  setWizardStep,
  previewPassbook,
} from '@/redux/slices/passbookSlice'

interface Transaction {
  txn_date: string
  description: string
  debit: number
  credit: number
  balance?: number
}

export const TransactionTableSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, transactions, loading } = useAppSelector((s) => s.passbook)

  // Calculate running balances
  const rows = useMemo(() => {
    const openingBalance = parseFloat(selectedCustomer?.opening_balance.toString() || "")
    return transactions.map((tx, i) => {
      let runningBal = openingBalance
      for (let j = 0; j <= i; j++) {
        runningBal =
          runningBal - (transactions[j].debit || 0) + (transactions[j].credit || 0)
      }
      return { ...tx, computedBalance: parseFloat(runningBal.toFixed(2)) }
    })
  }, [transactions, selectedCustomer])

  // Update a transaction field
  const updateField = (
    index: number,
    field: keyof Transaction,
    value: string
  ) => {
    const tx = { ...transactions[index] }
    if (field === 'debit' || field === 'credit') {
      (tx as any)[field] = parseFloat(value) || 0
    } else {
      (tx as any)[field] = value
    }
    dispatch(updateTransaction({ index, data: tx }))
  }

  // Check if we can proceed
  const canProceed =
    transactions.length > 0 &&
    transactions.every((t) => t.txn_date && t.description)

  // Handle next button (preview)
  const handleNext = () => {
    if (!selectedCustomer?.id || transactions.length === 0) return

    dispatch(
      previewPassbook({
        customer_id: selectedCustomer.id,
        transactions: transactions.map((t) => ({
          txn_date: t.txn_date,
          description: t.description,
          debit: t.debit || 0,
          credit: t.credit || 0,
        })),
      })
    )
  }

  const handlePrev = () => {
    dispatch(setWizardStep(1))
  }

  const handleAddRow = () => {
    dispatch(
      addTransaction({
        txn_date: new Date().toISOString().split('T')[0],
        description: '',
        debit: 0,
        credit: 0,
      })
    )
  }

  const handleRemoveRow = (index: number) => {
    dispatch(removeTransaction(index))
  }

  const openingBalance = parseFloat(selectedCustomer?.opening_balance.toString() || "")
  const closingBalance =
    rows.length > 0
      ? rows[rows.length - 1].computedBalance
      : openingBalance

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <span className="font-semibold text-slate-700 text-sm">
              Transaction Entries
            </span>
            {selectedCustomer && (
              <span className="text-xs text-slate-400 ml-2">
                · {selectedCustomer.name} · Opening: ₹
                {Number(selectedCustomer.opening_balance).toFixed(2)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Plus size={12} />
            Add Row
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-36">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">
                  Debit (₹)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">
                  Credit (₹)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                  Balance (₹)
                </th>
                <th className="px-4 py-3 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    No transactions yet — click <strong>Add Row</strong> to start
                  </td>
                </tr>
              ) : (
                rows.map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {/* Date */}
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={tx.txn_date}
                        onChange={(e) =>
                          updateField(i, 'txn_date', e.target.value)
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                    </td>

                    {/* Description */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={tx.description}
                        onChange={(e) =>
                          updateField(i, 'description', e.target.value)
                        }
                        placeholder="e.g. ATM Withdrawal"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                    </td>

                    {/* Debit */}
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tx.debit || ''}
                        onChange={(e) =>
                          updateField(i, 'debit', e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-right font-mono text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all"
                      />
                    </td>

                    {/* Credit */}
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tx.credit || ''}
                        onChange={(e) =>
                          updateField(i, 'credit', e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs text-right font-mono text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                      />
                    </td>

                    {/* Balance */}
                    <td className="px-3 py-2">
                      <div className="w-full px-2 py-1.5 rounded-lg bg-slate-50 text-xs text-right font-mono font-bold text-slate-700">
                        ₹{tx.computedBalance.toFixed(2)}
                      </div>
                    </td>

                    {/* Delete Button */}
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(i)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              {rows.length} transaction{rows.length !== 1 ? 's' : ''} · Opening: ₹
              {openingBalance.toFixed(2)}
            </span>
            <span className="font-bold text-slate-700 font-mono">
              Closing Balance: ₹{closingBalance.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed || loading}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          Preview Passbook
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
