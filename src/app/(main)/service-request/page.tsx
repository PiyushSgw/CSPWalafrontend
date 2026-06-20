'use client'
import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Send, ArrowLeft } from 'lucide-react'
import { useServiceRequest } from '@/hooks/useServiceRequest'
import { validateFormConfig } from './DynamicFormSection'
import { PageHeaderSection } from './PageHeaderSection'
import { StepIndicatorSection } from './StepIndicatorSection'
import { BankSelectionSection } from './BankSelectionSection'
import { ServiceSelectionSection } from './ServiceSelectionSection'
import { CustomerSearchSection } from './CustomerSearchSection'
import { DynamicFormSection } from './DynamicFormSection'
import { CommonFormSection } from './CommonFormSection'
import { DoneSection } from './DoneSection'
import { RequestHistorySection } from './RequestHistorySection'

const DOWNLOAD_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

export default function ServiceRequestPage() {
  const sr = useServiceRequest()

  const [commonData, setCommonData] = useState<Record<string, any>>({})
  const [serviceData, setServiceData] = useState<Record<string, Record<string, any>>>({})
  const [commonErrors, setCommonErrors] = useState<Record<string, string>>({})
  const [serviceErrors, setServiceErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    sr.loadRequests()
  }, [])

  useEffect(() => {
    if (sr.step === 'bank' || sr.step === 'service' || sr.step === 'customer') {
      setCommonData({})
      setServiceData({})
      setCommonErrors({})
      setServiceErrors({})
    }
  }, [sr.step])

  useEffect(() => {
    if (sr.selectedCustomer) {
      const map: Record<string, any> = {}
      if (sr.selectedCustomer.id) {
        map.customerId = String(sr.selectedCustomer.id)
      }
      if (sr.selectedCustomer.name) {
        map.fullName = sr.selectedCustomer.name
        const nameParts = sr.selectedCustomer.name.trim().split(/\s+/)
        map.firstName = nameParts[0] || ''
        if (nameParts.length > 2) {
          map.middleName = nameParts.slice(1, -1).join(' ')
          map.lastName = nameParts[nameParts.length - 1]
        } else if (nameParts.length === 2) {
          map.lastName = nameParts[1]
        }
      }
      if (sr.selectedCustomer.account_number) map.accountNumber = sr.selectedCustomer.account_number
      if (sr.selectedCustomer.mobile) map.mobile = sr.selectedCustomer.mobile
      if (sr.selectedCustomer.email) map.email = sr.selectedCustomer.email
      if (sr.selectedCustomer.address) map.address = sr.selectedCustomer.address
      if (sr.selectedCustomer.pin_code) map.pinCode = sr.selectedCustomer.pin_code
      if (sr.selectedCustomer.aadhar_number) map.aadhaarNumber = sr.selectedCustomer.aadhar_number

      setCommonData((prev) => {
        const updated = { ...prev }
        for (const [k, v] of Object.entries(map)) {
          if (updated[k] === undefined || updated[k] === '' || updated[k] === null) {
            updated[k] = v
          }
        }
        return updated
      })

      setServiceData((prev) => {
        const updated: Record<string, Record<string, any>> = {}
        for (const bsid of Object.keys(prev)) {
          updated[bsid] = { ...prev[bsid] }
        }
        for (const bsid of Object.keys(updated)) {
          for (const [k, v] of Object.entries(map)) {
            if (updated[bsid][k] === undefined || updated[bsid][k] === '' || updated[bsid][k] === null) {
              updated[bsid][k] = v
            }
          }
        }
        return updated
      })
    }
  }, [sr.selectedCustomer])

  const handleBankSelect = (bankId: number) => {
    sr.pickBank(bankId)
    sr.loadServices(bankId)
    sr.goToStep('service')
  }

  const handleContinueToCustomer = () => {
    if (sr.selectedServices.length === 0) return
    sr.goToStep('customer')
  }

  const handleContinueToForms = () => {
    if (!sr.selectedCustomer) return
    if (sr.selectedBankId) {
      sr.loadCommonForm(sr.selectedBankId)
    }
    sr.selectedServices.forEach((svc) => {
      sr.loadForm(svc.bankServiceId)
    })
    sr.goToStep('form')
  }

  const handleCustomerSelect = (customer: any) => {
    sr.pickCustomer(customer)
  }

  const handleCommonChange = (name: string, value: any) => {
    setCommonData((prev) => ({ ...prev, [name]: value }))
    setCommonErrors((prev) => { const c = { ...prev }; delete c[name]; return c })
  }

  const handleServiceChange = (bankServiceId: number, name: string, value: any) => {
    setServiceData((prev) => ({
      ...prev,
      [bankServiceId]: { ...(prev[bankServiceId] || {}), [name]: value },
    }))
    setServiceErrors((prev) => {
      const c = { ...prev }
      if (c[bankServiceId]) {
        delete c[bankServiceId][name]
        if (Object.keys(c[bankServiceId]).length === 0) delete c[bankServiceId]
      }
      return c
    })
  }

  const buildPayload = useCallback(() => {
    const selectedServiceCodes = sr.selectedServices.map((s) => s.code)

    const payload: Record<string, any> = {
      ...commonData,
      selectedServices: selectedServiceCodes,
    }

    for (const svc of sr.selectedServices) {
      const svcData = serviceData[svc.bankServiceId] || {}
      const camelCase = svc.code
        .toLowerCase()
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
      payload[camelCase] = { ...svcData }
    }

    return payload
  }, [commonData, serviceData, sr.selectedServices])

  const handleSubmitAll = async () => {
    let hasError = false

    const newCommonErrors = sr.commonFormConfig
      ? validateFormConfig(sr.commonFormConfig, commonData)
      : {}
    setCommonErrors(newCommonErrors)
    if (Object.keys(newCommonErrors).length > 0) hasError = true

    const newServiceErrors: Record<string, Record<string, string>> = {}
    sr.selectedServices.forEach((svc) => {
      const cfg = sr.serviceFormConfigs[String(svc.bankServiceId)]
      if (cfg) {
        const errs = validateFormConfig(cfg, serviceData[svc.bankServiceId] || {})
        if (Object.keys(errs).length > 0) {
          newServiceErrors[svc.bankServiceId] = errs
          hasError = true
        }
      }
    })
    setServiceErrors(newServiceErrors)

    if (hasError) {
      toast.error('Please fix the highlighted errors before submitting')
      return
    }

    const requestData = buildPayload()

    try {
      await sr.submitRequest({
        bankId: sr.selectedBankId!,
        customerId: sr.selectedCustomer?.id,
        requestData,
      })
      toast.success('Service request submitted successfully!')
    } catch {
      toast.error('Failed to submit service request')
    }

    sr.loadRequests()
    sr.goToStep('done')
  }

  const handleGeneratePDF = async (requestId: string) => {
    try {
      await sr.generatePdf(requestId)
      toast.success('PDF generated!')
    } catch (err: any) {
      toast.error(err || 'Failed to generate PDF')
    }
  }

  const handleDownloadPDF = (requestId: string) => {
    const token = localStorage.getItem('csp_access_token')
    const url = `${DOWNLOAD_BASE}/csp/service-requests/${requestId}/download`
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `service-request-${requestId}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(blobUrl)
      })
      .catch(() => window.open(url, '_blank'))
  }

  const handleHistoryGenerate = async (requestId: string) => {
    try {
      await sr.generatePdf(requestId)
      toast.success('PDF generated!')
    } catch (err: any) {
      toast.error(err || 'Failed to generate PDF')
    }
  }

  const handleHistoryDownload = async (requestId: string) => {
    const token = localStorage.getItem('csp_access_token')
    const url = `${DOWNLOAD_BASE}/csp/service-requests/${requestId}/download`
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `service-request-${requestId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(url, '_blank')
    }
  }

  const selectedBank = sr.banks.find((b: any) => b.id === sr.selectedBankId)

  const allFormsLoaded = sr.selectedServices.every(
    (svc) => sr.serviceFormConfigs[String(svc.bankServiceId)]
  )

  const handleStepClick = (stepId: number) => {
    const stepMap: Record<number, string> = { 1: 'bank', 2: 'service', 3: 'customer', 4: 'form' }
    const targetStep = stepMap[stepId]
    if (targetStep) sr.goToStep(targetStep as any)
  }

  return (
    <div className="space-y-5">
      <PageHeaderSection onReset={sr.reset} />

      <StepIndicatorSection activeStep={sr.step} onStepClick={handleStepClick} />

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full space-y-5">
          {sr.step === 'bank' && (
            <BankSelectionSection
              banks={sr.banks}
              loading={sr.loading}
              selectedBankId={sr.selectedBankId}
              onSelect={handleBankSelect}
              onLoadBanks={sr.loadBanks}
            />
          )}

          {sr.step === 'service' && (
            <ServiceSelectionSection
              services={sr.services}
              loading={sr.loading}
              bankName={selectedBank?.name || ''}
              selectedServices={sr.selectedServices}
              onToggle={sr.toggleSvc}
              onContinue={handleContinueToCustomer}
              onBack={() => sr.goToStep('bank')}
            />
          )}

          {sr.step === 'customer' && (
            <CustomerSearchSection
              searchResults={sr.customerSearchResults}
              searchLoading={sr.customerSearchLoading}
              selectedCustomer={sr.selectedCustomer}
              onSearch={sr.searchCust}
              onSelect={handleCustomerSelect}
              onContinue={handleContinueToForms}
              onBack={() => sr.goToStep('service')}
              onClearSearch={sr.clearCustSearch}
            />
          )}

          {sr.step === 'form' && (
            <>
              {sr.commonFormConfig && (
                <CommonFormSection
                  formConfig={sr.commonFormConfig}
                  formData={commonData}
                  onChange={handleCommonChange}
                  errors={commonErrors}
                />
              )}

              {sr.selectedServices.map((svc) => {
                const cfg = sr.serviceFormConfigs[String(svc.bankServiceId)]
                if (!cfg) {
                  return (
                    <div key={svc.bankServiceId} className="bg-white rounded-xl border border-[#e5e7eb] p-6">
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 text-[#0d8f72] animate-spin" />
                        <span className="ml-2 text-sm text-[#6b7280]">Loading {svc.name} form...</span>
                      </div>
                    </div>
                  )
                }
                  return (
                    <div key={svc.bankServiceId} className="bg-white rounded-xl border border-[#e5e7eb] p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f7f3] flex items-center justify-center">
                          <span className="text-sm font-bold text-[#0d8f72]">
                            {svc.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[#111827]">SECTION {sr.selectedServices.indexOf(svc) + 1}: {cfg.title}</h2>
                          {cfg.description && (
                            <p className="text-sm text-[#6b7280]">{cfg.description}</p>
                          )}
                        </div>
                      </div>
                    <DynamicFormSection
                      formConfig={cfg}
                      formData={serviceData[svc.bankServiceId] || {}}
                      onChange={(name, value) => handleServiceChange(svc.bankServiceId, name, value)}
                      errors={serviceErrors[svc.bankServiceId] || {}}
                    />
                  </div>
                )
              })}

              <div className="flex items-center justify-between bg-white rounded-xl border border-[#e5e7eb] p-4">
                <button
                  onClick={() => sr.goToStep('customer')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Customer
                </button>
                <button
                  onClick={handleSubmitAll}
                  disabled={sr.submitting || !allFormsLoaded}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0d8f72] text-white text-sm font-semibold rounded-lg hover:bg-[#0b7a62] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sr.submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {sr.step === 'done' && (
            <DoneSection
              request={sr.currentRequests[0] || null}
              selectedServices={sr.selectedServices}
              bankName={selectedBank?.name || ''}
              pdfGenerating={sr.pdfGenerating}
              onGeneratePDF={handleGeneratePDF}
              onDownloadPDF={handleDownloadPDF}
              onNewRequest={sr.reset}
            />
          )}
        </div>

        <div className="w-full xl:w-[400px] flex-shrink-0">
          <RequestHistorySection
            requests={sr.requests}
            loading={sr.loading}
            onDownload={handleHistoryDownload}
            onGenerate={handleHistoryGenerate}
            pdfGenerating={sr.pdfGenerating}
          />
        </div>
      </div>
    </div>
  )
}
