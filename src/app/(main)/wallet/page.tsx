'use client'
import React, { useEffect, useState } from 'react'
import { PageHeaderSection } from './PageHeaderSection'
import { WalletTabBarSection } from './WalletTabBarSection'
import { LedgerTabSection } from './LedgerTabSection'
import { RechargeTabSection } from './RechargeTabSection'
import { RequestsTabSection } from './RequestsTabSection'
import { useWallet } from '@/hooks/useWallet'

type TabId = 'wt-ledger' | 'wt-recharge' | 'wt-requests'


export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<TabId>('wt-ledger')
  const wallet = useWallet()

  // Load data on mount
  useEffect(() => {
    wallet.loadWallet()
  }, [])

  const handleRequestRecharge = () => {
    setActiveTab('wt-recharge')
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'wt-ledger':
        return (
          <LedgerTabSection
            balance={wallet.balance}
            transactions={wallet.ledger}
            loading={wallet.loading}
            onRequestRecharge={handleRequestRecharge}
          />
        )
      case 'wt-recharge':
        return (
          <RechargeTabSection
            paymentDetails={wallet.paymentDetails}
            loading={wallet.loading || wallet.rechargeLoading}
            error={wallet.error}
            onClose={wallet.resetPaymentDetails}
            onSubmit={wallet.submitRecharge}
            onClearError={wallet.clearWalletError}
          />
        )
      case 'wt-requests':       
        return (
          <RequestsTabSection
            requests={wallet.rechargeRequests}
            loading={wallet.loading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="page active" id="page-wallet">
      <PageHeaderSection />
      <WalletTabBarSection onTabChange={setActiveTab} />
      {renderTab()}
    </div>
  )
}