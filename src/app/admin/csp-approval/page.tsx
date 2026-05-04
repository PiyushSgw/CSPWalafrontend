'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchCSPs, approveCSP, rejectCSP, fetchPendingCount } from '@/redux/slices/adminSlice'
import { CheckCircle, XCircle, Eye, Clock, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CSPApprovalPage() {
  const dispatch = useAppDispatch()
  const { csps, cspLoading } = useAppSelector(s => s.admin)
  const [rejectModal, setRejectModal] = useState<{ id: number; name: string } | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    dispatch(fetchCSPs({ status: 'pending' }))
  }, [dispatch])

  const handleApprove = async (id: number) => {
    try {
      await dispatch(approveCSP(id)).unwrap()
      toast.success('CSP approved successfully')
      dispatch(fetchCSPs({ status: 'pending' }))
      dispatch(fetchPendingCount())
    } catch { toast.error('Failed to approve') }
  }

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return
    try {
      await dispatch(rejectCSP({ id: rejectModal.id, reason: rejectReason })).unwrap()
      toast.success('CSP rejected')
      setRejectModal(null)
      setRejectReason('')
      dispatch(fetchCSPs({ status: 'pending' }))
      dispatch(fetchPendingCount())
    } catch { toast.error('Failed to reject') }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">CSP Approval Queue</h1>
          <p className="text-[13px] text-slate-500 mt-1">{csps.length} pending applications</p>
        </div>
      </div>

      {cspLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : csps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <CheckCircle size={48} className="mb-3 text-emerald-400" />
          <p className="text-[15px] font-semibold text-slate-600">All caught up!</p>
          <p className="text-[13px]">No pending CSP approvals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {csps.map((csp: any) => (
            <div key={csp.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm">
                    {csp.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-slate-800">{csp.name}</p>
                    <p className="text-[12px] text-slate-500">{csp.email} · {csp.mobile || 'N/A'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">PENDING</span>
                      <span className="text-[11px] text-slate-400">{new Date(csp.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleApprove(csp.id)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg transition-colors">
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button onClick={() => setRejectModal({ id: csp.id, name: csp.name })}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-[12px] font-semibold rounded-lg transition-colors border border-red-200">
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setRejectModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-[16px] font-bold text-slate-800 mb-1">Reject CSP Application</h3>
              <p className="text-[13px] text-slate-500 mb-4">Rejecting: <strong>{rejectModal.name}</strong></p>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full h-24 border border-slate-200 rounded-xl p-3 text-[13px] focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none" />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button onClick={handleReject} disabled={!rejectReason.trim()}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[13px] font-semibold disabled:opacity-50">Reject</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
