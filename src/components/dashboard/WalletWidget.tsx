'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type WalletLedgerResponse = {
  balance?: number
  lastRecharge?: {
    amount: number
    date: string
  } | null
  transactions?: {
    amount: number
    icon?: string
    name: string
    time: string
  }[]
}

export default function WalletWidget() {
  const router = useRouter()
  const [data, setData] = useState<WalletLedgerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const dashboardState = useSelector((state: RootState) => state.dashboard);
  const dashboardWalletBalance = dashboardState.stats?.walletBalance || 0;
  useEffect(() => {
    // Get wallet balance instead of ledger for the widget
    api
      .get('/csp/wallet/balance')
      .then(res => {
        // Transform balance API response to match expected structure
        setData({
          balance: res.data.balance,
          lastRecharge: null, // Can be enhanced later
          transactions: [] // Can be enhanced later
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const balance = data?.balance || 0
  const lastRecharge = data?.lastRecharge
  const transactions = data?.transactions || []

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-[14px] p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2744, #1e4b8c)' }}
      >
        <div className="absolute right-[-10px] top-[-20px] text-[160px] font-black text-white/[0.03] font-mono pointer-events-none leading-none select-none">
          ₹
        </div>

        <p className="text-[11px] uppercase tracking-[1.5px] opacity-50 mb-2 relative">
          Available Wallet Balance
        </p>

        <div className="font-mono text-[40px] font-medium leading-none mb-1.5 relative">
          <span className="text-[22px] opacity-60 mr-1">₹</span>
          {loading ? '...' : dashboardWalletBalance.toFixed(2)}
        </div>

        <p className="text-[12px] opacity-55 mb-5 relative">
          {lastRecharge
            ? `Last recharged: ₹${lastRecharge.amount} on ${lastRecharge.date}`
            : 'No recharge yet'}
        </p>

        <div className="flex gap-[10px] relative">
          <button
            onClick={() => router.push('/wallet')}
            className="flex-1 py-[10px] rounded-[9px] bg-[#0d8f72] text-white text-[12px] font-bold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            + Recharge Now
          </button>

          <button
            onClick={() => router.push('/wallet')}
            className="flex-1 py-[10px] rounded-[9px] bg-white/10 text-white/80 text-[12px] font-bold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            View Ledger
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#111827]">
            <div className="w-2 h-2 rounded-full bg-[#0d8f72]" />
            Recent Transactions
          </div>
        </div>

        <div className="px-4 py-[14px]">
          {loading ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">No transactions yet</div>
          ) : (
            <div>
              {transactions.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 border-b border-[#e5e7eb] last:border-0"
                >
                  <div
                    className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-[15px] flex-shrink-0 ${
                      tx.amount > 0 ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'
                    }`}
                  >
                    {tx.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827] truncate leading-tight">
                      {tx.name}
                    </p>
                    <p className="text-[11px] text-[#6b7280] mt-0.5">{tx.time}</p>
                  </div>

                  <span
                    className={`font-mono text-[14px] font-medium flex-shrink-0 ${
                      tx.amount > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}