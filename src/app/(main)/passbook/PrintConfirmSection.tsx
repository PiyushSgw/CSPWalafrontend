'use client'

import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { printPassbook, setWizardStep } from '@/redux/slices/passbookSlice'
import { fetchDashboardStats } from '@/redux/slices/dashboardSlice'

const fmt = (n: number | string) =>
  `₹${Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const maskAccount = (value?: string) => {
  if (!value) return '—'
  const last4 = String(value).slice(-4)
  return `XXXX${last4}`
}

// TODO: TESTING ONLY – remove after wallet integration
const BYPASS_WALLET_FOR_TESTING = false

export const PrintConfirmSection = () => {
  const dispatch = useAppDispatch()

  const {
    selectedCustomer,
    transactions,
    printing,
    printResult,
    printError,
    preview,
  } = useAppSelector((s) => s.passbook)

  const dashboardState = useAppSelector((s) => s.dashboard)
  const walletBalance = Number(dashboardState.stats?.walletBalance || 0)

  const txns = Array.isArray(transactions) ? transactions : []
  const printCost = Number(preview?.print_charge || 10)
  const afterPrint = walletBalance - printCost

  const isDisabled =
    printing || !selectedCustomer?.id || txns.length === 0

  const customerName = selectedCustomer?.name || 'Customer'
  const accountNumber = selectedCustomer?.account_number || ''
  const bankName = selectedCustomer?.bank_name || 'SBI'

  // Fetch dashboard data if not available to get wallet balance
  useEffect(() => {
    if (!dashboardState.stats || !dashboardState.stats.walletBalance) {
      dispatch(fetchDashboardStats())
    }
  }, [dispatch, dashboardState.stats])

  const handleFinalPrint = async () => {
    if (!selectedCustomer?.id) {
      toast.error('Customer not selected')
      return
    }

    if (!txns.length) {
      toast.error('No transactions available')
      return
    }

    // TODO: enable this again after wallet integration
    if (!BYPASS_WALLET_FOR_TESTING && walletBalance < printCost) {
      toast.error('Insufficient wallet balance')
      return
    }

    const payload = {
      customer_id: selectedCustomer.id,
      account_number: accountNumber,
      // TODO: change back to printCost after wallet integration
      print_cost: BYPASS_WALLET_FOR_TESTING ? 0 : printCost,
      transactions: txns.map((t, i) => ({
        sr_no: i + 1,
        txn_date: t.txn_date,
        description: t.description,
        debit: Number(t.debit || 0),
        credit: Number(t.credit || 0),
        balance: Number(t.balance || 0),
      })),
    }

    const result = await dispatch(printPassbook(payload))

    if (printPassbook.fulfilled.match(result)) {
      const data = result.payload as any

      // Show detailed success message with charge info
      const charge = data?.data?.charge || data?.charge || 0
      const balanceAfter = data?.data?.wallet_balance_after || data?.wallet_balance_after || 0

      if (charge > 0) {
        toast.success(`Passbook printed successfully! ₹${charge} deducted from wallet. New balance: ₹${balanceAfter}`)
      } else {
        toast.success('Passbook printed successfully!')
      }

      // Get PDF URL with fallbacks
      const rawPdfUrl =
        data?.data?.pdf_signed_url ||
        data?.data?.pdf_url ||
        data?.data?.file_url ||
        data?.pdf_signed_url ||
        data?.pdf_url ||
        data?.file_url ||
        ''

      if (rawPdfUrl) {
        try {
          const parsed = new URL(rawPdfUrl)
          parsed.pathname = decodeURIComponent(parsed.pathname)
          window.open(parsed.toString(), '_blank')
        } catch {
          window.open(rawPdfUrl, '_blank')
        }
      } else {
        toast.error('PDF download link not available')
      }
    } else {
      toast.error((result.payload as string) || 'Print failed')
    }
  }

  if (!selectedCustomer) {
    return (
      <div className="rounded-[10px] border border-red-200 bg-red-50 p-4 text-[13px] text-red-600">
        Customer not selected. Please go back and select a customer.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 justify-center">
      <div className="bg-white border border-[#e5e7eb] rounded-[14px] shadow-sm overflow-hidden max-w-[720px] w-full mx-auto">
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="flex items-center justify-center pt-1">
            <div className="text-[52px] leading-none">🖨️</div>
          </div>

          <div className="space-y-1">
            <h2 className="text-[18px] md:text-[20px] font-bold text-[#111827] leading-tight">
              Ready to Print Passbook
            </h2>

            <p className="text-[13px] text-[#6b7280] leading-[1.5]">
              Passbook for{' '}
              <span className="font-medium text-[#4b5563]">{customerName}</span>
              {' · '}
              {bankName} A/C {maskAccount(accountNumber)}
              {' · '}
              {txns.length} transactions
            </p>
          </div>

          <div className="flex flex-col items-center gap-1 pt-1">
            <span className="text-[38px] md:text-[40px] font-bold text-[#111827] leading-none">
              {fmt(printCost)}
            </span>
            <span className="text-[13px] text-[#6b7280]">
              Wallet balance: {fmt(walletBalance)} →{' '}
              {fmt(Math.max(0, afterPrint))} after print
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => dispatch(setWizardStep(3))}
              className="inline-flex items-center gap-2 px-4 py-[9px] border border-[#d1d5db] rounded-[9px] bg-white text-[#374151] text-[13px] font-semibold hover:bg-[#f9fafb] transition-colors"
            >
              <ArrowLeft size={14} />
              Go Back
            </button>

            <button
              type="button"
              onClick={handleFinalPrint}
              disabled={isDisabled}
              className="inline-flex items-center gap-2 px-6 py-[9px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[13px] font-bold rounded-[9px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {printing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Printing...
                </>
              ) : (
                <>
                  <CheckCircle size={14} />
                  Confirm &amp; Print PDF
                </>
              )}
            </button>
          </div>

          {printError && (
            <div className="w-full rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-600">
              {printError}
            </div>
          )}

          {printResult && !printError && (
            <div className="w-full rounded-[8px] border border-green-200 bg-green-50 px-4 py-3 text-[12px] text-green-700 flex items-center gap-2">
              <CheckCircle size={13} className="flex-shrink-0" />
              Print request completed successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}