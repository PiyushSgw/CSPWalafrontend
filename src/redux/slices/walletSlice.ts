import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cspApi } from '../../utils/cspApi'
// API Response Types (raw from backend)
interface RawWalletBalance {
  balance: number
  is_low: boolean
  print_charge: number
  prints_remaining: number
}

interface RawWalletTransaction {
  id: string | number
  description?: string
  type: 'credit' | 'debit'
  amount: number
  balance_after?: number
  created_at: string
}

interface RawRechargeRequest {
  id: string | number
  amount: number
  utr: string
  payment_mode: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  credited_at?: string
  reject_reason?: string
}

interface PaymentDetails {
  upi_id: string
  upi_name: string
  bank_name: string
  account_name: string
  account_number: string
  ifsc: string
  amount: number
  qr_code_base64: string
  upi_string: string
}

// UI Types (transformed for components)
export interface WalletTransaction {
  id: string
  dateTime: string
  desc: string
  type: 'Debit' | 'Credit'
  amount: string
  balanceAfter: string
  amount_raw: number
}

export interface RechargeRequest {
  id: string
  date: string
  amount: number
  utr: string
  method: string
  status: 'Pending' | 'Approved' | 'Rejected'
  creditedAt?: string
  rejectReason?: string
}

export interface WalletBalance {
  balance: number
  is_low: boolean
  print_charge: number
  prints_remaining: number
}

interface WalletState {
  balance: WalletBalance | null
  ledger: WalletTransaction[]
  rechargeRequests: RechargeRequest[]
  paymentDetails: PaymentDetails | null
  meta: any | null
  loading: boolean
  rechargeLoading: boolean
  error: string | null
}

const initialState: WalletState = {
  balance: null,
  ledger: [],
  rechargeRequests: [],
  paymentDetails: null,
  meta: null,
  loading: false,
  rechargeLoading: false,
  error: null,
}

// Thunks
export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const res = await cspApi.get('/api/csp/wallet/balance')
      return res.data.data as RawWalletBalance
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch balance')
    }
  }
)

export const fetchLedger = createAsyncThunk(
  'wallet/fetchLedger',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const res = await cspApi.get('/api/csp/wallet/ledger', { params })
      return {
        data: res.data.data as RawWalletTransaction[],
        meta: res.data.meta
      }
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch ledger')
    }
  }
)

export const fetchRechargeRequests = createAsyncThunk(
  'wallet/fetchRechargeRequests',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const res = await cspApi.get('/api/csp/wallet/recharge-requests', { params })
      return {
        data: res.data.data as RawRechargeRequest[],
        meta: res.data.meta
      }
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch requests')
    }
  }
)

export const fetchPaymentDetails = createAsyncThunk(
  'wallet/fetchPaymentDetails',
  async (amount: number, { rejectWithValue }) => {
    try {
      const res = await cspApi.get('/api/csp/wallet/payment-details', { params: { amount } })
      return res.data.data as PaymentDetails
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch payment details')
    }
  }
)

export const submitRechargeRequest = createAsyncThunk(
  'wallet/submitRecharge',
  async (data: { amount: number; utr: string; payment_mode: string }, { rejectWithValue }) => {
    try {
      const res = await cspApi.post('/api/csp/wallet/recharge', data)
      return res.data.data as RawRechargeRequest
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to submit request')
    }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearPaymentDetails: (state) => {
      state.paymentDetails = null
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Balance
      .addCase(fetchWalletBalance.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.loading = false
        state.balance = action.payload
      })
      .addCase(fetchWalletBalance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Ledger - Transform raw API data to UI format
      .addCase(fetchLedger.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.loading = false
        state.ledger = action.payload.data.map((tx: RawWalletTransaction): WalletTransaction => ({
          id: String(tx.id),
          dateTime: new Date(tx.created_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          desc: tx.description || 'Transaction',
          type: tx.type === 'credit' ? 'Credit' : 'Debit',
          amount: tx.type === 'credit' ? `+₹${Number(tx.amount).toFixed(2)}` : `-₹${Number(tx.amount).toFixed(2)}`,
          balanceAfter: `₹${Number(tx.balance_after || 0).toFixed(2)}`,
          amount_raw: Number(tx.amount),
        }))
        state.meta = action.payload.meta
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Requests - Transform raw API data to UI format
      .addCase(fetchRechargeRequests.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRechargeRequests.fulfilled, (state, action) => {
        state.loading = false
        state.rechargeRequests = action.payload.data.map((req: RawRechargeRequest): RechargeRequest => ({
          id: String(req.id),
          date: new Date(req.created_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          amount: Number(req.amount),
          utr: req.utr || '—',
          method: req.payment_mode || '—',
          status: req.status === 'approved' ? 'Approved' : 
                  req.status === 'rejected' ? 'Rejected' : 'Pending',
          creditedAt: req.credited_at 
            ? new Date(req.credited_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })
            : undefined,
          rejectReason: req.reject_reason || ''
        }))
        state.meta = action.payload.meta
      })
      .addCase(fetchRechargeRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Payment Details
      .addCase(fetchPaymentDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => {
        state.loading = false
        state.paymentDetails = action.payload
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Submit Request
      .addCase(submitRechargeRequest.pending, (state) => {
        state.rechargeLoading = true
        state.error = null
      })
      .addCase(submitRechargeRequest.fulfilled, (state, action) => {
        state.rechargeLoading = false
        // Transform new request to UI format and add to front
        const newReq: RechargeRequest = {
          id: String(action.payload.id),
          date: new Date(action.payload.created_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          amount: Number(action.payload.amount),
          utr: action.payload.utr || '—',
          method: action.payload.payment_mode || '—',
          status: action.payload.status === 'approved' ? 'Approved' : 
                  action.payload.status === 'rejected' ? 'Rejected' : 'Pending',
          creditedAt: action.payload.credited_at 
            ? new Date(action.payload.credited_at).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })
            : undefined,
          rejectReason: action.payload.reject_reason || ''
        }
        state.rechargeRequests.unshift(newReq)
        state.paymentDetails = null
      })
      .addCase(submitRechargeRequest.rejected, (state, action) => {
        state.rechargeLoading = false
        state.error = action.payload as string
      })
  }
})

export const { clearPaymentDetails, clearError } = walletSlice.actions
export default walletSlice.reducer