'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchAdminDashboard, fetchPendingCount } from '@/redux/slices/adminSlice'
import { Users, CheckSquare, Building2, Wallet, FileText, TrendingUp, UserCheck } from 'lucide-react'

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch()
  const { dashboard, loading } = useAppSelector(s => s.admin)
  const admin = useAppSelector(s => s.auth.admin)

  useEffect(() => {
    dispatch(fetchAdminDashboard())
    dispatch(fetchPendingCount())
  }, [dispatch])

  const stats = [
    { label: 'Total CSPs', value: dashboard?.total_csp || 0, icon: Users, color: 'bg-blue-50 text-blue-600', accent: 'border-blue-200' },
    { label: 'Active CSPs', value: dashboard?.active_csp || 0, icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600', accent: 'border-emerald-200' },
    { label: 'Pending Approvals', value: dashboard?.pending_csp || 0, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', accent: 'border-amber-200' },
    { label: 'Total Customers', value: dashboard?.total_customers || 0, icon: UserCheck, color: 'bg-violet-50 text-violet-600', accent: 'border-violet-200' },
    { label: 'Wallet Balance', value: `₹${dashboard?.total_wallet_balance || 0}`, icon: Wallet, color: 'bg-sky-50 text-sky-600', accent: 'border-sky-200' },
    { label: 'Pending Recharges', value: dashboard?.pending_recharge || 0, icon: Building2, color: 'bg-rose-50 text-rose-600', accent: 'border-rose-200' },
    { label: 'Prints (30d)', value: dashboard?.prints_last_30d?.count || 0, icon: FileText, color: 'bg-orange-50 text-orange-600', accent: 'border-orange-200' },
  ]

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#111827] tracking-[-0.5px]">
            Admin Dashboard 👋
          </h1>
          <p className="text-[13px] text-[#6b7280] mt-[3px]">
            Welcome back, {admin?.name || 'Admin'} · {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-xl border ${s.accent} p-4 transition-transform duration-200 hover:scale-[1.02] hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon size={16} />
              </div>
            </div>
            <p className="text-[24px] font-bold text-slate-800 leading-none">{loading ? '...' : s.value}</p>
          </div>
        ))}
      </div>

      {dashboard?.prints_last_30d && (
        <div className="mt-5 bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[15px] font-bold text-slate-800 mb-3">Print Revenue (Last 30 days)</h3>
          <div className="flex items-center gap-4">
            <div className="text-[28px] font-bold text-emerald-600">₹{dashboard.prints_last_30d.revenue || 0}</div>
            <div className="text-[13px] text-slate-500">{dashboard.prints_last_30d.count || 0} prints × ₹10</div>
          </div>
        </div>
      )}
    </>
  )
}
