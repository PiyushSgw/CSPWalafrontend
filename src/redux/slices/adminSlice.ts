import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import adminApi from '../../utils/adminApi'

const initialState = {
  dashboard: null as any, csps: [] as any[], cspTotal: 0, cspLoading: false,
  cspDetail: null as any, pendingCount: {} as Record<string, number>,
  banks: [] as any[], branches: [] as any[],
  rechargeRequests: [] as any[], rechargeTotal: 0,
  customers: [] as any[], customerTotal: 0,
  loading: false, error: null as string | null,
}

// ── Thunks ──
export const fetchAdminDashboard = createAsyncThunk('admin/dashboard', async () => {
  const r = await adminApi.get('/admin/reports/dashboard'); return r.data.data
})
export const fetchCSPs = createAsyncThunk('admin/fetchCSPs', async (p: any = {}) => {
  const q = new URLSearchParams(p).toString(); const r = await adminApi.get(`/admin/csps${q ? '?' + q : ''}`)
  return { rows: r.data.data.rows || r.data.data, total: r.data.data.total || 0 }
})
export const fetchCSPDetail = createAsyncThunk('admin/cspDetail', async (id: number) => {
  const r = await adminApi.get(`/admin/csps/${id}`); return r.data.data
})
export const fetchPendingCount = createAsyncThunk('admin/pendingCount', async () => {
  const r = await adminApi.get('/admin/csps/pending-count'); return r.data.data
})
export const approveCSP = createAsyncThunk('admin/approveCSP', async (id: number) => {
  await adminApi.patch(`/admin/csps/${id}/approve`); return id
})
export const rejectCSP = createAsyncThunk('admin/rejectCSP', async ({ id, reason }: any) => {
  await adminApi.patch(`/admin/csps/${id}/reject`, { reason }); return id
})
export const suspendCSP = createAsyncThunk('admin/suspendCSP', async ({ id, suspend, reason }: any) => {
  await adminApi.patch(`/admin/csps/${id}/suspend`, { suspend, reason }); return id
})
export const fetchBanks = createAsyncThunk('admin/fetchBanks', async () => {
  const r = await adminApi.get('/admin/banks'); return r.data.data
})
export const createBank = createAsyncThunk('admin/createBank', async (d: any) => {
  const r = await adminApi.post('/admin/banks', d); return r.data.data
})
export const updateBank = createAsyncThunk('admin/updateBank', async ({ id, ...d }: any) => {
  const r = await adminApi.put(`/admin/banks/${id}`, d); return r.data.data
})
export const deleteBank = createAsyncThunk('admin/deleteBank', async (id: number) => {
  await adminApi.delete(`/admin/banks/${id}`); return id
})
export const fetchBranches = createAsyncThunk('admin/fetchBranches', async (bankId: number) => {
  const r = await adminApi.get(`/admin/banks/${bankId}/branches`); return r.data.data
})
export const createBranch = createAsyncThunk('admin/createBranch', async ({ bankId, ...d }: any) => {
  const r = await adminApi.post(`/admin/banks/${bankId}/branches`, d); return r.data.data
})
export const deleteBranch = createAsyncThunk('admin/deleteBranch', async (id: number) => {
  await adminApi.delete(`/admin/branches/${id}`); return id
})
export const fetchRechargeRequests = createAsyncThunk('admin/rechargeRequests', async (p: any = {}) => {
  const q = new URLSearchParams(p).toString(); const r = await adminApi.get(`/admin/wallet/recharge-requests${q ? '?' + q : ''}`)
  return { rows: r.data.data.rows || r.data.data, total: r.data.data.total || 0 }
})
export const approveRecharge = createAsyncThunk('admin/approveRecharge', async ({ id, note }: any) => {
  await adminApi.patch(`/admin/wallet/recharge-requests/${id}/approve`, { admin_note: note }); return id
})
export const rejectRecharge = createAsyncThunk('admin/rejectRecharge', async ({ id, note }: any) => {
  await adminApi.patch(`/admin/wallet/recharge-requests/${id}/reject`, { admin_note: note }); return id
})
export const fetchAllCustomers = createAsyncThunk('admin/fetchAllCustomers', async (p: any = {}) => {
  const q = new URLSearchParams(p).toString(); const r = await adminApi.get(`/admin/customers${q ? '?' + q : ''}`)
  return { rows: r.data.data.rows || r.data.data, total: r.data.data.total || 0 }
})

const adminSlice = createSlice({
  name: 'admin', initialState,
  reducers: { clearAdminError: (s) => { s.error = null } },
  extraReducers: (b) => {
    b.addCase(fetchAdminDashboard.pending, (s) => { s.loading = true })
      .addCase(fetchAdminDashboard.fulfilled, (s, a) => { s.loading = false; s.dashboard = a.payload })
      .addCase(fetchAdminDashboard.rejected, (s) => { s.loading = false })
      .addCase(fetchCSPs.pending, (s) => { s.cspLoading = true })
      .addCase(fetchCSPs.fulfilled, (s, a) => { s.cspLoading = false; s.csps = a.payload.rows; s.cspTotal = a.payload.total })
      .addCase(fetchCSPs.rejected, (s) => { s.cspLoading = false })
      .addCase(fetchCSPDetail.pending, (s) => { s.loading = true })
      .addCase(fetchCSPDetail.fulfilled, (s, a) => { s.loading = false; s.cspDetail = a.payload })
      .addCase(fetchCSPDetail.rejected, (s) => { s.loading = false })
      .addCase(fetchPendingCount.fulfilled, (s, a) => { s.pendingCount = a.payload })
      .addCase(approveCSP.fulfilled, (s, a) => { s.csps = s.csps.filter(c => c.id !== a.payload) })
      .addCase(rejectCSP.fulfilled, (s, a) => { s.csps = s.csps.filter(c => c.id !== a.payload) })
      .addCase(fetchBanks.pending, (s) => { s.loading = true })
      .addCase(fetchBanks.fulfilled, (s, a) => { s.loading = false; s.banks = a.payload })
      .addCase(fetchBanks.rejected, (s) => { s.loading = false })
      .addCase(createBank.fulfilled, (s, a) => { s.banks.push(a.payload) })
      .addCase(updateBank.fulfilled, (s, a) => { s.banks = s.banks.map(b => b.id === a.payload.id ? a.payload : b) })
      .addCase(deleteBank.fulfilled, (s, a) => { s.banks = s.banks.filter(b => b.id !== a.payload) })
      .addCase(fetchBranches.fulfilled, (s, a) => { s.branches = a.payload })
      .addCase(createBranch.fulfilled, (s, a) => { s.branches.push(a.payload) })
      .addCase(deleteBranch.fulfilled, (s, a) => { s.branches = s.branches.filter(b => b.id !== a.payload) })
      .addCase(fetchRechargeRequests.pending, (s) => { s.loading = true })
      .addCase(fetchRechargeRequests.fulfilled, (s, a) => { s.loading = false; s.rechargeRequests = a.payload.rows; s.rechargeTotal = a.payload.total })
      .addCase(fetchRechargeRequests.rejected, (s) => { s.loading = false })
      .addCase(approveRecharge.fulfilled, (s, a) => { s.rechargeRequests = s.rechargeRequests.filter(r => r.id !== a.payload) })
      .addCase(rejectRecharge.fulfilled, (s, a) => { s.rechargeRequests = s.rechargeRequests.filter(r => r.id !== a.payload) })
      .addCase(fetchAllCustomers.pending, (s) => { s.loading = true })
      .addCase(fetchAllCustomers.fulfilled, (s, a) => { s.loading = false; s.customers = a.payload.rows; s.customerTotal = a.payload.total })
      .addCase(fetchAllCustomers.rejected, (s) => { s.loading = false })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
