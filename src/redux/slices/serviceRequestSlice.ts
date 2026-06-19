import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/axios'

const API_BASE = '/csp/service-requests'

export interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'checkbox-group' | 'email'
  required: boolean
  placeholder?: string
  maxLength?: number
  options?: { value: string; label: string }[] | string[]
}
debugger;
export interface FormConfig {
  serviceCode: string
  title: string
  description?: string
  fields: FormField[]
}

export interface BankService {
  bank_service_id: number
  service_id: number
  name: string
  code: string
  description: string
}

export interface SelectedService {
  serviceId: number
  bankServiceId: number
  name: string
  code: string
}

export interface CustomerSearchResult {
  id: number
  name: string
  mobile: string
  account_number: string
  aadhar_number: string
  address: string
  pin_code: string
  account_type: string
  ifsc: string
  opening_balance: string
  bank_name: string
  bank_code: string
}

export interface ServiceRequest {
  id: string
  user_id: number
  customer_id: number | null
  bank_id: number
  service_id: number
  status: string
  request_data: Record<string, any>
  pdf_generated: boolean
  pdf_file_path: string | null
  submitted_at: string
  created_at: string
  updated_at: string
  bank_name?: string
  bank_code?: string
  service_name?: string
  service_code?: string
  customer_name?: string
}

interface ServiceRequestState {
  banks: any[]
  selectedBankId: number | null
  services: BankService[]
  selectedServices: SelectedService[]
  commonFormConfig: FormConfig | null
  serviceFormConfigs: Record<string, FormConfig>
  requests: ServiceRequest[]
  currentRequests: ServiceRequest[]
  step: 'bank' | 'service' | 'customer' | 'form' | 'done'
  loading: boolean
  commonFormLoading: boolean
  serviceFormsLoading: boolean
  submitting: boolean
  submitResults: { success: boolean; serviceName: string; error?: string }[]
  pdfGenerating: boolean
  error: string | null
  customerSearchResults: CustomerSearchResult[]
  customerSearchLoading: boolean
  selectedCustomer: CustomerSearchResult | null
  updating: boolean
}

const initialState: ServiceRequestState = {
  banks: [],
  selectedBankId: null,
  services: [],
  selectedServices: [],
  commonFormConfig: null,
  serviceFormConfigs: {},
  requests: [],
  currentRequests: [],
  step: 'bank',
  loading: false,
  commonFormLoading: false,
  serviceFormsLoading: false,
  submitting: false,
  submitResults: [],
  pdfGenerating: false,
  error: null,
  customerSearchResults: [],
  customerSearchLoading: false,
  selectedCustomer: null,
  updating: false,
}

export const fetchBanks = createAsyncThunk(
  'serviceRequest/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/public/banks')
      return res.data?.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch banks')
    }
  }
)

export const fetchServicesForBank = createAsyncThunk(
  'serviceRequest/fetchServicesForBank',
  async (bankId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/banks/${bankId}/services`)
      return res.data?.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch services')
    }
  }
)

export const fetchCommonFormConfig = createAsyncThunk(
  'serviceRequest/fetchCommonFormConfig',
  async (bankId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/banks/${bankId}/common-form`)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch common form')
    }
  }
)

export const fetchFormConfig = createAsyncThunk(
  'serviceRequest/fetchFormConfig',
  async (bankServiceId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/bank-services/${bankServiceId}/form`)
      const result = res.data?.data ? { bankServiceId, ...res.data.data } : null
      return result
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch form config')
    }
  }
)

export const submitServiceRequest = createAsyncThunk(
  'serviceRequest/submitServiceRequest',
  async (payload: { bankId: number; serviceId: number; customerId?: number; requestData: Record<string, any> }, { rejectWithValue }) => {
    try {
      const res = await api.post(API_BASE, payload)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to submit request')
    }
  }
)

export const updateServiceRequest = createAsyncThunk(
  'serviceRequest/updateServiceRequest',
  async (payload: { id: string; requestData: Record<string, any> }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_BASE}/${payload.id}`, { requestData: payload.requestData })
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to update request')
    }
  }
)

export const fetchMyServiceRequests = createAsyncThunk(
  'serviceRequest/fetchMyServiceRequests',
  async (params: { status?: string } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(API_BASE, { params })
      return res.data?.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch requests')
    }
  }
)

export const generatePDF = createAsyncThunk(
  'serviceRequest/generatePDF',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`${API_BASE}/${requestId}/generate-pdf`)
      return { requestId, ...res.data?.data }
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'PDF generation failed')
    }
  }
)

export const searchCustomers = createAsyncThunk(
  'serviceRequest/searchCustomers',
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await api.get('/csp/customers/search', { params: { q: query } })
      return res.data?.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to search customers')
    }
  }
)

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<'bank' | 'service' | 'customer' | 'form' | 'done'>) {
      state.step = action.payload
    },
    selectBank(state, action: PayloadAction<number>) {
      state.selectedBankId = action.payload
      state.selectedServices = []
      state.commonFormConfig = null
      state.serviceFormConfigs = {}
      state.services = []
      state.currentRequests = []
      state.submitResults = []
      state.selectedCustomer = null
      state.customerSearchResults = []
    },
    toggleService(state, action: PayloadAction<SelectedService>) {
      const idx = state.selectedServices.findIndex(
        (s) => s.bankServiceId === action.payload.bankServiceId
      )
      if (idx >= 0) {
        state.selectedServices.splice(idx, 1)
      } else {
        state.selectedServices.push(action.payload)
      }
    },
    clearSelectedServices(state) {
      state.selectedServices = []
    },
    selectCustomer(state, action: PayloadAction<CustomerSearchResult | null>) {
      state.selectedCustomer = action.payload
    },
    clearCustomerSearch(state) {
      state.customerSearchResults = []
    },
    resetForm(state) {
      state.selectedServices = []
      state.commonFormConfig = null
      state.serviceFormConfigs = {}
      state.services = []
      state.currentRequests = []
      state.submitResults = []
      state.selectedCustomer = null
      state.customerSearchResults = []
      state.step = 'bank'
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanks.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchBanks.fulfilled, (state, action) => {
        state.loading = false; state.banks = action.payload
      })
      .addCase(fetchBanks.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })

      .addCase(fetchServicesForBank.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchServicesForBank.fulfilled, (state, action) => {
        state.loading = false; state.services = action.payload
      })
      .addCase(fetchServicesForBank.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })

      .addCase(fetchCommonFormConfig.pending, (state) => { state.commonFormLoading = true; state.error = null })
      .addCase(fetchCommonFormConfig.fulfilled, (state, action) => {
        state.commonFormLoading = false
        state.commonFormConfig = action.payload?.formConfig || null
      })
      .addCase(fetchCommonFormConfig.rejected, (state, action) => {
        state.commonFormLoading = false; state.error = action.payload as string
      })

      .addCase(fetchFormConfig.pending, (state) => {
        state.serviceFormsLoading = true; state.error = null
      })
      .addCase(fetchFormConfig.fulfilled, (state, action) => {
        state.serviceFormsLoading = false
        const bsid = String(action.payload?.bankServiceId)
        if (action.payload?.formConfig) {
          state.serviceFormConfigs[bsid] = action.payload.formConfig
        }
      })
      .addCase(fetchFormConfig.rejected, (state, action) => {
        state.serviceFormsLoading = false; state.error = action.payload as string
      })

      .addCase(submitServiceRequest.pending, (state) => { state.submitting = true; state.error = null })
      .addCase(submitServiceRequest.fulfilled, (state, action) => {
        state.submitting = false
        state.currentRequests.push(action.payload)
      })
      .addCase(submitServiceRequest.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })

      .addCase(updateServiceRequest.pending, (state) => { state.updating = true; state.error = null })
      .addCase(updateServiceRequest.fulfilled, (state, action) => {
        state.updating = false
        const updated = action.payload
        if (updated) {
          const idx = state.requests.findIndex((r) => r.id === updated.id)
          if (idx >= 0) state.requests[idx] = updated
          const cIdx = state.currentRequests.findIndex((r) => r.id === updated.id)
          if (cIdx >= 0) state.currentRequests[cIdx] = updated
        }
      })
      .addCase(updateServiceRequest.rejected, (state, action) => {
        state.updating = false
        state.error = action.payload as string
      })

      .addCase(fetchMyServiceRequests.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchMyServiceRequests.fulfilled, (state, action) => {
        state.loading = false; state.requests = action.payload
      })
      .addCase(fetchMyServiceRequests.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string
      })

      .addCase(generatePDF.pending, (state) => { state.pdfGenerating = true; state.error = null })
      .addCase(generatePDF.fulfilled, (state, action) => {
        state.pdfGenerating = false
        const updated = state.currentRequests.find((r) => r.id === action.payload.requestId)
        if (updated) {
          updated.pdf_generated = true
          updated.pdf_file_path = action.payload.fileName
        }
        const histIdx = state.requests.findIndex((r) => r.id === action.payload.requestId)
        if (histIdx >= 0) {
          state.requests[histIdx].pdf_generated = true
          state.requests[histIdx].pdf_file_path = action.payload.fileName
        }
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.pdfGenerating = false; state.error = action.payload as string
      })

      .addCase(searchCustomers.pending, (state) => { state.customerSearchLoading = true; state.error = null })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.customerSearchLoading = false
        state.customerSearchResults = action.payload
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.customerSearchLoading = false; state.error = action.payload as string
      })
  },
})

export const { setStep, selectBank, toggleService, clearSelectedServices, selectCustomer, clearCustomerSearch, resetForm, clearError } = serviceRequestSlice.actions
export default serviceRequestSlice.reducer
