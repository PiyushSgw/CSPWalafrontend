'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchCSPs, suspendCSP } from '@/redux/slices/adminSlice'
import { Users, Search, Filter, MoreVertical, Eye, Power, PowerOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CSPListPage() {
  const dispatch = useAppDispatch()
  const { csps, cspTotal, cspLoading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [showActions, setShowActions] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchCSPs({ search, status, page, limit: 20 }))
  }, [dispatch, search, status, page])

  const handleSuspend = async (id: number, suspend: boolean) => {
    try {
      await dispatch(suspendCSP({ id, suspend })).unwrap()
      toast.success(`CSP ${suspend ? 'suspended' : 'activated'} successfully`)
      dispatch(fetchCSPs({ search, status, page, limit: 20 }))
    } catch { toast.error('Failed to update CSP status') }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
      rejected: 'bg-slate-50 text-slate-700 border-slate-200',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">CSP Management</h1>
          <p className="text-[13px] text-slate-500 mt-1">{cspTotal} total CSPs</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search CSPs..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] w-48 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {cspLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : csps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Users size={48} className="mb-3" />
          <p className="text-[15px] font-semibold text-slate-600">No CSPs found</p>
          <p className="text-[13px]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">CSP</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Joined</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {csps.map((csp: any) => (
                <tr key={csp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {csp.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{csp.name}</p>
                        <p className="text-[11px] text-slate-500">{csp.csp_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{csp.email}</p>
                    <p className="text-[11px] text-slate-500">{csp.mobile || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{csp.location || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${getStatusBadge(csp.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {csp.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{new Date(csp.created_at).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === csp.id ? null : csp.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={14} className="text-slate-500" />
                      </button>
                      {showActions === csp.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px] z-10">
                          <button
                            onClick={() => { /* View details */ }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                          >
                            <Eye size={12} /> View Details
                          </button>
                          <button
                            onClick={() => handleSuspend(csp.id, csp.status === 'active')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                          >
                            {csp.status === 'active' ? <PowerOff size={12} /> : <Power size={12} />}
                            {csp.status === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-[12px] text-slate-500">
              Showing {Math.min((page - 1) * 20 + 1, cspTotal)} to {Math.min(page * 20, cspTotal)} of {cspTotal}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-[12px] border border-slate-200 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(Math.ceil(cspTotal / 20), p + 1))}
                disabled={page >= Math.ceil(cspTotal / 20)}
                className="px-3 py-1 text-[12px] border border-l-0 border-slate-200 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
