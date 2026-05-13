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

// Wallet integration enabled
const BYPASS_WALLET_FOR_TESTING = false
// Debug mode for testing
const DEBUG_MODE = true

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

    // Check wallet balance before printing
    if (!BYPASS_WALLET_FOR_TESTING && walletBalance < printCost) {
      toast.error(`Insufficient wallet balance. Required: ₹${printCost}, Available: ₹${walletBalance}`)
      return
    }

    // Check network connectivity
    if (!navigator.onLine) {
      toast.error('No internet connection. Please check your network and try again.')
      return
    }

    // Check authentication
    const token = localStorage.getItem('csp_access_token')
    if (!token) {
      toast.error('Authentication required. Please log in again.')
      return
    }

    const payload = {
      customer_id: selectedCustomer.id,
      account_number: accountNumber,
      print_cost: printCost,
      transactions: txns.map((t, i) => ({
        sr_no: i + 1,
        txn_date: t.txn_date,
        description: t.description,
        debit: Number(t.debit || 0),
        credit: Number(t.credit || 0),
        balance: Number(t.balance || 0),
      })),
    }

    console.log('Sending print request with payload:', payload)
    
    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    })

    const result = await Promise.race([
      dispatch(printPassbook(payload)),
      timeoutPromise
    ]) as any

    console.log('Print request result:', result)

    if (printPassbook.fulfilled.match(result)) {
      const data = result.payload as any
      console.log('Print success data:', data)

      // Show detailed success message with charge info
      const charge = data?.data?.charge || data?.charge || 0
      const balanceAfter = data?.data?.wallet_balance_after || data?.wallet_balance_after || 0

      if (charge > 0) {
        toast.success(`Passbook printed successfully! ₹${charge} deducted from wallet. New balance: ₹${balanceAfter}`)
      } else {
        toast.success('Passbook printed successfully!')
      }

      // Get PDF URL with comprehensive fallbacks
      const rawPdfUrl =
        data?.data?.pdf_signed_url ||
        data?.data?.pdf_url ||
        data?.data?.file_url ||
        data?.pdf_signed_url ||
        data?.pdf_url ||
        data?.file_url ||
        data?.data?.download_url ||
        data?.download_url ||
        ''

      console.log('PDF URL found:', rawPdfUrl)

      // Check if URL is a mock/placeholder that won't work
      if (rawPdfUrl && (
        rawPdfUrl.includes('/mock-s3/') ||
        rawPdfUrl.includes('mock') ||
        rawPdfUrl.includes('placeholder') ||
        rawPdfUrl.includes('example')
      )) {
        console.warn('Detected mock/placeholder PDF URL, generating fallback PDF')
        
        // Generate a simple PDF fallback using browser print
        try {
          const printContent = document.getElementById('passbook-preview-content')
          if (printContent) {
            const printWindow = window.open('', '_blank')
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Passbook - ${selectedCustomer?.name || 'Customer'}</title>
                    <style>
                      body { font-family: 'Courier New', monospace; margin: 20px; }
                      table { width: 100%; border-collapse: collapse; }
                      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                      th { background-color: #f2f2f2; }
                      .header { text-align: center; margin-bottom: 20px; }
                    </style>
                  </head>
                  <body>
                    ${printContent.innerHTML}
                  </body>
                </html>
              `)
              printWindow.document.close()
              printWindow.print()
              toast.success('Passbook sent to printer')
            } else {
              toast.error('Popup blocked. Please allow popups for this site.')
            }
          } else {
            toast.error('Could not generate PDF fallback')
          }
        } catch (error) {
          console.error('PDF fallback failed:', error)
          toast.error('Failed to generate PDF. Please try again.')
        }
        return
      }

      if (rawPdfUrl) {
        try {
          // Create a proper URL object to validate
          const pdfUrl = new URL(rawPdfUrl, window.location.origin)
          
          // Add timestamp to prevent caching issues
          const timestampedUrl = `${pdfUrl.toString()}${pdfUrl.toString().includes('?') ? '&' : '?'}_t=${Date.now()}`
          
          console.log('Opening PDF URL:', timestampedUrl)
          
          // Try to open in new tab with proper error handling
          const newWindow = window.open(timestampedUrl, '_blank', 'noopener,noreferrer')
          
          // Fallback if popup is blocked
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            console.log('Popup blocked, trying direct download')
            const link = document.createElement('a')
            link.href = timestampedUrl
            link.download = `passbook_${selectedCustomer?.name || 'unknown'}_${Date.now()}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            toast.success('PDF download started')
          } else {
            toast.success('PDF opened in new tab')
          }
        } catch (error) {
          console.error('URL handling failed:', error)
          // Last resort - try raw URL
          window.open(rawPdfUrl, '_blank')
          toast.error('PDF opened with limited functionality')
        }
      } else {
        console.error('No PDF URL found in response. Full response:', JSON.stringify(data, null, 2))
        toast.error('PDF download link not available. Please check console for details.')
      }
    } else {
      console.error('Print request failed:', result.payload)
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

          {DEBUG_MODE && (
            <div className="w-full rounded-[8px] border border-blue-200 bg-blue-50 px-4 py-3 text-[11px] text-blue-700">
              <div className="font-bold mb-2">Debug Info:</div>
              <div>Customer ID: {selectedCustomer?.id}</div>
              <div>Transactions: {txns.length}</div>
              <div>Print Cost: ₹{printCost}</div>
              <div>Wallet Balance: ₹{walletBalance}</div>
              <div>API Base URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}</div>
              <div>Auth Token: {localStorage.getItem('csp_access_token') ? 'Present' : 'Missing'}</div>
              <button
                type="button"
                onClick={() => {
                  console.log('Debug - Current State:', {
                    selectedCustomer,
                    transactions: txns,
                    printCost,
                    walletBalance,
                    printResult,
                    printError
                  })
                  toast.success('Debug info logged to console')
                }}
                className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
              >
                Log Debug Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}