import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Customer {
  id: number
  name: string
  account_number: string
  account_type?: string
  ifsc?: string
  ifsc_code?: string
  bank_id?: number
  bank_name?: string
  branch_name?: string
  branch?: string
  mobile?: string
  mobile_number?: string
  opening_balance?: number
  customer_photo?: string
  csp_code?: string
}

export interface Transaction {
  id?: number
  customer_id?: number
  txn_date: string
  description: string
  debit: number
  credit: number
  balance: number
  print_job_id?: number | null
  created_at?: string
}

export interface PreviewState {
  html: string
  pdf_url?: string
  print_charge?: number
  transaction_count?: number
}

interface TransactionMeta {
  total: number
  page: number
  totalPages: number
}

interface PassbookState {
  customers: Customer[]
  selectedCustomer: Customer | null
  transactions: Transaction[]
  preview: PreviewState | null
  wizardStep: number
  loading: boolean
  creatingCustomer: boolean
  fetchingCustomer: boolean
  printing: boolean
  previewLoading: boolean
  error: string | null
  printError: string | null
  printResult: any | null
  transactionMeta: TransactionMeta
}

// ─── Thunk Payload Types ──────────────────────────────────────────────────────

interface TransactionInput {
  sr_no?: number
  txn_date: string
  description: string
  debit: number
  credit: number
  balance: number
}

interface PreviewPayload {
  customer_id: number
  account_number?: string
  transactions: TransactionInput[]
}

interface PrintPayload {
  customer_id: number
  account_number?: string
  print_cost?: number
  transactions: TransactionInput[]
}

interface FetchTransactionsResponse {
  transactions: Transaction[]
  total: number
  page: number
  totalPages: number
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: PassbookState = {
  customers: [],
  selectedCustomer: null,
  transactions: [],
  preview: null,
  wizardStep: 1,
  loading: false,
  creatingCustomer: false,
  fetchingCustomer: false,
  printing: false,
  previewLoading: false,
  error: null,
  printError: null,
  printResult: null,
  transactionMeta: {
    total: 0,
    page: 1,
    totalPages: 1,
  },
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const searchCustomers = createAsyncThunk<
  Customer[],
  string,
  { rejectValue: string }
>('passbook/searchCustomers', async (query, { rejectWithValue }) => {
  try {
    const res = await api.get('/csp/customers', { params: { search: query } })
    console.log('Search Customers Response:', res.data)
    return res.data?.data || []
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to search customers'
    )
  }
})

export const fetchCustomer = createAsyncThunk<
  Customer,
  number,
  { rejectValue: string }
>('passbook/fetchCustomer', async (customerId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/csp/customers/${customerId}`)
    return res.data?.data
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to fetch customer'
    )
  }
})

export const createCustomer = createAsyncThunk<
  Customer,
  any,
  { rejectValue: string }
>('passbook/createCustomer', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/csp/customers', payload)
    return res.data?.data
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to create customer'
    )
  }
})

export const fetchCustomerTransactions = createAsyncThunk<
  FetchTransactionsResponse,
  number,
  { rejectValue: string }
>(
  'passbook/fetchCustomerTransactions',
  async (customerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/csp/passbook/transactions/${customerId}`)

      const raw: any[] =
        res.data?.data?.transactions ||
        (Array.isArray(res.data?.data) ? res.data.data : [])

      const transactions: Transaction[] = raw.map((txn: any) => ({
        id: txn.id,
        customer_id: txn.customer_id,
        txn_date: txn.txn_date ? String(txn.txn_date).slice(0, 10) : '',
        description: txn.description || '',
        debit: Number(txn.debit || 0),
        credit: Number(txn.credit || 0),
        balance: Number(txn.balance || 0),
        print_job_id: txn.print_job_id ?? null,
        created_at: txn.created_at,
      }))

      return {
        transactions,
        total: res.data?.data?.total ?? transactions.length,
        page: res.data?.data?.page ?? 1,
        totalPages: res.data?.data?.totalPages ?? 1,
      }
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || 'Failed to fetch transactions'
      )
    }
  }
)

export const generatePassbookPreview = createAsyncThunk<
  any,
  PreviewPayload,
  { rejectValue: string }
>('passbook/generatePassbookPreview', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/csp/passbook/preview', payload)
    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to generate preview'
    )
  }
})

export const printPassbook = createAsyncThunk<
  any,
  PrintPayload,
  { rejectValue: string }
>('passbook/printPassbook', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post('/csp/passbook/print', payload)
    return res.data
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || 'Failed to print passbook'
    )
  }
})

// ─── Slice ────────────────────────────────────────────────────────────────────

const passbookSlice = createSlice({
  name: 'passbook',
  initialState,
  reducers: {
    setSelectedCustomer(state, action: PayloadAction<Customer | null>) {
      state.selectedCustomer = action.payload
    },

    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload || []
    },

    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload)
    },

    updateTransaction(
      state,
      action: PayloadAction<{ index: number; data: Partial<Transaction> }>
    ) {
      const { index, data } = action.payload
      if (state.transactions[index]) {
        state.transactions[index] = {
          ...state.transactions[index],
          ...data,
        }
      }
    },

    deleteTransaction(state, action: PayloadAction<number>) {
      state.transactions = state.transactions.filter((_, i) => i !== action.payload)
    },

    clearTransactions(state) {
      state.transactions = []
      state.transactionMeta = { total: 0, page: 1, totalPages: 1 }
    },

    clearPreview(state) {
      state.preview = null
    },

    setWizardStep(state, action: PayloadAction<number>) {
      state.wizardStep = action.payload
    },

    clearPrintState(state) {
      state.printing = false
      state.printError = null
      state.printResult = null
    },

    resetPassbookState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Search failed'
      })

      .addCase(fetchCustomer.pending, (state) => {
        state.fetchingCustomer = true
        state.error = null
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.fetchingCustomer = false
        state.selectedCustomer = action.payload
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.fetchingCustomer = false
        state.error = action.payload ?? 'Fetch customer failed'
      })

      .addCase(createCustomer.pending, (state) => {
        state.creatingCustomer = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.creatingCustomer = false
        state.selectedCustomer = action.payload
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.creatingCustomer = false
        state.error = action.payload ?? 'Create customer failed'
      })

      .addCase(fetchCustomerTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomerTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.transactions
        state.transactionMeta = {
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
        }
      })
      .addCase(fetchCustomerTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Fetch transactions failed'
        state.transactions = []
        state.transactionMeta = { total: 0, page: 1, totalPages: 1 }
      })

      .addCase(generatePassbookPreview.pending, (state) => {
        state.previewLoading = true
        state.error = null
      })
      .addCase(generatePassbookPreview.fulfilled, (state, action) => {
        state.previewLoading = false
        const d = action.payload?.data ?? action.payload
        state.preview = {
          html: d?.html || '',
          pdf_url: d?.pdf_url || '',
          print_charge: d?.print_charge ?? 10,
          transaction_count: d?.transaction_count ?? 0,
        }
      })
      .addCase(generatePassbookPreview.rejected, (state, action) => {
        state.previewLoading = false
        state.error = action.payload ?? 'Preview generation failed'
      })

      .addCase(printPassbook.pending, (state) => {
        state.printing = true
        state.printError = null
      })
      .addCase(printPassbook.fulfilled, (state, action) => {
        state.printing = false
        state.printResult = action.payload

        const d = action.payload?.data ?? action.payload

        state.preview = {
          html: state.preview?.html || '',
          pdf_url:
            d?.pdf_signed_url ||
            d?.pdf_url ||
            d?.file_url ||
            '',
          print_charge:
            d?.charge ??
            state.preview?.print_charge ??
            10,
          transaction_count:
            d?.transaction_count ??
            state.preview?.transaction_count ??
            state.transactions.length,
        }
      })
      .addCase(printPassbook.rejected, (state, action) => {
        state.printing = false
        state.printError = action.payload ?? 'Print failed'
      })
  },
})

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  setSelectedCustomer,
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearTransactions,
  clearPreview,
  setWizardStep,
  clearPrintState,
  resetPassbookState,
} = passbookSlice.actions

export default passbookSlice.reducer