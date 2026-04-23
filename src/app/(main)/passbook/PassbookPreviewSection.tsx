'use client'

import { useEffect, useMemo } from 'react'
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  BookOpen,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  printPassbook,
  setWizardStep,
  generatePassbookPreview,
} from '@/redux/slices/passbookSlice'

const TEST_SKIP_PRINT_VALIDATION = true

const money = (n: number) =>
  Number(n || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const formatTxnDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yy = String(d.getFullYear()).slice(-2)
  return `${dd}/${mm}/${yy}`
}

const formatPrintedDate = () => {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const maskAccount = (acc?: string) => {
  if (!acc) return '—'
  const last4 = acc.slice(-4)
  return `XXXX XXXX ${last4}`
}

export const PassbookPreviewSection = () => {
  const dispatch = useAppDispatch()
  const { selectedCustomer, transactions, preview, previewLoading, printing, printError } =
    useAppSelector((s) => s.passbook)
  const { balance } = useAppSelector((s) => s.wallet)

  const printCharge = preview?.print_charge || 10
  const walletBalance = Number(balance) || 0
  const canPrint = walletBalance >= printCharge
  const txns = Array.isArray(transactions) ? transactions : []

  const validTransactions = useMemo(
    () =>
      txns
        .filter((t) => t.txn_date && t.description && (Number(t.debit) > 0 || Number(t.credit) > 0))
        .map((t, i) => ({
          sr_no: i + 1,
          txn_date: t.txn_date,
          description: t.description,
          debit: Number(t.debit || 0),
          credit: Number(t.credit || 0),
          balance: Number(t.balance || 0),
        })),
    [txns]
  )

  useEffect(() => {
    if (!preview?.html && selectedCustomer?.id && validTransactions.length > 0) {
      dispatch(
        generatePassbookPreview({
          customer_id: selectedCustomer.id,
          account_number: selectedCustomer.account_number,
          transactions: validTransactions,
        })
      )
    }
  }, [dispatch, preview?.html, selectedCustomer?.id, selectedCustomer?.account_number, validTransactions])

  const handleConfirmPrint = async () => {
    if (!selectedCustomer?.id) {
      toast.error('Customer not selected')
      return
    }

    if (validTransactions.length === 0) {
      toast.error('No valid transactions found')
      return
    }

    if (TEST_SKIP_PRINT_VALIDATION) {
      toast.success('Test mode: moved to next step')
      dispatch(setWizardStep(4))
      return
    }

    if (!canPrint) {
      toast.error(`Insufficient balance. Need ₹${printCharge} to print.`)
      return
    }

    const result = await dispatch(
      printPassbook({
        customer_id: selectedCustomer.id,
        account_number: selectedCustomer.account_number,
        transactions: validTransactions,
      })
    )

    if (printPassbook.fulfilled.match(result)) {
      toast.success('Passbook printed successfully!')
      dispatch(setWizardStep(4))
    } else {
      toast.error((result.payload as string) || 'Failed to print passbook')
    }
  }

  const branch =
    selectedCustomer?.branch_name ||
    selectedCustomer?.branch ||
    '—'

  const ifsc =
    selectedCustomer?.ifsc_code ||
    selectedCustomer?.ifsc ||
    '—'

  const mobile =
    selectedCustomer?.mobile_number ||
    selectedCustomer?.mobile ||
    '—'

  const bankName = (selectedCustomer?.bank_name || 'STATE BANK OF INDIA').toUpperCase()
  const accountType = (selectedCustomer?.account_type || 'SAVINGS').replaceAll('_', ' ').toUpperCase()

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-white ">
        {previewLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 size={20} className="animate-spin text-[#0d8f72]" />
            <span className="text-[13px]">Generating passbook...</span>
          </div>
        ) : !selectedCustomer ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <BookOpen size={22} className="text-slate-400" />
            </div>
            <p className="text-[13px] font-medium">No customer selected</p>
          </div>
        ) : validTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <BookOpen size={22} className="text-slate-400" />
            </div>
            <p className="text-[13px] font-medium">No passbook data available</p>
            <button
              type="button"
              onClick={() => dispatch(setWizardStep(2))}
              className="mt-2 text-[12px] font-semibold text-[#0d8f72] underline"
            >
              Go back and check transactions
            </button>
          </div>
        ) : (
          <div className="bg-[#f7f7f7] p-4 sm:p-5">
            <div
              className="mx-auto w-full max-w-[760px] rounded-[8px] border border-[#c9ccd3] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              style={{ fontFamily: '"Courier New", monospace' }}
            >
              <div className="rounded-t-[8px] bg-[#12325b] px-4 py-3 text-center text-[13px] font-bold tracking-wide text-white">
                {bankName} — {accountType} ACCOUNT PASSBOOK
              </div>

              <div className="px-4 py-4">
                <div className="grid grid-cols-[96px_1fr_70px_1fr] gap-y-2 text-[12px] text-[#4b5563]">
                  <div>Account No</div>
                  <div className="font-bold text-[#111827]">{maskAccount(selectedCustomer.account_number)}</div>
                  <div>IFSC</div>
                  <div className="font-bold text-[#111827] text-right">{ifsc}</div>

                  <div>Name</div>
                  <div className="font-bold uppercase text-[#111827]">
                    {selectedCustomer.name || '—'}
                  </div>
                  <div>Branch</div>
                  <div className="font-bold uppercase text-right text-[#111827]">
                    {branch}
                  </div>

                  <div>Type</div>
                  <div className="font-bold uppercase text-[#111827]">{accountType}</div>
                  <div>CSP</div>
                  <div className="font-bold text-right uppercase text-[#111827]">
                    {selectedCustomer?.csp_code || 'CSP-UP-0421'}
                  </div>

                  <div>Mobile</div>
                  <div className="font-bold text-[#111827]">{mobile}</div>
                  <div></div>
                  <div></div>
                </div>

                <div className="my-4 h-px bg-[#d7dbe2]" />

                <div className="overflow-hidden">
                  <table className="w-full border-collapse text-[12px] text-[#111827]">
                    <thead>
                      <tr className="bg-[#f1f3f6] text-[11px] uppercase tracking-wide text-[#374151]">
                        <th className="px-2 py-2 text-left font-bold">Date</th>
                        <th className="px-2 py-2 text-left font-bold">Description</th>
                        <th className="px-2 py-2 text-right font-bold">Debit</th>
                        <th className="px-2 py-2 text-right font-bold">Credit</th>
                        <th className="px-2 py-2 text-right font-bold">Balance</th>
                      </tr>
                    </thead>

                    <tbody>
                      {validTransactions.map((txn, index) => (
                        <tr key={index} className="border-b border-[#e5e7eb] last:border-b-0">
                          <td className="px-2 py-2 whitespace-nowrap">
                            {formatTxnDate(txn.txn_date)}
                          </td>
                          <td className="px-2 py-2">
                            <div className="max-w-[280px] truncate">{txn.description}</div>
                          </td>
                          <td className="px-2 py-2 text-right whitespace-nowrap">
                            {txn.debit > 0 ? money(txn.debit) : '—'}
                          </td>
                          <td className="px-2 py-2 text-right whitespace-nowrap">
                            {txn.credit > 0 ? money(txn.credit) : '—'}
                          </td>
                          <td className="px-2 py-2 text-right whitespace-nowrap">
                            {money(txn.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 border-t border-[#d7dbe2] pt-3 text-[11px] text-[#6b7280]">
                  Printed: {formatPrintedDate()} · CSP: Rampur Banking Point · Platform: CSPWala.in
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!canPrint && (
        <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-amber-200 bg-amber-50 p-4">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <div className="text-[12px]">
            <p className="font-semibold text-amber-800">Insufficient Wallet Balance</p>
            <p className="mt-0.5 text-amber-700">
              You need ₹{printCharge} to print. Current balance: ₹{walletBalance.toFixed(2)}.
              Please recharge your wallet.
            </p>
          </div>
        </div>
      )}

      {printError && (
        <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-red-200 bg-red-50 p-4">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <p className="text-[12px] text-red-700">{printError}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch(setWizardStep(2))}
          className="inline-flex items-center gap-2 rounded-[9px] border border-[#d1d5db] bg-white px-4 py-[9px] text-[13px] font-semibold text-[#374151] transition-colors hover:bg-[#f9fafb]"
        >
          <ArrowLeft size={14} />
          Edit Transactions
        </button>

        <button
          type="button"
          onClick={handleConfirmPrint}
          disabled={
            printing ||
            previewLoading ||
            validTransactions.length === 0 ||
            (!TEST_SKIP_PRINT_VALIDATION && !canPrint)
          }
          className="inline-flex items-center gap-2 rounded-[9px] bg-[#0d8f72] px-5 py-[9px] text-[13px] font-bold text-white transition-colors hover:bg-[#0b7a62] disabled:opacity-50"
        >
          {printing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Printing...
            </>
          ) : (
            <>
              Confirm &amp; Print
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}