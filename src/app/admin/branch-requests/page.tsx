'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchBranchRequests, approveBranchRequest, rejectBranchRequest } from '@/redux/slices/adminSlice'
import { CheckCircle, XCircle, Eye, Search, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  pending:  { bg: 'bg-amber-50', text: 'text-amber-700' },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
}

export default function BranchRequestsPage() {
  const dispatch = useAppDispatch()
  const { branchRequests, branchRequestTotal, branchRequestLoading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [viewRequest, setViewRequest] = useState<any>(null)
  const [rejectModal, setRejectModal] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    dispatch(fetchBranchRequests({ page, limit: 20, ...(search && { search }), ...(statusFilter && { status: statusFilter }) }))
  }, [dispatch, page, statusFilter])

  const handleSearch = () => {
    setPage(1)
    dispatch(fetchBranchRequests({ page: 1, limit: 20, ...(search && { search }), ...(statusFilter && { status: statusFilter }) }))
  }

  const handleRefresh = () => {
    dispatch(fetchBranchRequests({ page, limit: 20, ...(search && { search }), ...(statusFilter && { status: statusFilter }) }))
  }

  const handleApprove = async (id: number) => {
    try {
      await dispatch(approveBranchRequest(id)).unwrap()
      toast.success('Branch approved successfully')
      handleRefresh()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to approve')
    }
  }

  const handleReject = async () => {
    if (!rejectModal || !rejectReason.trim()) return
    try {
      await dispatch(rejectBranchRequest({ id: rejectModal.id, reason: rejectReason })).unwrap()
      toast.success('Branch request rejected')
      setRejectModal(null)
      setRejectReason('')
      handleRefresh()
    } catch { toast.error('Failed to reject') }
  }

  const totalPages = Math.ceil((branchRequestTotal || 0) / 20)

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Branch Requests</h1>
          <p className="text-[13px] text-slate-500 mt-1">{branchRequestTotal} request{(branchRequestTotal || 0) !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleRefresh} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search by branch, IFSC, bank, or CSP..."
            className="w-full h-[38px] pl-9 pr-3 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-slate-400" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          className="h-[38px] px-3 rounded-lg border border-slate-200 text-[13px] outline-none focus:border-slate-400 bg-white">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {branchRequestLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : branchRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <CheckCircle size={48} className="mb-3 text-slate-300" />
          <p className="text-[15px] font-semibold text-slate-600">No branch requests found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Bank</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Branch Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">IFSC</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">City</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Requested By</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branchRequests.map((r: any) => {
                  const badge = STATUS_BADGE[r.request_status] || STATUS_BADGE.pending
                  return (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{r.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{r.bank_name}</td>
                      <td className="px-4 py-3 text-slate-700">{r.branch_name}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{r.ifsc || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{r.city || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{r.requested_by_name || '-'}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                          {r.request_status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setViewRequest(r)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" title="View">
                            <Eye size={15} />
                          </button>
                          {r.request_status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(r.id)}
                                className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600" title="Approve">
                                <CheckCircle size={15} />
                              </button>
                              <button onClick={() => setRejectModal(r)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Reject">
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <span className="text-[12px] text-slate-500">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium disabled:opacity-40 hover:bg-slate-50">Previous</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium disabled:opacity-40 hover:bg-slate-50">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Detail Modal */}
      {viewRequest && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setViewRequest(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <h3 className="text-[16px] font-bold text-slate-800 mb-4">Branch Request Details</h3>
              <div className="space-y-3 text-[13px]">
                {[
                  ['Bank', viewRequest.bank_name],
                  ['Branch Name', viewRequest.branch_name],
                  ['IFSC Code', viewRequest.ifsc || '-'],
                  ['City', viewRequest.city || '-'],
                  ['Requested By', viewRequest.requested_by_name || '-'],
                  ['Request Date', new Date(viewRequest.created_at).toLocaleDateString('en-IN')],
                  ['Remarks', viewRequest.request_remarks || '-'],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-start gap-3">
                    <span className="text-slate-500 min-w-[110px] font-medium">{label}</span>
                    <span className="text-slate-800 flex-1">{value as string}</span>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <span className="text-slate-500 min-w-[110px] font-medium">Status</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[viewRequest.request_status]?.bg} ${STATUS_BADGE[viewRequest.request_status]?.text}`}>
                    {viewRequest.request_status?.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setViewRequest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-semibold text-slate-700">Close</button>
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
              <h3 className="text-[16px] font-bold text-slate-800 mb-1">Reject Branch Request</h3>
              <p className="text-[13px] text-slate-500 mb-4">Rejecting branch: <strong>{rejectModal.branch_name}</strong></p>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full h-24 border border-slate-200 rounded-xl p-3 text-[13px] focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none resize-none" />
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setRejectModal(null); setRejectReason('') }}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
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
