'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { FileText, Search, Filter, Download, Eye, Calendar, TrendingUp } from 'lucide-react'

export default function PrintJobsPage() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [dateRange, setDateRange] = useState('')

  useEffect(() => {
    // TODO: Implement fetchPrintJobs in adminSlice
  }, [dispatch])

  const mockJobs = [
    {
      id: 1,
      customer_name: 'Ramesh Kumar',
      account_number: '1234567890',
      bank_name: 'SBI',
      csp_name: 'CSP001',
      charge: 10,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      customer_name: 'Sunita Devi',
      account_number: '0987654321',
      bank_name: 'PNB',
      csp_name: 'CSP002',
      charge: 10,
      status: 'processing',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      processing: 'bg-amber-50 text-amber-700 border-amber-200',
      failed: 'bg-red-50 text-red-700 border-red-200',
    }
    return colors[status as keyof typeof colors] || colors.processing
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Print Jobs</h1>
          <p className="text-[13px] text-slate-500 mt-1">Monitor all passbook print operations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
          <input
            type="date"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Today's Prints</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText size={16} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-slate-800">24</p>
          <p className="text-[11px] text-emerald-600 mt-1">▲ 12% from yesterday</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">This Week</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-slate-800">156</p>
          <p className="text-[11px] text-blue-600 mt-1">▲ 8% from last week</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">This Month</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-[24px] font-bold text-slate-800">642</p>
          <p className="text-[11px] text-amber-600 mt-1">▲ 15% from last month</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600">
              <span className="text-[14px] font-bold">₹</span>
            </div>
          </div>
          <p className="text-[24px] font-bold text-slate-800">₹6,420</p>
          <p className="text-[11px] text-violet-600 mt-1">▲ 18% from last month</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Job ID</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Account</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Bank</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">CSP</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Charge</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Time</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockJobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-mono text-slate-700">#{job.id.toString().padStart(6, '0')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-slate-800">{job.customer_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-mono text-slate-700">{job.account_number}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{job.bank_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{job.csp_name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-slate-800">₹{job.charge}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${getStatusBadge(job.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {job.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{new Date(job.created_at).toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
