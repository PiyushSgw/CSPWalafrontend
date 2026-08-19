'use client'
import React, { useEffect, useState } from 'react'
import { PageHeaderSection } from './PageHeaderSection'
import { WalletTabBarSection } from './WalletTabBarSection'
import { LedgerTabSection } from './LedgerTabSection'
import { RechargeTabSection } from './RechargeTabSection'
import { RequestsTabSection } from './RequestsTabSection'
import { useWallet } from '@/hooks/useWallet'
import { useAppDispatch } from '@/redux/hooks'
import { fetchDashboardStats } from '@/redux/slices/dashboardSlice'
import api from '@/utils/axios'

type TabId = 'wt-ledger' | 'wt-recharge' | 'wt-requests'


export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<TabId>('wt-ledger')
  const wallet = useWallet()
  const dispatch = useAppDispatch()

  const [cfVerifying, setCfVerifying] = useState(false)
  const [cfResult, setCfResult] = useState<{ success: boolean; message: string } | null>(null)

  // Handle Cashfree payment callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cfOrderId = params.get('cf_order_id')
    const orderId = params.get('order_id')

    if (cfOrderId && orderId && !cfVerifying && !cfResult) {
      const verifyCashfreePayment = async () => {
        setCfVerifying(true)
        try {
          const { data } = await api.post('/cashfree/verify', { order_id: orderId })
          if (data.data?.verified) {
            setCfResult({ success: true, message: `Payment successful! Wallet balance: ₹${data.data.balance}` })
            wallet.loadWallet()
            dispatch(fetchDashboardStats())
          } else {
            setCfResult({ success: false, message: 'Payment verification failed.' })
          }
        } catch (err: any) {
          setCfResult({
            success: false,
            message: err.response?.data?.message || 'Payment verification failed.',
          })
        } finally {
          setCfVerifying(false)
          window.history.replaceState({}, '', '/wallet')
        }
      }
      verifyCashfreePayment()
    }
  }, [])

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
      <WalletTabBarSection activeTab={activeTab} onTabChange={setActiveTab} />

      {cfVerifying && (
        <div className="alert-box info" style={{ marginBottom: 20 }}>
          <div className="alert-icon">⏳</div>
          <div className="alert-body">Verifying your payment...</div>
        </div>
      )}

      {cfResult && (
        <div className={`alert-box ${cfResult.success ? 'success' : 'error'}`} style={{ marginBottom: 20 }}>
          <div className="alert-icon">{cfResult.success ? '✅' : '❌'}</div>
          <div className="alert-body">{cfResult.message}</div>
          <button onClick={() => setCfResult(null)} className="btn btn-sm btn-outline" type="button">
            Dismiss
          </button>
        </div>
      )}

      {renderTab()}
    </div>
  )
}
