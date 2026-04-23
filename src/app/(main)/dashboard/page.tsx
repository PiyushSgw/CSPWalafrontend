'use client'
import { useEffect } from 'react'
import { BarChart2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchDashboardStats } from '../../../redux/slices/dashboardSlice'
import StatCard from '@/components/dashboard/StatCard'
import QuickActions from '@/components/dashboard/QuickActions'
import UsageStats from '@/components/dashboard/UsageStats'
import RecentPrintJobs from '@/components/dashboard/RecentPrintJobs'
import WalletWidget from '@/components/dashboard/WalletWidget'

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const authState = useAppSelector(s => s.auth)
  const user = authState.user || authState.admin
  const isAuthenticated = authState.isAuthenticated || authState.isAdminAuthenticated

  const { stats, loading } = useAppSelector(s => s.dashboard)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router])

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BarChart2 className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Redirecting to Login</h2>
          <p className="text-slate-500 mb-6">Authentication required</p>
        </div>
      </div>
    )
  }

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getDate = () => new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Show admin role if admin logged in
  const isAdmin = !!authState.admin
  const role = isAdmin ? 'Admin' : 'CSP Agent'

  return (
    <>
      {/* Title Row - 100% ORIGINAL */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#111827] tracking-[-0.5px] flex items-center gap-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-[3px]">
            {getDate()} · {role}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => router.push('/print-history')}
            className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-[#d1d5db] rounded-[6px] bg-white text-[12px] font-bold text-[#374151] hover:bg-[#f3f5f8] transition-colors"
          >
            📊 View Reports
          </button>
          <button
            onClick={() => router.push('/passbook')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0d8f72] hover:opacity-90 hover:-translate-y-px rounded-[6px] text-[12px] font-bold text-white transition-all"
          >
            🖨️ New Print Job
          </button>
        </div>
      </div>

      {/* Stat Cards - 100% ORIGINAL */}
      <div className="grid grid-cols-4 gap-3.5 ">
        <div className=" transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
          <StatCard
            label="Wallet Balance"
            value={loading ? '...' : String(stats?.walletBalance ?? 0)}
            prefix="₹"
            sub={loading ? '' : `~${stats?.printsRemaining ?? 0} prints remaining`}
            icon="💰"
            accent="blue"
            subVariant="neutral"
          />
        </div>
        <div className=" transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
          <StatCard
            label="Prints Today"
            value={loading ? '...' : String(stats?.printsToday ?? 0)}
            sub="▲ 3 more than yesterday"
            icon="🖨️"
            accent="green"
            subVariant="positive"
          />
        </div>
        <div className=" transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
          <StatCard
            label="This Month"
            value={loading ? '...' : String(stats?.printsThisMonth ?? 0)}
            sub="▲ 18% vs last month"
            icon="📅"
            accent="yellow"
            subVariant="positive"
          />
        </div>
        <div className=" transition-transform duration-200 ease-out hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
          <StatCard
            label="Total Customers"
            value={loading ? '...' : String(stats?.totalCustomers ?? 0)}
            sub="▲ 5 new this week"
            icon="👥"
            accent="sky"
            subVariant="positive"
          />
        </div>

      </div>

      {/* Middle Row - 100% ORIGINAL */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 mb-4">
        <QuickActions />
        <UsageStats stats={stats} loading={loading} />
      </div>

      {/* Bottom Row - 100% ORIGINAL */}
      <div className="grid grid-cols-2 gap-4">
       <RecentPrintJobs />
<WalletWidget
  balance={stats?.walletBalance ?? 0}
  isLow={(stats?.walletBalance ?? 0) < 50}
  loading={loading}
/>
      </div>
    </>
  )
}