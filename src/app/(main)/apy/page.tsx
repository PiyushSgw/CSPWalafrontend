'use client'
import React, { useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShieldCheck, Loader2, CheckCircle, FileText, Clock } from 'lucide-react'
import { useApy } from '@/hooks/useApy'
import api from '@/utils/axios'
import { CustomerSearchSection } from '@/components/apy/CustomerSearchSection'
import { ApyFormSection } from '@/components/apy/ApyFormSection'
import { ReviewSection } from '@/components/apy/ReviewSection'

const STEP_LABELS = ['Customer', 'Form', 'Review', 'Done']
const STEP_ORDER: ('customer' | 'form' | 'review' | 'done')[] = ['customer', 'form', 'review', 'done']

function ApyPageInner() {
  const apy = useApy()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  useEffect(() => {
    if (editId) {
      apy.setEditId(editId)
      apy.loadRequest(editId)
      apy.goToStep('form')
    }
  }, [editId])

  const handleCustomerContinue = () => {
    apy.goToStep('form')
  }

  const handleFormContinue = () => {
    console.log('[APY] handleFormContinue called, current step=', apy.step)
    apy.goToStep('review')
    console.log('[APY] after goToStep review, step now=', apy.step)
  }

  const handleSubmit = useCallback(async () => {
    const payload: Record<string, any> = {
      customerId: apy.formData.customerId,
      title: apy.formData.title || undefined,
      fullName: apy.formData.fullName,
      dateOfBirth: apy.formData.dateOfBirth || undefined,
      age: apy.formData.age ? Number(apy.formData.age) : undefined,
      mobile: apy.formData.mobile,
      email: apy.formData.email || undefined,
      aadhaar: apy.formData.aadhaar,
      isMarried: apy.formData.isMarried,
      spouseName: apy.formData.spouseName || undefined,
      spouseAadhaar: apy.formData.spouseAadhaar || undefined,
      nomineeName: apy.formData.nomineeName,
      nomineeAadhaar: apy.formData.nomineeAadhaar || undefined,
      nomineeRelation: apy.formData.nomineeRelation,
      nomineeDob: apy.formData.nomineeDob || undefined,
      guardianName: apy.formData.guardianName || undefined,
      hasOtherSocialSchemes: apy.formData.hasOtherSocialSchemes,
      isIncomeTaxPayer: apy.formData.isIncomeTaxPayer,
      isFatcaApplicable: apy.formData.isFatcaApplicable,
      contributionFrequency: apy.formData.contributionFrequency,
      pensionAmount: apy.formData.pensionAmount ? Number(apy.formData.pensionAmount) : undefined,
      contributionAmount: apy.formData.contributionAmount ? Number(apy.formData.contributionAmount) : undefined,
      declarationDate: apy.formData.declarationDate || undefined,
      declarationPlace: apy.formData.declarationPlace || undefined,
    }

    try {
      if (apy.editId) {
        await apy.updateRequest({ id: apy.editId, data: payload })
        toast.success('APY subscription updated successfully!')
      } else {
        await apy.submitRequest(payload)
        toast.success('APY subscription submitted successfully!')
      }
      apy.goToStep('done')
    } catch (err: any) {
      toast.error(err || 'Failed to submit APY subscription')
    }
  }, [apy])

  const handleDownloadPdf = async () => {
    const requestId = apy.submitResult?.id
    if (!requestId) {
      toast.error('No request ID available')
      return
    }
    try {
      await api.post(`/csp/apy/${requestId}/generate-pdf`)
    } catch (_) {
      // ignore — may already be generated
    }
    try {
      const pdfRes = await api.get(`/csp/apy/${requestId}/download`, {
        responseType: 'blob',
      })
      const blob = new Blob([pdfRes.data], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `apy-subscription-${requestId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
      toast.success('PDF downloaded successfully.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to download PDF')
    }
  }

  const currentStepIndex = STEP_ORDER.indexOf(apy.step)

  if (apy.editLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#0d8f72] animate-spin" />
        <span className="ml-3 text-sm text-[#6b7280]">Loading APY subscription...</span>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white rounded-xl border border-[#e5e7eb] p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0d8f72] to-[#0fb896] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">Atal Pension Yojana</h1>
            <p className="text-sm text-[#6b7280]">
              {apy.editId ? 'Edit APY Subscription' : apy.selectedCustomer?.bank_name || 'APY Subscription Form'}
            </p>
          </div>
        </div>
        {apy.step !== 'customer' && (
          <button
            onClick={apy.reset}
            className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            {apy.editId ? 'Cancel' : 'New Request'}
          </button>
        )}
      </div>

      {apy.step !== 'done' && !apy.editId && (
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
          {apy.step === 'customer' && !apy.editId && (
            <CustomerSearchSection
              searchResults={apy.customerSearchResults}
              searchLoading={apy.customerSearchLoading}
              selectedCustomer={apy.selectedCustomer}
              onSearch={apy.searchCust}
              onSelect={apy.pickCustomer}
              onContinue={handleCustomerContinue}
              onClearSearch={apy.clearCustSearch}
            />
          )}

          {apy.step === 'form' && (
            <ApyFormSection
              formData={apy.formData}
              onChange={apy.updateForm}
              onContinue={handleFormContinue}
              onBack={() => apy.editId ? undefined : apy.goToStep('customer')}
            />
          )}

          {apy.step === 'review' && (
            <ReviewSection
              customer={apy.selectedCustomer}
              formData={apy.formData}
              isEdit={!!apy.editId}
              submitting={apy.submitting}
              onSubmit={handleSubmit}
              onBack={() => apy.goToStep('form')}
            />
          )}

          {apy.step === 'done' && apy.submitResult && (
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#e6f7f3] flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0d8f72]" />
              </div>
              <h2 className="text-xl font-bold text-[#111827] mb-2">
                APY Subscription {apy.editId ? 'Updated' : 'Submitted'} Successfully!
              </h2>
              <p className="text-sm text-[#6b7280] mb-4">
                The Atal Pension Yojana subscription has been {apy.editId ? 'updated' : 'submitted'} successfully.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3f4f6] rounded-lg text-sm text-[#374151] mb-6">
                <FileText className="w-4 h-4" />
                Request ID: <span className="font-mono font-medium">{apy.submitResult.id}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="px-6 py-2.5 bg-white text-[#0d8f72] border border-[#0d8f72] text-sm font-semibold rounded-lg hover:bg-[#e6f7f3] transition-colors"
                >
                  <FileText className="w-4 h-4 mr-1.5 inline" />
                  Download PDF
                </button>
                <button
                  onClick={apy.reset}
                  className="px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] transition-colors"
                >
                  {apy.editId ? 'Done' : 'New Request'}
                </button>
              </div>
            </div>
          )}
        </div>

        {apy.step !== 'done' && !apy.editId && (
          <div className="w-full xl:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#6b7280]" />
                <h3 className="text-sm font-semibold text-[#111827]">APY Info</h3>
              </div>
              <div className="text-center py-6">
                <ShieldCheck className="w-10 h-10 text-[#d1d5db] mx-auto mb-3" />
                <p className="text-sm font-medium text-[#374151] mb-1">Atal Pension Yojana</p>
                <p className="text-xs text-[#6b7280] leading-relaxed">
                  A government-backed pension scheme focused on the unorganized sector.
                  <br />Age: 18-40 years
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#0d8f72] animate-spin" />
      </div>
    }>
      <ApyPageInner />
    </Suspense>
  )
}
