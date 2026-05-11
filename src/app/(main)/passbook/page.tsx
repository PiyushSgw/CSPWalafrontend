'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setWizardStep,
  resetPassbookState,
  fetchCustomer,
  setSelectedCustomer,
} from '@/redux/slices/passbookSlice'
import { fetchWalletBalance } from '@/redux/slices/walletSlice'

import { PageHeaderSection } from './PageHeaderSection'
import { StepIndicatorsSection } from './StepIndicatorsSection'
import { CustomerDetailsSection } from './CustomerDetailsSection'
import { TransactionTableSection } from './TransactionTableSection'
import { PassbookPreviewSection } from './PassbookPreviewSection'
import { PrintConfirmSection } from './PrintConfirmSection'
import { RightSidebarSection } from './RightSidebarSection'

export default function PassbookPage() {
  const dispatch = useAppDispatch()
  const { wizardStep, selectedCustomer } = useAppSelector((s) => s.passbook)
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  const [loadExistingTrigger, setLoadExistingTrigger] = useState(0)

  useEffect(() => {
    dispatch(resetPassbookState())
    dispatch(fetchWalletBalance())

    // If customerId is provided, fetch and select the customer
    if (customerId) {
      const customerIdNum = parseInt(customerId)
      if (!isNaN(customerIdNum)) {
        dispatch(fetchCustomer(customerIdNum))
        dispatch(setWizardStep(2)) // Skip to transaction table step
        dispatch(setSelectedCustomer({ id: customerIdNum } as any))
      }
    }
  }, [dispatch, customerId])

  const handleStepClick = (step: number) => {
    if (step < wizardStep) {
      dispatch(setWizardStep(step))
    }
  }

  const handleLoadExistingCustomer = () => {
    dispatch(setWizardStep(1))
    setLoadExistingTrigger((prev) => prev + 1)
  }
  return (
    <div className="space-y-5">
      <PageHeaderSection 
        onReset={() => dispatch(resetPassbookState())}
        onLoadExistingCustomer={handleLoadExistingCustomer}
      />

      <StepIndicatorsSection
        activeStep={wizardStep}
        onStepClick={handleStepClick}
      />

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full">
          {wizardStep === 1 && (
            <CustomerDetailsSection loadExistingTrigger={loadExistingTrigger} />
          )}
          {wizardStep === 2 && <TransactionTableSection />}
          {wizardStep === 3 && <PassbookPreviewSection />}
          {wizardStep === 4 && <PrintConfirmSection />}
        </div>

        {wizardStep !== 5 && (
          <div className="w-full xl:w-[450px] flex-shrink-0">
            <RightSidebarSection />
          </div>
        )}
      </div>
    </div>
  )
}