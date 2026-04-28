import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/utils/axios'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export type ActiveTab = 'new' | 'history';

export interface AccountOpeningFormData {
  customer_id: number | null;
  bank_id: number | null;
  branch_id: number | null;
  account_type: string;

  // Personal Details
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  marital_status: string;
  father_name: string;
  mother_name: string;
  dob: string;
  gender: string;
  category: string;
  religion: string;
  education: string;
  occupation: string;
  annual_income: string;
  net_worth: string;
  email: string;
  mobile: string;

  // Identity Details
  pan_available: string;
  proof_of_identity: string;
  document_no: string;
  aadhaar: string;
  pan: string;

  // Address
  same_address: boolean;
  address_line1: string;
  address_line2: string;
  city: string;
  pin: string;
  district: string;
  state: string;
  country: string;
  address: string;

  // Nomination
  nominee_name: string;
  nominee_mobile: string;
  nominee_relation: string;
  nominee_address: string;
  nominee_age: string;
  nominee_dob: string;

  // Optional Details
  ckyc_number: string;
  date: string;
  permanent_address_type: string;
  nationality: string;
  person_with_disability: string;
  tax_residency_india_only: string;
  politically_exposed: string;
  printer_type: string;
  place_of_birth: string;

  // Services
  cheque_book: boolean;
  atm_card_required: boolean;

  // Bank Use
  branch_code: string;
  official_name: string;
  pf_number: string;
  designation: string;
  account_number: string;
  branch_name: string;
  place: string;

  // Media
  include_passbook: boolean;
  status: string;
  photo_url: string;
  signature_url: string;
}

export interface AccountOpeningHistoryItem extends AccountOpeningFormData {
  id: string;
  created_at: string;
  bank_name: string;
}

export interface CreateApplicationResponse {
  message: string;
  data: { id?: string | number; created_at?: string; bank_name?: string } & Partial<AccountOpeningFormData>;
}

export interface AccountOpeningState {
  activeTab: ActiveTab;
  step: number;
  selectedBank: string;
  selectedType: string;
  customerNotFound: boolean;
  previewLoading: boolean;
  previewError: string | null;
  submitLoading: boolean;
  submitError: string | null;
  submitSuccess: string | null;
  pdfLoading: boolean;
  pdfError: string | null;
  formData: AccountOpeningFormData;
  history: AccountOpeningHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
}

const initialState: AccountOpeningState = {
  activeTab: 'new',
  step: 1,
  selectedBank: '',
  selectedType: '',
  customerNotFound: false,
  previewLoading: false,
  previewError: null,
  submitLoading: false,
  submitError: null,
  submitSuccess: null,
  pdfLoading: false,
  pdfError: null,
  formData: {
    customer_id: null,
    bank_id: null,
    branch_id: null,
    account_type: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    marital_status: '',
    father_name: '',
    mother_name: '',
    dob: '',
    gender: '',
    category: '',
    religion: '',
    education: '',
    occupation: '',
    annual_income: '',
    net_worth: '',
    email: '',
    mobile: '',
    pan_available: 'NO',
    proof_of_identity: '',
    document_no: '',
    aadhaar: '',
    pan: '',
    same_address: true,
    address_line1: '',
    address_line2: '',
    city: '',
    pin: '',
    district: '',
    state: '',
    country: 'India',
    address: '',
    nominee_name: '',
    nominee_mobile: '',
    nominee_relation: 'FATHER',
    nominee_address: '',
    nominee_age: '',
    nominee_dob: '',
    ckyc_number: '',
    date: new Date().toISOString().split('T')[0],
    permanent_address_type: 'RESIDENTIAL/BUSINESS',
    nationality: 'INDIAN',
    person_with_disability: 'NO',
    tax_residency_india_only: 'YES',
    politically_exposed: 'NONE',
    printer_type: '',
    place_of_birth: '',
    cheque_book: false,
    atm_card_required: false,
    branch_code: '',
    official_name: '',
    pf_number: '',
    designation: '',
    account_number: '',
    branch_name: '',
    place: '',
    include_passbook: false,
    status: 'pending',
    photo_url: '',
    signature_url: '',
  },
  history: [],
  historyLoading: false,
  historyError: null,
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('csp_access_token');
};

const getFilenameFromDisposition = (contentDisposition?: string) => {
  if (!contentDisposition) return 'application.pdf';
  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) return asciiMatch[1];
  return 'application.pdf';
};

export const generatePreview = createAsyncThunk<{ message: string }, AccountOpeningFormData, { rejectValue: string }>(
  'accountOpening/generatePreview',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { message: 'Preview generated successfully' };
    } catch {
      return rejectWithValue('Failed to generate preview');
    }
  }
);

export const createApplication = createAsyncThunk<CreateApplicationResponse, AccountOpeningFormData, { rejectValue: string }>(
  'accountOpening/createApplication',
  async (payload, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue('No auth token found. Please login again.');
      const response = await fetch(`${API_BASE_URL}/csp/applications`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data: CreateApplicationResponse | null = null;
      try { data = await response.json(); } catch { data = null; }
      if (!response.ok) {
        if (response.status === 401) return rejectWithValue('Unauthorized. Token missing or invalid.');
        if (response.status === 403) return rejectWithValue('Forbidden. You do not have access.');
        if (response.status === 404) return rejectWithValue('API route not found.');
        return rejectWithValue(data?.message || `Request failed with status ${response.status}`);
      }
      if (!data) return rejectWithValue('Invalid server response');
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error while creating application');
    }
  }
);

export const downloadApplicationPdf = createAsyncThunk<{ success: true; filename: string }, number | string, { rejectValue: string }>(
  'accountOpening/downloadApplicationPdf',
  async (applicationId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      if (!token) return rejectWithValue('No auth token found. Please login again.');
      const response = await axios.get(`${API_BASE_URL}/csp/applications/${applicationId}/pdf`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = response.headers['content-type'];
      if (contentType && !contentType.includes('pdf')) return rejectWithValue('Server did not return a PDF file.');
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(blob);
      const filename = getFilenameFromDisposition(response.headers['content-disposition']);
      const link = document.createElement('a');
      link.href = fileURL; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(fileURL);
      return { success: true, filename };
    } catch (error: any) {
      if (error?.response?.status === 401) return rejectWithValue('Unauthorized. Token missing or invalid.');
      if (error?.response?.status === 403) return rejectWithValue('Forbidden. You do not have access.');
      if (error?.response?.status === 404) return rejectWithValue('Application PDF not found.');
      return rejectWithValue(error?.response?.data?.message || error?.message || 'PDF generation failed');
    }
  }
);

export const fetchApplicationHistory = createAsyncThunk(
  'accountOpening/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/csp/applications?limit=50')
      return data.data as AccountOpeningHistoryItem[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history')
    }
  }
);


const accountOpeningSlice = createSlice({
  name: 'accountOpening',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<ActiveTab>) { state.activeTab = action.payload; },
    setStep(state, action: PayloadAction<number>) { state.step = action.payload; },
    setSelectedBank(state, action: PayloadAction<{ bankName: string; bankId: number }>) {
      state.selectedBank = action.payload.bankName;
      state.formData.bank_id = action.payload.bankId;
    },
    setSelectedType(state, action: PayloadAction<{ label: string; value: string }>) {
      state.selectedType = action.payload.value;
      state.formData.account_type = action.payload.value;
    },
    setCustomerNotFound(state, action: PayloadAction<boolean>) { state.customerNotFound = action.payload; },
    setCustomerId(state, action: PayloadAction<number | null>) { state.formData.customer_id = action.payload; },
    setBankId(state, action: PayloadAction<number | null>) { state.formData.bank_id = action.payload; },
    setBranchId(state, action: PayloadAction<number | null>) { state.formData.branch_id = action.payload; },
    updateFormField<K extends keyof AccountOpeningFormData>(
      state: AccountOpeningState,
      action: PayloadAction<{ field: K; value: AccountOpeningFormData[K] }>
    ) { state.formData[action.payload.field] = action.payload.value; },
    resetSubmitState(state) { state.previewError = null; state.submitError = null; state.submitSuccess = null; state.pdfError = null; },
    resetCustomerLookup(state) { state.customerNotFound = false; state.formData.customer_id = null; },
    setCustomerLookupStatus(state, action: PayloadAction<boolean>) { state.customerNotFound = action.payload; },
    addHistoryItem(state, action: PayloadAction<AccountOpeningHistoryItem>) { state.history.unshift(action.payload); },
    resetAccountOpeningState() { return initialState; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatePreview.pending, (state) => { state.previewLoading = true; state.previewError = null; })
      .addCase(generatePreview.fulfilled, (state) => { state.previewLoading = false; })
      .addCase(generatePreview.rejected, (state, action) => { state.previewLoading = false; state.previewError = action.payload ?? action.error.message ?? 'Preview failed'; })
      .addCase(createApplication.pending, (state) => { state.submitLoading = true; state.submitError = null; state.submitSuccess = null; })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = action.payload.message;
        const d = action.payload.data || {};
        state.history.unshift({ id: String(d.id ?? Date.now()), created_at: d.created_at ?? new Date().toISOString(), bank_name: d.bank_name ?? state.selectedBank, ...state.formData, ...d } as AccountOpeningHistoryItem);
      })
      .addCase(createApplication.rejected, (state, action) => { state.submitLoading = false; state.submitError = action.payload ?? action.error.message ?? 'Submission failed'; })
      .addCase(downloadApplicationPdf.pending, (state) => { state.pdfLoading = true; state.pdfError = null; })
      .addCase(downloadApplicationPdf.fulfilled, (state) => { state.pdfLoading = false; })
      .addCase(downloadApplicationPdf.rejected, (state, action) => { state.pdfLoading = false; state.pdfError = action.payload ?? action.error.message ?? 'PDF download failed'; })
      .addCase(fetchApplicationHistory.pending, (state) => {
        state.historyLoading = true
        state.historyError = null
      })
      .addCase(fetchApplicationHistory.fulfilled, (state, action) => {
        state.historyLoading = false
        state.history = action.payload
      })
      .addCase(fetchApplicationHistory.rejected, (state, action) => {
        state.historyLoading = false
        state.historyError = (action.payload as string) ?? 'Failed to load history'
      })

  },
});

export const {
  setActiveTab, setStep, setSelectedBank, setSelectedType,
  setCustomerNotFound, setCustomerId, setBankId, setBranchId,
  updateFormField, resetSubmitState, resetCustomerLookup,
  setCustomerLookupStatus, addHistoryItem, resetAccountOpeningState,
} = accountOpeningSlice.actions;

export default accountOpeningSlice.reducer;