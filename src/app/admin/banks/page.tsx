'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchBanks, createBank, updateBank, deleteBank, fetchBranches, createBranch, deleteBranch } from '@/redux/slices/adminSlice'
import { Building2, Plus, Edit2, Trash2, MapPin, Search, MoreVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function BanksPage() {
  const dispatch = useAppDispatch()
  const { banks, branches, loading } = useAppSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [showBankModal, setShowBankModal] = useState(false)
  const [showBranchModal, setShowBranchModal] = useState(false)
  const [editingBank, setEditingBank] = useState<any>(null)
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null)
  const [showActions, setShowActions] = useState<number | null>(null)
  const [bankForm, setBankForm] = useState({ name: '', short_code: '', logo_url: '' })
  const [branchForm, setBranchForm] = useState({ name: '', ifsc: '', city: '', state: '', address: '' })

  useEffect(() => {
    dispatch(fetchBanks())
  }, [dispatch])

  useEffect(() => {
    if (selectedBankId) {
      dispatch(fetchBranches(selectedBankId))
    }
  }, [dispatch, selectedBankId])

  const handleSaveBank = async () => {
    if (!bankForm.name.trim() || !bankForm.short_code.trim()) {
      toast.error('Bank name and code are required')
      return
    }
    try {
      if (editingBank) {
        await dispatch(updateBank({ id: editingBank.id, ...bankForm })).unwrap()
        toast.success('Bank updated successfully')
      } else {
        await dispatch(createBank(bankForm)).unwrap()
        toast.success('Bank created successfully')
      }
      setShowBankModal(false)
      setEditingBank(null)
      setBankForm({ name: '', short_code: '', logo_url: '' })
      dispatch(fetchBanks())
    } catch { toast.error('Failed to save bank') }
  }

  const handleDeleteBank = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bank?')) return
    try {
      await dispatch(deleteBank(id)).unwrap()
      toast.success('Bank deleted successfully')
      dispatch(fetchBanks())
    } catch { toast.error('Failed to delete bank') }
  }

  const handleSaveBranch = async () => {
    if (!selectedBankId || !branchForm.name.trim() || !branchForm.ifsc.trim()) {
      toast.error('Branch name and IFSC are required')
      return
    }
    try {
      await dispatch(createBranch({ bankId: selectedBankId, ...branchForm })).unwrap()
      toast.success('Branch created successfully')
      setShowBranchModal(false)
      setBranchForm({ name: '', ifsc: '', city: '', state: '', address: '' })
      dispatch(fetchBranches(selectedBankId))
    } catch { toast.error('Failed to save branch') }
  }

  const handleDeleteBranch = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch?')) return
    try {
      await dispatch(deleteBranch(id)).unwrap()
      toast.success('Branch deleted successfully')
      dispatch(fetchBranches(selectedBankId!))
    } catch { toast.error('Failed to delete branch') }
  }

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(search.toLowerCase()) ||
    bank.short_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Bank Management</h1>
          <p className="text-[13px] text-slate-500 mt-1">{banks.length} banks configured</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search banks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-[13px] w-48 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          <button
            onClick={() => { setEditingBank(null); setBankForm({ name: '', short_code: '', logo_url: '' }); setShowBankModal(true) }}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            <Plus size={14} /> Add Bank
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Banks List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <h3 className="text-[14px] font-semibold text-slate-800">Banks</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredBanks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Building2 size={32} className="mb-2" />
                  <p className="text-[13px]">No banks found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredBanks.map((bank: any) => (
                    <div key={bank.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-sm">
                            {bank.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-800">{bank.name}</p>
                            <p className="text-[11px] text-slate-500">{bank.short_code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedBankId(bank.id) }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              selectedBankId === bank.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'
                            }`}
                          >
                            <MapPin size={14} />
                          </button>
                          <button
                            onClick={() => { setEditingBank(bank); setBankForm({ name: bank.name, short_code: bank.short_code, logo_url: bank.logo_url || '' }); setShowBankModal(true) }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                          >
                            <Edit2 size={14} />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === bank.id ? null : bank.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                            >
                              <MoreVertical size={14} />
                            </button>
                            {showActions === bank.id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[100px] z-10">
                                <button
                                  onClick={() => { handleDeleteBank(bank.id); setShowActions(null) }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Branches */}
        <div>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-slate-800">Branches</h3>
                {selectedBankId && (
                  <button
                    onClick={() => setShowBranchModal(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {!selectedBankId ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <MapPin size={32} className="mb-2" />
                  <p className="text-[13px]">Select a bank to view branches</p>
                </div>
              ) : branches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <MapPin size={32} className="mb-2" />
                  <p className="text-[13px]">No branches found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {branches.map((branch: any) => (
                    <div key={branch.id} className="px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{branch.name}</p>
                          <p className="text-[11px] text-slate-500">{branch.ifsc}</p>
                          <p className="text-[11px] text-slate-400">{branch.city}, {branch.state}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Modal */}
      {showBankModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowBankModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-[16px] font-bold text-slate-800 mb-4">
                {editingBank ? 'Edit Bank' : 'Add New Bank'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={bankForm.name}
                    onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="e.g., State Bank of India"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Short Code</label>
                  <input
                    type="text"
                    value={bankForm.short_code}
                    onChange={(e) => setBankForm({ ...bankForm, short_code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="e.g., SBI"
                    maxLength={10}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Logo URL (Optional)</label>
                  <input
                    type="url"
                    value={bankForm.logo_url}
                    onChange={(e) => setBankForm({ ...bankForm, logo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowBankModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBank}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold"
                >
                  {editingBank ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Branch Modal */}
      {showBranchModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setShowBranchModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-[16px] font-bold text-slate-800 mb-4">Add New Branch</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Branch Name</label>
                  <input
                    type="text"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="e.g., Main Branch"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={branchForm.ifsc}
                    onChange={(e) => setBranchForm({ ...branchForm, ifsc: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    placeholder="e.g., SBIN0001234"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={branchForm.city}
                      onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={branchForm.state}
                      onChange={(e) => setBranchForm({ ...branchForm, state: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Address</label>
                  <textarea
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                    placeholder="123, Main Street"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowBranchModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBranch}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-semibold"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
