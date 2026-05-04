'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchRechargeRequests, approveRecharge, rejectRecharge } from '@/redux/slices/adminSlice'
import { Wallet, CheckCircle, XCircle, Search, Filter, MoreVertical, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function WalletApprovalPage() {
  const dispatch = useAppDispatch()
  const { rechargeRequests, rechargeTotal, loading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [showActions, setShowActions] = useState<number | null>(null)
  const [rejectModal, setRejectModal] = useState<{ id: number; amount: number; csp: string } | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [approveModal, setApproveModal] = useState<{ id: number; amount: number; csp: string } | null>(null)
  const [approveNote, setApproveNote] = useState('')

  useEffect(() => {
    dispatch(fetchRechargeRequests({ search, status, page, limit: 20 }))
  }, [dispatch, search, status, page])

  const handleApprove = async (id: number, note?: string) => {
    try {
      await dispatch(approveRecharge({ id, note })).unwrap()
      toast.success('Recharge approved successfully')
      dispatch(fetchRechargeRequests({ search, status, page, limit: 20 }))
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async (id: number, note?: string) => {
    try {
      await dispatch(rejectRecharge({ id, note })).unwrap()
      toast.success('Recharge rejected')
      dispatch(fetchRechargeRequests({ search, status, page, limit: 20 }))
    } catch { toast.error('Failed to reject') }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock size={12} />,
      approved: <CheckCircle size={12} />,
      rejected: <XCircle size={12} />,
    }
    return icons[status as keyof typeof icons] || icons.pending
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Wallet Recharge Approval</h1>
          <p className="text-[13px] text-slate-500 mt-1">{rechargeTotal} total requests</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by CSP code, UTR..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : rechargeRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Wallet size={48} className="mb-3" />
          <p className="text-[15px] font-semibold text-slate-600">No recharge requests found</p>
          <p className="text-[13px]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">CSP</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Payment Mode</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">UTR/Ref</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Requested</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rechargeRequests.map((req: any) => (
                <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-800">{req.csp_name || req.csp_code}</p>
                      <p className="text-[11px] text-slate-500">{req.csp_code}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-semibold text-slate-800">₹{req.amount}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] bg-slate-50 text-slate-700 px-2 py-1 rounded-full font-medium">
                      {req.payment_mode?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-mono text-slate-700">{req.utr || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{new Date(req.created_at).toLocaleDateString('en-IN')}</p>
                    <p className="text-[11px] text-slate-500">{new Date(req.created_at).toLocaleTimeString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${getStatusBadge(req.status)}`}>
                      {getStatusIcon(req.status)}
                      {req.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === 'pending' && (
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setApproveModal({ id: req.id, amount: req.amount, csp: req.csp_name || req.csp_code })}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectModal({ id: req.id, amount: req.amount, csp: req.csp_name || req.csp_code })}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-semibold rounded-lg transition-colors border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-[12px] text-slate-500">
              Showing {Math.min((page - 1) * 20 + 1, rechargeTotal)} to {Math.min(page * 20, rechargeTotal)} of {rechargeTotal}
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
                onClick={() => setPage(p => Math.min(Math.ceil(rechargeTotal / 20), p + 1))}
                disabled={page >= Math.ceil(rechargeTotal / 20)}
                className="px-3 py-1 text-[12px] border border-l-0 border-slate-200 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {approveModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setApproveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">Approve Recharge</h3>
                  <p className="text-[13px] text-slate-600">{approveModal.csp} · ₹{approveModal.amount}</p>
                </div>
              </div>
              <textarea
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="Add approval note (optional)..."
                className="w-full h-20 border border-slate-200 rounded-xl p-3 text-[13px] focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none resize-none mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setApproveModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleApprove(approveModal.id, approveNote); setApproveModal(null); setApproveNote('') }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-semibold"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setRejectModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <XCircle size={20} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800">Reject Recharge</h3>
                  <p className="text-[13px] text-slate-600">{rejectModal.csp} · ₹{rejectModal.amount}</p>
                </div>
              </div>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full h-20 border border-slate-200 rounded-xl p-3 text-[13px] focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none mb-4"
                required
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setRejectModal(null)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleReject(rejectModal.id, rejectNote); setRejectModal(null); setRejectNote('') }}
                  disabled={!rejectNote.trim()}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-semibold disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
