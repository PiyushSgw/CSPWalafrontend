'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchAllCustomers } from '@/redux/slices/adminSlice'
import { UserCheck, Search, Filter, MoreVertical, Eye, Building, MapPin } from 'lucide-react'

export default function CustomersPage() {
  const dispatch = useAppDispatch()
  const { customers, customerTotal, loading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [cspFilter, setCspFilter] = useState('')
  const [bankFilter, setBankFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showActions, setShowActions] = useState<number | null>(null)

  useEffect(() => {
    dispatch(fetchAllCustomers({ search, csp_id: cspFilter, bank_id: bankFilter, page, limit: 20 }))
  }, [dispatch, search, cspFilter, bankFilter, page])

  const getStatusBadge = (isActive: boolean) => ({
    className: `inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-full border ${
      isActive 
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
        : 'bg-slate-50 text-slate-700 border-slate-200'
    }`,
    text: isActive ? 'ACTIVE' : 'INACTIVE'
  })

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Customer Management</h1>
          <p className="text-[13px] text-slate-500 mt-1">{customerTotal} total customers</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] w-48 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <select
            value={cspFilter}
            onChange={(e) => { setCspFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All CSPs</option>
            {/* Will be populated with actual CSPs */}
          </select>
          <select
            value={bankFilter}
            onChange={(e) => { setBankFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="">All Banks</option>
            {/* Will be populated with actual banks */}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">Loading...</div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <UserCheck size={48} className="mb-3" />
          <p className="text-[15px] font-semibold text-slate-600">No customers found</p>
          <p className="text-[13px]">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Account</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Bank/Branch</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">CSP</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Joined</th>
                <th className="text-right px-4 py-3 text-[12px] font-semibold text-slate-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {customer.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-[11px] text-slate-500">A/C: {customer.account_type || 'Savings'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-mono text-slate-700">{customer.account_number}</p>
                    <p className="text-[11px] text-slate-500">{customer.ifsc}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{customer.mobile || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Building size={12} className="text-slate-400" />
                      <div>
                        <p className="text-[13px] text-slate-700">{customer.bank_name || 'N/A'}</p>
                        <p className="text-[11px] text-slate-500">{customer.branch_name || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      <div>
                        <p className="text-[13px] text-slate-700">{customer.csp_name || customer.csp_code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={getStatusBadge(customer.is_active).className}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {getStatusBadge(customer.is_active).text}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-slate-700">{new Date(customer.created_at).toLocaleDateString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === customer.id ? null : customer.id)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={14} className="text-slate-500" />
                      </button>
                      {showActions === customer.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[140px] z-10">
                          <button
                            onClick={() => { /* View details */ }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-50"
                          >
                            <Eye size={12} /> View Details
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
              Showing {Math.min((page - 1) * 20 + 1, customerTotal)} to {Math.min(page * 20, customerTotal)} of {customerTotal}
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
                onClick={() => setPage(p => Math.min(Math.ceil(customerTotal / 20), p + 1))}
                disabled={page >= Math.ceil(customerTotal / 20)}
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
