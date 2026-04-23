'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setWizardStep,
  resetWizard,
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

  const { wizardStep } = useAppSelector((s) => s.passbook)

  // Reset wizard and load wallet on mount
  useEffect(() => {
    dispatch(resetWizard())
    dispatch(fetchWalletBalance())
  }, [dispatch])

  const handleStepClick = (step: number) => {
    // Only allow going back to completed steps
    if (step < wizardStep) {
      dispatch(setWizardStep(step))
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <PageHeaderSection onReset={() => dispatch(resetWizard())} />

      {/* Step Indicators */}
      <StepIndicatorsSection
        activeStep={wizardStep}
        onStepClick={handleStepClick}
      />

      {/* Main content */}
      <div className="flex gap-5 items-start">
        {/* Left: Step content */}
        <div className="flex-1 min-w-0">
          {wizardStep === 1 && <CustomerDetailsSection />}

          {wizardStep === 2 && <TransactionTableSection />}

          {wizardStep === 3 && <PassbookPreviewSection />}

          {wizardStep === 4 && <PrintConfirmSection />}
        </div>

        {/* Right Sidebar — hidden on step 4 */}
        {wizardStep !== 4 && (
          <div className="w-[500px] flex-shrink-0">
            <RightSidebarSection />
          </div>
        )}
      </div>
    </div>
  )
}
