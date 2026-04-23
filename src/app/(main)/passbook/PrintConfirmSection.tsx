'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { printPassbook, resetWizard, setWizardStep } from '@/redux/slices/passbookSlice'
import { fetchWalletBalance } from '@/redux/slices/walletSlice'
import {
  ArrowLeft,
  Printer,
  Loader2,
  CheckCircle,
  Download,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export const PrintConfirmSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, transactions, printResult, printLoading, error } =
    useAppSelector((s) => s.passbook)
  const { balance } = useAppSelector((s) => s.wallet)

  const printCharge = 10
  const currentWallet = Number(balance) || 0
  const balanceAfterPrint = currentWallet - printCharge
  const canPrint = currentWallet >= printCharge

  // Handle confirm print
  const handleConfirmPrint = async () => {
    if (!canPrint) {
      toast.error('Insufficient wallet balance')
      return
    }

    if (!selectedCustomer?.id || transactions.length === 0) {
      toast.error('Invalid transaction data')
      return
    }

    const result = await dispatch(
      printPassbook({
        customer_id: selectedCustomer.id,
        transactions: transactions.map((t) => ({
          txn_date: t.txn_date,
          description: t.description,
          debit: t.debit || 0,
          credit: t.credit || 0,
        })),
      })
    )

    if (printPassbook.fulfilled.match(result)) {
      toast.success('Passbook printed successfully!')
      dispatch(fetchWalletBalance())
    } else {
      // toast.error(result.payload || 'Print failed')
    }
  }

  // SUCCESS STATE
  if (printResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        <div>
          <h2
            className="text-xl font-bold text-slate-900 mb-1"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Passbook Printed!
          </h2>
          <p className="text-sm text-slate-500">
            Successfully printed for{' '}
            <span className="font-semibold text-slate-700">
              {selectedCustomer?.name}
            </span>
          </p>
        </div>

        <div className="inline-flex flex-col items-center gap-1 px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
          <span className="text-slate-500">
            Job #{printResult.job_id} · Charged ₹{printResult.charge}
          </span>
          <span className="font-mono font-bold text-slate-700">
            Remaining balance: ₹
            {Number(printResult.wallet_balance_after).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          {printResult.pdf_signed_url && (
            <a
              href={printResult.pdf_signed_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              <Download size={15} />
              Download PDF
            </a>
          )}
          <button
            onClick={() => dispatch(resetWizard())}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <RefreshCw size={14} />
            New Print Job
          </button>
        </div>
      </div>
    )
  }

  // CONFIRM STATE
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Printer size={15} className="text-green-600" />
          <span className="font-semibold text-slate-700 text-sm">
            Ready to Print
          </span>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-5">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto">
            <Printer size={28} className="text-green-600" />
          </div>

          {/* Title */}
          <div>
            <h3
              className="font-bold text-slate-800 text-lg"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Confirm Passbook Print
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Passbook for{' '}
              <span className="font-semibold text-slate-700">
                {selectedCustomer?.name}
              </span>
              {' · '}A/C ending {selectedCustomer?.account_number?.slice(-4)}
              {' · '}
              {transactions.length} transactions
            </p>
          </div>

          {/* Charge breakdown */}
          <div className="inline-block w-full max-w-xs">
            <div className="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100 text-sm text-left">
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-500">Print charge</span>
                <span className="font-bold text-slate-800 font-mono">
                  ₹{printCharge}.00
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-500">Current wallet</span>
                <span className="font-bold font-mono text-slate-800">
                  ₹{currentWallet.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2.5 rounded-b-xl bg-green-50">
                <span className="text-slate-500">After print</span>
                <span
                  className={`font-bold font-mono ${
                    balanceAfterPrint >= 0 ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  ₹{balanceAfterPrint.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Insufficient balance warning */}
          {!canPrint && (
            <div className="flex items-center gap-2 justify-center px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm max-w-xs mx-auto">
              <AlertTriangle size={15} />
              Insufficient balance. Please recharge your wallet.
            </div>
          )}

          {/* API error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm max-w-xs mx-auto">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch(setWizardStep(3))}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <ArrowLeft size={14} />
          Go Back
        </button>
        <button
          onClick={handleConfirmPrint}
          disabled={printLoading || !canPrint}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          {printLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Printer size={14} />
              Confirm &amp; Print (₹{printCharge})
            </>
          )}
        </button>
      </div>
    </div>
  )
}
