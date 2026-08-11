import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import api from '@/utils/axios'

const API_BASE = '/csp/apy'

export interface CustomerSearchResult {
  id: number
  name: string
  mobile: string
  account_number: string
  aadhar_number: string
  address: string
  pin_code: string
  bank_id: number
  branch_id?: number | null
  bank_name: string
  bank_code: string
  branch_name: string
  title?: string
  dob?: string
  place_of_birth?: string
  nominee_name?: string
  nominee_relation?: string
  nominee_dob?: string
  nominee_address?: string
  nominee_aadhaar?: string
  pran_number?: string | null
}

export interface ApySubscription {
  id: string
  user_id: number
  customer_id: number | null
  bank_id: number
  branch_id: number | null
  status: string
  full_name: string
  date_of_birth: string | null
  age: number | null
  mobile: string | null
  email: string | null
  aadhaar: string | null
  account_number: string | null
  title: string | null
  is_married: boolean
  spouse_name: string | null
  spouse_aadhaar: string | null
  nominee_name: string | null
  nominee_aadhaar: string | null
  nominee_relation: string | null
  nominee_dob: string | null
  guardian_name: string | null
  has_other_social_schemes: boolean
  is_income_tax_payer: boolean
  is_fatca_applicable: boolean
  contribution_frequency: string | null
  pension_amount: number | null
  contribution_amount: number | null
  declaration_date: string | null
  declaration_place: string | null
  signature_image: string | null
  pran_number: string | null
  pdf_generated: boolean
  pdf_file_path: string | null
  submitted_at: string
  created_at: string
  updated_at: string
  bank_name?: string
  bank_code?: string
  customer_name?: string
  customer_mobile?: string
}

export interface ApyFormData {
  customerId: number | null
  bankId: number | null
  branchId: number | null
  title: string
  fullName: string
  dateOfBirth: string
  age: string
  mobile: string
  email: string
  aadhaar: string
  isMarried: boolean
  spouseName: string
  spouseAadhaar: string
  nomineeName: string
  nomineeAadhaar: string
  nomineeRelation: string
  nomineeDob: string
  nomineeAddress: string
  guardianName: string
  hasOtherSocialSchemes: boolean
  isIncomeTaxPayer: boolean
  isFatcaApplicable: boolean
  contributionFrequency: string
  pensionAmount: string
  contributionAmount: string
  declarationDate: string
  declarationPlace: string
  pranNumber: string
}

const initialFormData: ApyFormData = {
  customerId: null,
  bankId: null,
  branchId: null,
  title: '',
  fullName: '',
  dateOfBirth: '',
  age: '',
  mobile: '',
  email: '',
  aadhaar: '',
  isMarried: false,
  spouseName: '',
  spouseAadhaar: '',
  nomineeName: '',
  nomineeAadhaar: '',
  nomineeRelation: '',
  nomineeDob: '',
  nomineeAddress: '',
  guardianName: '',
  hasOtherSocialSchemes: false,
  isIncomeTaxPayer: false,
  isFatcaApplicable: false,
  contributionFrequency: '',
  pensionAmount: '',
  contributionAmount: '',
  declarationDate: '',
  declarationPlace: '',
  pranNumber: '',
}

interface ApyState {
  step: 'customer' | 'form' | 'review' | 'done'
  customerSearchResults: CustomerSearchResult[]
  customerSearchLoading: boolean
  selectedCustomer: CustomerSearchResult | null
  formData: ApyFormData
  submitting: boolean
  submitResult: ApySubscription | null
  currentRequest: ApySubscription | null
  requests: ApySubscription[]
  requestsLoading: boolean
  editId: string | null
  editLoading: boolean
  error: string | null
}

const initialState: ApyState = {
  step: 'customer',
  customerSearchResults: [],
  customerSearchLoading: false,
  selectedCustomer: null,
  formData: { ...initialFormData },
  submitting: false,
  submitResult: null,
  currentRequest: null,
  requests: [],
  requestsLoading: false,
  editId: null,
  editLoading: false,
  error: null,
}

export const searchCustomers = createAsyncThunk(
  'apy/searchCustomers',
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/customer/search`, { params: { q: query } })
      return res.data?.data || []
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to search customers')
    }
  }
)

export const fetchCustomerApplicationDetails = createAsyncThunk(
  'apy/fetchCustomerApplicationDetails',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/customer/${customerId}/application-details`)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch customer details')
    }
  }
)

export const submitApySubscription = createAsyncThunk(
  'apy/submitApySubscription',
  async (payload: Record<string, any>, { rejectWithValue }) => {
    try {
      const res = await api.post(API_BASE, payload)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to submit APY subscription')
    }
  }
)

export const fetchApySubscription = createAsyncThunk(
  'apy/fetchApySubscription',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`${API_BASE}/${id}`)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch APY subscription')
    }
  }
)

export const updateApySubscription = createAsyncThunk(
  'apy/updateApySubscription',
  async (payload: { id: string; data: Record<string, any> }, { rejectWithValue }) => {
    try {
      const res = await api.put(`${API_BASE}/${payload.id}`, payload.data)
      return res.data?.data || null
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to update APY subscription')
    }
  }
)

function mapSubscriptionToFormData(sub: ApySubscription): ApyFormData {
  return {
    customerId: sub.customer_id,
    bankId: sub.bank_id || null,
    branchId: sub.branch_id || null,
    title: sub.title || '',
    fullName: sub.full_name || '',
    dateOfBirth: sub.date_of_birth ? sub.date_of_birth.split('T')[0] : '',
    age: sub.age ? String(sub.age) : '',
    mobile: sub.mobile || '',
    email: sub.email || '',
    aadhaar: sub.aadhaar || '',
    isMarried: sub.is_married || false,
    spouseName: sub.spouse_name || '',
    spouseAadhaar: sub.spouse_aadhaar || '',
    nomineeName: sub.nominee_name || '',
    nomineeAadhaar: sub.nominee_aadhaar || '',
    nomineeRelation: sub.nominee_relation || '',
    nomineeDob: sub.nominee_dob ? sub.nominee_dob.split('T')[0] : '',
    nomineeAddress: (sub as any).nominee_address || '',
    guardianName: sub.guardian_name || '',
    hasOtherSocialSchemes: sub.has_other_social_schemes || false,
    isIncomeTaxPayer: sub.is_income_tax_payer || false,
    isFatcaApplicable: sub.is_fatca_applicable || false,
    contributionFrequency: sub.contribution_frequency || '',
    pensionAmount: sub.pension_amount ? String(sub.pension_amount) : '',
    contributionAmount: sub.contribution_amount ? String(sub.contribution_amount) : '',
    declarationDate: sub.declaration_date ? sub.declaration_date.split('T')[0] : '',
    declarationPlace: sub.declaration_place || '',
    pranNumber: sub.pran_number || '',
  }
}

const apySlice = createSlice({
  name: 'apy',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<'customer' | 'form' | 'review' | 'done'>) {
      state.step = action.payload
    },
    selectCustomer(state, action: PayloadAction<CustomerSearchResult | null>) {
      state.selectedCustomer = action.payload
      if (action.payload) {
        const c = action.payload
        state.formData.customerId = c.id
        state.formData.fullName = c.name || ''
        state.formData.mobile = c.mobile || ''
        state.formData.aadhaar = c.aadhar_number || ''
        if (c.title) {
          const t = c.title.toUpperCase().replace(/[^A-Z.]/g, '')
          if (t === 'MR' || t === 'MR.') state.formData.title = 'Mr.'
          else if (t === 'MS' || t === 'MS.' || t === 'MRS' || t === 'MRS.') state.formData.title = 'Ms.'
          else if (t === 'DR' || t === 'DR.') state.formData.title = 'Dr.'
          else state.formData.title = c.title
        }
        if (c.dob) {
          state.formData.dateOfBirth = c.dob.split('T')[0]
          const birth = new Date(c.dob)
          const today = new Date()
          let age = today.getFullYear() - birth.getFullYear()
          const m = today.getMonth() - birth.getMonth()
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
          state.formData.age = String(age)
        }
        if (c.place_of_birth) state.formData.declarationPlace = c.place_of_birth
        if (c.nominee_name) state.formData.nomineeName = c.nominee_name
        if (c.nominee_relation) {
          const rel = c.nominee_relation
          state.formData.nomineeRelation = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase()
        }
        if (c.nominee_dob) state.formData.nomineeDob = c.nominee_dob.split('T')[0]
        if (c.nominee_address) state.formData.nomineeAddress = c.nominee_address
        if (c.pran_number) state.formData.pranNumber = c.pran_number
      }
    },
    clearCustomerSearch(state) {
      state.customerSearchResults = []
    },
    updateFormData(state, action: PayloadAction<Partial<ApyFormData>>) {
      state.formData = { ...state.formData, ...action.payload }
    },
    setEditId(state, action: PayloadAction<string | null>) {
      state.editId = action.payload
    },
    setEditLoading(state, action: PayloadAction<boolean>) {
      state.editLoading = action.payload
    },
    resetForm(state) {
      state.step = 'customer'
      state.formData = { ...initialFormData }
      state.submitResult = null
      state.currentRequest = null
      state.selectedCustomer = null
      state.customerSearchResults = []
      state.editId = null
      state.editLoading = false
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCustomers.pending, (state) => {
        state.customerSearchLoading = true
        state.error = null
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.customerSearchLoading = false
        state.customerSearchResults = action.payload
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.customerSearchLoading = false
        state.error = action.payload as string
      })

      .addCase(submitApySubscription.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(submitApySubscription.fulfilled, (state, action) => {
        state.submitting = false
        state.submitResult = action.payload
        state.currentRequest = action.payload
      })
      .addCase(submitApySubscription.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })

      .addCase(fetchApySubscription.pending, (state) => {
        state.editLoading = true
        state.error = null
      })
      .addCase(fetchApySubscription.fulfilled, (state, action) => {
        state.editLoading = false
        state.currentRequest = action.payload
        state.formData = mapSubscriptionToFormData(action.payload)
      })
      .addCase(fetchApySubscription.rejected, (state, action) => {
        state.editLoading = false
        state.error = action.payload as string
      })

      .addCase(updateApySubscription.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(updateApySubscription.fulfilled, (state, action) => {
        state.submitting = false
        state.submitResult = action.payload
        state.currentRequest = action.payload
      })
      .addCase(updateApySubscription.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })

      .addCase(fetchCustomerApplicationDetails.fulfilled, (state, action) => {
        const app = action.payload
        if (app && state.selectedCustomer) {
          state.selectedCustomer = {
            ...state.selectedCustomer,
            title: app.title || state.selectedCustomer.title,
            dob: app.dob || state.selectedCustomer.dob,
            place_of_birth: app.place_of_birth || state.selectedCustomer.place_of_birth,
            nominee_name: app.nominee_name || state.selectedCustomer.nominee_name,
            nominee_relation: app.nominee_relation || state.selectedCustomer.nominee_relation,
            nominee_dob: app.nominee_dob || state.selectedCustomer.nominee_dob,
            nominee_address: app.nominee_address ||
              [app.nominee_house_no, app.nominee_street, app.nominee_landmark,
               app.nominee_city, app.nominee_district, app.nominee_state, app.nominee_pin]
                .filter(Boolean).join(', ') || state.selectedCustomer.nominee_address,
          }

          const c = state.selectedCustomer
          if (app.title && !state.formData.title) {
            const t = app.title.toUpperCase().replace(/[^A-Z.]/g, '')
            if (t === 'MR' || t === 'MR.') state.formData.title = 'Mr.'
            else if (t === 'MS' || t === 'MS.' || t === 'MRS' || t === 'MRS.') state.formData.title = 'Ms.'
            else if (t === 'DR' || t === 'DR.') state.formData.title = 'Dr.'
            else state.formData.title = app.title
          }
          if (app.email && !state.formData.email) state.formData.email = app.email
          if (app.dob && !state.formData.dateOfBirth) {
            state.formData.dateOfBirth = app.dob.split('T')[0]
            const birth = new Date(app.dob)
            const today = new Date()
            let age = today.getFullYear() - birth.getFullYear()
            const m = today.getMonth() - birth.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
            state.formData.age = String(age)
          }
          if (app.place_of_birth && !state.formData.declarationPlace) state.formData.declarationPlace = app.place_of_birth
          if (app.nominee_name && !state.formData.nomineeName) state.formData.nomineeName = app.nominee_name
          if (app.nominee_relation && !state.formData.nomineeRelation) {
            const rel = app.nominee_relation
            state.formData.nomineeRelation = rel.charAt(0).toUpperCase() + rel.slice(1).toLowerCase()
          }
          if (app.nominee_dob && !state.formData.nomineeDob) state.formData.nomineeDob = app.nominee_dob.split('T')[0]
          if (app.nominee_address && !state.formData.nomineeAddress) state.formData.nomineeAddress = app.nominee_address
          if (app.pran_number && !state.formData.pranNumber) state.formData.pranNumber = app.pran_number
        }
      })
  },
})

export const {
  setStep,
  selectCustomer,
  clearCustomerSearch,
  updateFormData,
  setEditId,
  setEditLoading,
  resetForm,
  clearError,
} = apySlice.actions

export default apySlice.reducer
