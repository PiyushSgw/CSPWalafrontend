import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/axios'

interface Transaction {
  txn_date: string
  description: string
  debit: number
  credit: number
  balance?: number
}

interface Customer {
  id: number
  name: string
  account_number: string
  account_type: string
  ifsc: string
  bank_id: number
  bank_name: string
  branch_name?: string
  mobile?: string
  opening_balance: number
}

interface PassbookState {
  wizardStep: number
  selectedCustomer: Customer | null
  transactions: Transaction[]
  preview: any | null
  printResult: any | null
  history: any[]
  historyTotal: number
  loading: boolean
  printLoading: boolean
  error: string | null
}

// ═══════════════════════════════════════════════════════════════════════════
// ASYNC THUNKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Search customers by name or account number
 */
export const searchCustomers = createAsyncThunk(
  'passbook/searchCustomers',
  async (query: string, { rejectWithValue }) => {
    try {
      debugger
      const res = await api.get('api/csp/customers', {
        params: {
          search: query,
          page: 1,
          limit: 20,
        },
      })
      return res.data.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Search failed')
    }
  }
)

/**
 * Create a new customer
 */
export const createCustomer = createAsyncThunk(
  'passbook/createCustomer',
  async (
    data: {
      name: string
      account_number: string
      account_type: string
      ifsc: string
      bank_id: number
      mobile?: string
      opening_balance: number
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/api/csp/customers/create', data)
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to create customer')
    }
  }
)

/**
 * Fetch customer details by ID
 */
export const fetchCustomer = createAsyncThunk(
  'passbook/fetchCustomer',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/csp/customers/${customerId}`)
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch customer')
    }
  }
)

/**
 * Preview passbook (Step 3)
 */
export const previewPassbook = createAsyncThunk(
  'passbook/preview',
  async (
    data: { customer_id: number; transactions: Transaction[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/api/csp/passbook/preview', data)
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Preview failed')
    }
  }
)

/**
 * Print passbook and generate PDF (Step 4)
 */
export const printPassbook = createAsyncThunk(
  'passbook/print',
  async (
    data: { customer_id: number; transactions: Transaction[] },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/api/csp/passbook/print', data)
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Print failed')
    }
  }
)

/**
 * Fetch print history
 */
export const fetchPrintHistory = createAsyncThunk(
  'passbook/fetchHistory',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/csp/passbook/history', { params })
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch history')
    }
  }
)

/**
 * Reprint a passbook
 */
export const reprintPassbook = createAsyncThunk(
  'passbook/reprint',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const res = await api.post(`/api/csp/passbook/reprint/${jobId}`)
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Reprint failed')
    }
  }
)

/**
 * Fetch customer transactions
 */
export const fetchCustomerTransactions = createAsyncThunk(
  'passbook/fetchTransactions',
  async (params: { customerId: number; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/csp/passbook/transactions/${params.customerId}`, {
        params: { page: params.page || 1, limit: params.limit || 50 },
      })
      return res.data.data
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch transactions')
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════════════

const passbookSlice = createSlice({
  name: 'passbook',
  initialState: {
    wizardStep: 1,
    selectedCustomer: null,
    transactions: [],
    preview: null,
    printResult: null,
    history: [],
    historyTotal: 0,
    loading: false,
    printLoading: false,
    error: null,
  } as PassbookState,

  reducers: {
    // ── Navigation ────────────────────────────────────────────────────
    setWizardStep: (state, action: PayloadAction<number>) => {
      state.wizardStep = action.payload
    },

    // ── Customer ──────────────────────────────────────────────────────
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload
    },

    // ── Transactions ──────────────────────────────────────────────────
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload
    },

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload)
    },

    removeTransaction: (state, action: PayloadAction<number>) => {
      state.transactions.splice(action.payload, 1)
    },

    updateTransaction: (
      state,
      action: PayloadAction<{ index: number; data: Transaction }>
    ) => {
      state.transactions[action.payload.index] = action.payload.data
    },

    // ── Preview & Print ───────────────────────────────────────────────
    setPreview: (state, action: PayloadAction<any | null>) => {
      state.preview = action.payload
    },

    setPrintResult: (state, action: PayloadAction<any | null>) => {
      state.printResult = action.payload
    },

    // ── Error ─────────────────────────────────────────────────────────
    clearError: (state) => {
      state.error = null
    },

    // ── Reset wizard ──────────────────────────────────────────────────
    resetWizard: (state) => {
      state.wizardStep = 1
      state.selectedCustomer = null
      state.transactions = []
      state.preview = null
      state.printResult = null
      state.error = null
    },
  },

  extraReducers: (builder) => {
    // ════════════════════════════════════════════════════════════════
    // SEARCH CUSTOMERS
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(searchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchCustomers.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // CREATE CUSTOMER
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCustomer = action.payload
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // FETCH CUSTOMER
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(fetchCustomer.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCustomer = action.payload
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // PREVIEW PASSBOOK
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(previewPassbook.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(previewPassbook.fulfilled, (state, action) => {
        state.loading = false
        state.preview = action.payload
        state.wizardStep = 3
      })
      .addCase(previewPassbook.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // PRINT PASSBOOK
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(printPassbook.pending, (state) => {
        state.printLoading = true
        state.error = null
      })
      .addCase(printPassbook.fulfilled, (state, action) => {
        state.printLoading = false
        state.printResult = action.payload
        state.wizardStep = 4
      })
      .addCase(printPassbook.rejected, (state, action) => {
        state.printLoading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // FETCH PRINT HISTORY
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(fetchPrintHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPrintHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload?.jobs || []
        state.historyTotal = action.payload?.total || 0
      })
      .addCase(fetchPrintHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // REPRINT PASSBOOK
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(reprintPassbook.pending, (state) => {
        state.printLoading = true
        state.error = null
      })
      .addCase(reprintPassbook.fulfilled, (state) => {
        state.printLoading = false
      })
      .addCase(reprintPassbook.rejected, (state, action) => {
        state.printLoading = false
        state.error = action.payload as string
      })

    // ════════════════════════════════════════════════════════════════
    // FETCH CUSTOMER TRANSACTIONS
    // ════════════════════════════════════════════════════════════════
    builder
      .addCase(fetchCustomerTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomerTransactions.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchCustomerTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  setWizardStep,
  setSelectedCustomer,
  setTransactions,
  addTransaction,
  removeTransaction,
  updateTransaction,
  setPreview,
  setPrintResult,
  clearError,
  resetWizard,
} = passbookSlice.actions

export default passbookSlice.reducer