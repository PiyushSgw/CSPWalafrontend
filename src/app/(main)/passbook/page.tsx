'use client'

import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setWizardStep,
  resetPassbookState,
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

  useEffect(() => {
    dispatch(resetPassbookState())
    dispatch(fetchWalletBalance())
  }, [dispatch])

  const handleStepClick = (step: number) => {
    if (step < wizardStep) {
      dispatch(setWizardStep(step))
    }
  }

  return (
    <div className="space-y-5">
      <PageHeaderSection onReset={() => dispatch(resetPassbookState())} />

      <StepIndicatorsSection
        activeStep={wizardStep}
        onStepClick={handleStepClick}
      />

      <div className="flex flex-col xl:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full">
          {wizardStep === 1 && <CustomerDetailsSection />}
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