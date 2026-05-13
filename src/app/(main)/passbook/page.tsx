'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setWizardStep,
  resetPassbookState,
  setSelectedCustomer,
} from '@/redux/slices/passbookSlice'
import { fetchWalletBalance } from '@/redux/slices/walletSlice'
import toast from 'react-hot-toast'

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
  const searchParams = useSearchParams()

  // Load customer from URL params if provided
  useEffect(() => {
    dispatch(resetPassbookState())
    dispatch(fetchWalletBalance())

    const customerId = searchParams.get('customer_id')
    if (customerId) {
      // Load customer data from URL params
      const name = searchParams.get('name') || ''
      const accountNumber = searchParams.get('account_number') || ''
      const accountType = searchParams.get('account_type') || 'savings'
      const bank = searchParams.get('bank') || ''
      const mobile = searchParams.get('mobile') || ''

      const customerData = {
        id: parseInt(customerId),
        name,
        account_number: accountNumber,
        account_type: accountType,
        bank_name: bank,
        mobile,
      }

      dispatch(setSelectedCustomer(customerData))
      toast.success(`Loaded customer: ${name}`)
    }
  }, [dispatch, searchParams])

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