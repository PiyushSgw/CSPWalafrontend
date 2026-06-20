'use client'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CreditCard, Loader2, CheckCircle, FileText, Clock, Banknote } from 'lucide-react'
import { useDebitCard } from '@/hooks/useDebitCard'
import api from '@/utils/axios'
import { CustomerSearchSection } from '@/components/debit-card/CustomerSearchSection'
import { DebitCardFormSection } from '@/components/debit-card/DebitCardFormSection'
import { ReviewSection } from '@/components/debit-card/ReviewSection'

const STEP_LABELS = ['Customer', 'Form', 'Review', 'Done']
const STEP_ORDER: ('customer' | 'form' | 'review' | 'done')[] = ['customer', 'form', 'review', 'done']

export default function DebitCardFormPage() {
  const dc = useDebitCard()
  const [processing, setProcessing] = useState(false)
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  useEffect(() => {
    dc.loadRequests()
  }, [])

  const handleDownloadPdf = async () => {
    const requestId = dc.submitResult?.id
    if (!requestId) {
      toast.error('No request ID available')
      return
    }
    try {
      const pdfRes = await api.get(`/csp/debit-card-requests/${requestId}/download`, {
        responseType: 'blob',
      })
      const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `debit-card-${requestId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
      toast.success('PDF downloaded successfully.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to download PDF')
    }
  }

  const handleCustomerContinue = () => {
    dc.goToStep('form')
  }

  const handleFormContinue = () => {
    dc.goToStep('review')
  }

  const handleSubmit = async () => {
    if (!dc.selectedCustomer) {
      toast.error('Missing customer information')
      return
    }
    setProcessing(true)
    try {
      const result = await dc.submitRequest({
        bankId: dc.selectedCustomer.bank_id || 0,
        customerId: dc.selectedCustomer.id,
        requestData: dc.formData,
      })
      const requestId = result?.id
      if (!requestId) {
        toast.success('Debit card request submitted successfully!')
        dc.loadRequests()
        dc.goToStep('done')
        return
      }
      const downloadUrl = result?.downloadUrl || null
      setPdfDownloadUrl(downloadUrl)
      setPdfGenerated(!!result?.pdfGenerated)
      if (result?.pdfGenerated && requestId) {
        try {
          const pdfRes = await api.get(`/csp/debit-card-requests/${requestId}/download`, {
            responseType: 'blob',
          })
          const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = `debit-card-${requestId}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(blobUrl)
        } catch (dlErr) {
          console.warn('Auto-download failed, showing manual link', dlErr)
        }
        toast.success('Debit Card PDF generated successfully.')
      } else if (result?.pdfGenerated === false) {
        toast.error('Request saved but PDF generation failed: ' + (result?.pdfError || 'unknown error'))
      } else {
        toast.success('Debit card request submitted successfully!')
      }
      dc.loadRequests()
      dc.goToStep('done')
    } catch (err: any) {
      toast.error(err || 'Failed to submit request')
    } finally {
      setProcessing(false)
    }
  }

  const currentStepIndex = STEP_ORDER.indexOf(dc.step)

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d8f72] to-[#0fb896] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">Debit Card Form</h1>
            <p className="text-sm text-[#6b7280]">
              {dc.selectedCustomer?.bank_name || 'Debit Card Application'}
            </p>
          </div>
        </div>
        {dc.step !== 'customer' && (
          <button
            onClick={dc.reset}
            className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            New Request
          </button>
        )}
      </div>

      {dc.step !== 'done' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
          <div className="flex items-center justify-between">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i <= currentStepIndex
                      ? 'bg-[#0d8f72] text-white'
                      : 'bg-[#f3f4f6] text-[#9ca3af]'
                  }`}
                >
                  {i < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    i <= currentStepIndex ? 'text-[#111827]' : 'text-[#9ca3af]'
                  }`}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 hidden sm:block ${
                    i < currentStepIndex ? 'bg-[#0d8f72]' : 'bg-[#e5e7eb]'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full space-y-5">
          {dc.step === 'customer' && (
            <CustomerSearchSection
              searchResults={dc.customerSearchResults}
              searchLoading={dc.customerSearchLoading}
              selectedCustomer={dc.selectedCustomer}
              onSearch={dc.searchCust}
              onSelect={dc.pickCustomer}
              onContinue={handleCustomerContinue}
              onClearSearch={dc.clearCustSearch}
            />
          )}

          {dc.step === 'form' && (
            <DebitCardFormSection
              formData={dc.formData}
              onChange={dc.updateForm}
              onContinue={handleFormContinue}
              onBack={() => dc.goToStep('customer')}
            />
          )}

          {dc.step === 'review' && dc.selectedCustomer && (
            <ReviewSection
              customer={dc.selectedCustomer}
              formData={dc.formData}
              submitting={processing}
              onSubmit={handleSubmit}
              onBack={() => dc.goToStep('form')}
            />
          )}

          {dc.step === 'done' && dc.submitResult && (
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#e6f7f3] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0d8f72]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">Debit Card PDF Generated Successfully!</h2>
              <p className="text-sm text-[#6b7280] mb-4">
                Your debit card request has been submitted and the PDF has been generated.
                {pdfGenerated && ' The PDF has been downloaded automatically.'}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] rounded-lg text-sm text-[#374151] mb-6">
                <FileText className="w-4 h-4" />
                Request ID: <span className="font-mono font-medium">{dc.submitResult.id}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                {pdfDownloadUrl && (
                  <button
                    onClick={handleDownloadPdf}
                    className="px-6 py-2.5 bg-[#1d4ed8] text-white text-sm font-semibold rounded-lg hover:bg-[#1e40af] transition-colors"
                  >
                    Download PDF
                  </button>
                )}
                <button
                  onClick={dc.reset}
                  className="px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
                >
                  New Request
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[380px] flex-shrink-0">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-[#6b7280]" />
              <h3 className="text-sm font-semibold text-[#111827]">Request History</h3>
            </div>

            {dc.requestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-[#0d8f72] animate-spin" />
              </div>
            ) : dc.requests.length === 0 ? (
              <div className="text-center py-8">
                <Banknote className="w-8 h-8 text-[#d1d5db] mx-auto mb-2" />
                <p className="text-sm text-[#9ca3af]">No requests yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {dc.requests.map((req: any) => {
                  const data = req.request_data || {}
                  return (
                    <div
                      key={req.id}
                      className="p-3 bg-[#f9fafb] rounded-lg border border-[#f3f4f6] text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#374151]">
                          {data.cardRequestType || 'Debit Card'}
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#dbeafe] text-[#1d4ed8] text-[9px] font-bold rounded-full">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6b7280]">
                        {req.customer_name} &middot; {data.nameOnCard || 'N/A'}
                      </p>
                      <p className="text-[10px] text-[#9ca3af] mt-0.5">
                        {formatDate(req.submitted_at)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
