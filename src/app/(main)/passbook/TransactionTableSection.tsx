'use client'

import { useEffect, useState } from 'react'
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ClipboardList,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setWizardStep,
  fetchCustomerTransactions,
  generatePassbookPreview,
  clearTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from '@/redux/slices/passbookSlice'
import toast from 'react-hot-toast'

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export const TransactionTableSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, transactions, previewLoading, error, loading } = useAppSelector(
    (s) => s.passbook
  )

  const txns = Array.isArray(transactions) ? transactions : []

  useEffect(() => {
    if (selectedCustomer?.id) {
      dispatch(fetchCustomerTransactions(selectedCustomer.id))
    } else {
      dispatch(clearTransactions())
    }
  }, [dispatch, selectedCustomer?.id])

  const handleAddRow = () => {
    if (!selectedCustomer?.id) {
      toast.error('Please select a customer first')
      return
    }

    // Create a new empty transaction with today's date
    const today = new Date().toISOString().slice(0, 10)
    const lastBalance = txns.length > 0 ? txns[txns.length - 1].balance : 0
    
    const newTransaction = {
      customer_id: selectedCustomer.id,
      txn_date: today,
      description: '',
      debit: 0,
      credit: 0,
      balance: lastBalance,
    }

    dispatch(addTransaction(newTransaction))
    toast.success('New transaction row added')
  }

  const handleDeleteRow = (index: number) => {
    dispatch(deleteTransaction(index))
    toast.success('Transaction row deleted')
  }

  const handleFieldUpdate = (index: number, field: string, value: string | number) => {
    dispatch(updateTransaction({ 
      index, 
      data: { [field]: value }
    }))
  }

  const handlePreview = async () => {
    if (!selectedCustomer?.id) {
      toast.error('Please select a customer first')
      return
    }

    if (txns.length === 0) {
      toast.error('No transactions found for this customer')
      return
    }

    const payload = {
      customer_id: selectedCustomer.id,
      account_number: selectedCustomer.account_number,
      transactions: txns.map((t, i) => ({
        sr_no: i + 1,
        txn_date: t.txn_date,
        description: t.description,
        debit: Number(t.debit || 0),
        credit: Number(t.credit || 0),
        balance: Number(t.balance || 0),
      })),
    }

    const result = await dispatch(generatePassbookPreview(payload))

    if (generatePassbookPreview.fulfilled.match(result)) {
      dispatch(setWizardStep(3))
    } else {
      toast.error((result.payload as string) || 'Preview generation failed')
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#0d8f72]" />
          <p className="text-[13px] text-slate-500">Fetching transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[15px] leading-none">📊</span>
          <span className="text-[14px] font-semibold text-slate-900">
            Transaction Entries
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddRow}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          + Add Row
        </button>
      </div>

      {selectedCustomer && (
        <div className="flex items-center gap-2 border-b border-slate-200 bg-[#f9fafb] px-5 py-3">
          <span className="text-[13px]">👤</span>
          <div>
            <span className="text-[13px] font-semibold text-slate-900">
              {selectedCustomer.name}
            </span>
            <span className="ml-2 font-mono text-[12px] text-slate-500">
              · {selectedCustomer.account_number}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-5 mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">
          <AlertCircle size={14} className="mt-[1px] flex-shrink-0" />
          {error}
        </div>
      )}

      {txns.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <ClipboardList size={22} className="text-slate-400" />
          </div>
          <p className="mb-1 text-sm font-semibold text-slate-700">No transactions found</p>
          <p className="max-w-xs text-xs text-slate-400">
            {selectedCustomer?.id
              ? `No transactions available for ${selectedCustomer.name}`
              : 'Select a customer to load their transactions'}
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full min-w-[640px] border-collapse">
            <colgroup>
              <col style={{ width: '23%' }} />
              <col style={{ width: '27%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '2%' }} />
            </colgroup>

            <thead>
              <tr className="border-b border-slate-200 bg-[#f3f4f6]">
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Date
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Description
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Debit (₹)
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Credit (₹)
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Balance (₹)
                </th>
                <th className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {txns.map((txn, i) => (
                <tr key={txn.id ?? i} className="bg-white transition-colors hover:bg-slate-50">
                  <td className="px-3 py-3 align-middle">
                    <div className="relative">
                      <input
                        type="date"
                        value={txn.txn_date}
                        onChange={(e) => handleFieldUpdate(i, 'txn_date', e.target.value)}
                        className="h-[36px] w-full rounded-[9px] border border-slate-300 bg-white pl-3 pr-8 text-[11px] text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-500 pointer-events-none">
                        📅
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <input
                      type="text"
                      value={txn.description}
                      onChange={(e) => handleFieldUpdate(i, 'description', e.target.value)}
                      placeholder="Enter description"
                      className="h-[36px] w-full rounded-[9px] border border-slate-300 bg-white px-3 text-[11px] text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <input
                      type="number"
                      value={txn.debit}
                      onChange={(e) => handleFieldUpdate(i, 'debit', Number(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="h-[36px] w-full rounded-[9px] border border-slate-300 bg-white px-3 text-[11px] text-slate-700 text-right shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <input
                      type="number"
                      value={txn.credit}
                      onChange={(e) => handleFieldUpdate(i, 'credit', Number(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="h-[36px] w-full rounded-[9px] border border-slate-300 bg-white px-3 text-[11px] text-slate-700 text-right shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <input
                      type="number"
                      value={txn.balance}
                      onChange={(e) => handleFieldUpdate(i, 'balance', Number(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      className="h-[36px] w-full rounded-[9px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-700 text-right shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:border-blue-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </td>

                  <td className="px-2 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(i)}
                      className="mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[18px] leading-none text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete row"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
        <button
          type="button"
          onClick={() => dispatch(setWizardStep(1))}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <button
          type="button"
          onClick={handlePreview}
          disabled={previewLoading || txns.length === 0 || !selectedCustomer}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0d8f72] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#0b7a62] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {previewLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Preview Passbook
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}