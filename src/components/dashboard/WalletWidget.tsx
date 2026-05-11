'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { fetchLedger, fetchRechargeRequests } from '@/redux/slices/walletSlice'
import { fetchPrintHistory } from '@/redux/slices/printHistorySlice'

type Transaction = {
  amount: number
  icon: string
  desc: string
  date: string
}

type WalletLedgerResponse = {
  balance?: number
  lastRecharge?: { amount: number; date: string } | null
  transactions?: Transaction[]
}

export default function WalletWidget() {
  const router = useRouter()
  const [data, setData] = useState<WalletLedgerResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const dashboardState = useSelector((state: RootState) => state.dashboard)
  const walletState = useSelector((state: RootState) => state.wallet)
  const printHistoryState = useSelector((state: RootState) => state.printHistory)
  const dashboardWalletBalance = dashboardState.stats?.walletBalance || 0

  useEffect(() => {
    dispatch(fetchLedger({ limit: 5 }) as any)
    dispatch(fetchPrintHistory({ limit: 5 }) as any)
    dispatch(fetchRechargeRequests({ limit: 5 }) as any)
  }, [dispatch])

  const getIcon = (jobType?: string): string => {
    switch (jobType) {
      case 'Passbook': return '🖨️'
      case 'Combo':    return '📋'
      case 'Form':     return '📋'
      default:         return '🖨️'
    }
  }

  const formatDate = (raw: string): string => {
    if (!raw) return ''
    const d = new Date(raw)
    const now = new Date()
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()

    if (isToday) {
      return `Today ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  useEffect(() => {
    const allTransactions: Transaction[] = []

    // Print jobs from printHistoryState ONLY
    if (printHistoryState.mappedList?.length > 0) {
      printHistoryState.mappedList.forEach((job: any) => {
        allTransactions.push({
          amount: -(job.rawCharge || 0),
          icon: getIcon(job.type),
          desc: `${job.type || 'Print'} — ${job.customer || 'Unknown'}`,
          date: formatDate(job.dateTime || job.time || job.created_at),
        })
      })
    }

    // Recharges from walletState.rechargeRequests ONLY
    if (walletState.rechargeRequests?.length > 0) {
      walletState.rechargeRequests.forEach((req: any) => {
        if (req.status === 'approved' || req.status === 'credited_at') {
          allTransactions.push({
            amount: req.amount,
            icon: '💰',
            desc: 'Wallet Recharge',
            date: formatDate(req.credited_at || req.created_at),
          })
        }
      })
    }

    // Sort newest first, keep top 5
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const lastCreditTx = allTransactions.find((tx) => tx.amount > 0)

    setData({
      balance: dashboardWalletBalance,
      lastRecharge: lastCreditTx
        ? {
            amount: lastCreditTx.amount,
            date: lastCreditTx.date,
          }
        : null,
      transactions: allTransactions.slice(0, 5),
    })

    setLoading(walletState.loading || printHistoryState.loading)
  }, [
    walletState.rechargeRequests,
    printHistoryState.mappedList,
    walletState.loading,
    printHistoryState.loading,
    dashboardWalletBalance,
  ])

  const lastRecharge = data?.lastRecharge
  const transactions = data?.transactions || []

  return (
    <div className="flex flex-col gap-4">

      {/* ── Balance Card ── */}
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
          {loading ? '...' : error ? 'Error' : dashboardWalletBalance.toFixed(2)}
        </div>

        <p className="text-[12px] opacity-55 mb-5 relative">
          {error ? error : (lastRecharge
            ? `Last recharged: ₹${lastRecharge.amount} on ${lastRecharge.date}`
            : 'No recharge yet')}
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

      {/* ── Recent Transactions ── */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden">
        <div className="flex items-center px-5 py-4 border-b border-[#e5e7eb]">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#111827]">
            <div className="w-2 h-2 rounded-full bg-[#0d8f72]" />
            Recent Transactions
          </div>
        </div>

        <div className="px-4 py-[14px]">
          {loading ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">Loading...</div>
          ) : error ? (
            <div className="text-center text-[#dc2626] text-[13px] py-4">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">No transactions yet</div>
          ) : (
            transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-[11px] border-b border-[#f3f4f6] last:border-0"
              >
                {/* Icon bubble */}
                <div
                  className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-[16px] flex-shrink-0 ${
                    tx.amount > 0 ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'
                  }`}
                >
                  {tx.icon}
                </div>

                {/* desc + date */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#111827] truncate leading-tight">
                    {tx.desc}
                  </p>
                  <p className="text-[11px] text-[#9ca3af] mt-[2px]">{tx.date}</p>
                </div>

                {/* amount */}
                <span
                  className={`font-mono text-[13px] font-bold flex-shrink-0 ${
                    tx.amount > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'
                  }`}
                >
                  {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}