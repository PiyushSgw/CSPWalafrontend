import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ActiveTab = 'new' | 'history';

export interface AccountOpeningFormData {
  customer_id: number | null;
  bank_id: number | null;
  branch_id: number | null;
  account_type: string;
  full_name: string;
  father_name: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  aadhaar: string;
  pan: string;
  occupation: string;
  income: string;
  nominee_name: string;
  nominee_relation: string;
  nominee_dob: string;
  nominee_mobile: string;
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
  data: {
    id?: string | number;
    created_at?: string;
    bank_name?: string;
  } & Partial<AccountOpeningFormData>;
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
    full_name: '',
    father_name: '',
    dob: '',
    gender: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    aadhaar: '',
    pan: '',
    occupation: '',
    income: '',
    nominee_name: '',
    nominee_relation: '',
    nominee_dob: '',
    nominee_mobile: '',
    include_passbook: false,
    status: 'draft',
    photo_url: '',
    signature_url: '',
  },
  history: [],
};

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('csp_access_token');
};

const getFilenameFromDisposition = (contentDisposition?: string) => {
  if (!contentDisposition) return 'application.pdf';

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }

  const asciiMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return 'application.pdf';
};

export const generatePreview = createAsyncThunk<
  { message: string },
  AccountOpeningFormData,
  { rejectValue: string }
>('accountOpening/generatePreview', async (_, { rejectWithValue }) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { message: 'Preview generated successfully' };
  } catch {
    return rejectWithValue('Failed to generate preview');
  }
});

export const createApplication = createAsyncThunk<
  CreateApplicationResponse,
  AccountOpeningFormData,
  { rejectValue: string }
>('accountOpening/createApplication', async (payload, { rejectWithValue }) => {
  try {
    const token = getAuthToken();

    if (!token) {
      return rejectWithValue('No auth token found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/csp/applications`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data: CreateApplicationResponse | null = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401) {
        return rejectWithValue('Unauthorized. Token missing or invalid.');
      }

      if (response.status === 403) {
        return rejectWithValue('Forbidden. You do not have access.');
      }

      if (response.status === 404) {
        return rejectWithValue('API route not found.');
      }

      return rejectWithValue(
        data?.message || `Request failed with status ${response.status}`
      );
    }

    if (!data) {
      return rejectWithValue('Invalid server response');
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Network error while creating application'
    );
  }
});

export const downloadApplicationPdf = createAsyncThunk<
  { success: true; filename: string },
  number | string,
  { rejectValue: string }
>('accountOpening/downloadApplicationPdf', async (applicationId, { rejectWithValue }) => {
  try {
    const token = getAuthToken();

    if (!token) {
      return rejectWithValue('No auth token found. Please login again.');
    }

    const response = await axios.get(
      `${API_BASE_URL}/csp/applications/${applicationId}/pdf`,
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('pdf')) {
      return rejectWithValue('Server did not return a PDF file.');
    }

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = window.URL.createObjectURL(blob);

    const contentDisposition = response.headers['content-disposition'];
    const filename = getFilenameFromDisposition(contentDisposition);

    const link = document.createElement('a');
    link.href = fileURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(fileURL);

    return { success: true, filename };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      return rejectWithValue('Unauthorized. Token missing or invalid.');
    }

    if (error?.response?.status === 403) {
      return rejectWithValue('Forbidden. You do not have access.');
    }

    if (error?.response?.status === 404) {
      return rejectWithValue('Application PDF not found.');
    }

    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'PDF generation failed'
    );
  }
});

const accountOpeningSlice = createSlice({
  name: 'accountOpening',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<ActiveTab>) {
      state.activeTab = action.payload;
    },

    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },

    setSelectedBank(
      state,
      action: PayloadAction<{ bankName: string; bankId: number }>
    ) {
      state.selectedBank = action.payload.bankName;
      state.formData.bank_id = action.payload.bankId;
    },

    setSelectedType(
      state,
      action: PayloadAction<{ label: string; value: string }>
    ) {
      state.selectedType = action.payload.value;
      state.formData.account_type = action.payload.value;
    },

    setCustomerNotFound(state, action: PayloadAction<boolean>) {
      state.customerNotFound = action.payload;
    },

    setCustomerId(state, action: PayloadAction<number | null>) {
      state.formData.customer_id = action.payload;
    },

    setBankId(state, action: PayloadAction<number | null>) {
      state.formData.bank_id = action.payload;
    },

    setBranchId(state, action: PayloadAction<number | null>) {
      state.formData.branch_id = action.payload;
    },

    updateFormField<K extends keyof AccountOpeningFormData>(
      state: AccountOpeningState,
      action: PayloadAction<{
        field: K;
        value: AccountOpeningFormData[K];
      }>
    ) {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },

    resetSubmitState(state) {
      state.previewError = null;
      state.submitError = null;
      state.submitSuccess = null;
      state.pdfError = null;
    },

    resetCustomerLookup(state) {
      state.customerNotFound = false;
      state.formData.customer_id = null;
    },

    setCustomerLookupStatus(state, action: PayloadAction<boolean>) {
      state.customerNotFound = action.payload;
    },

    addHistoryItem(state, action: PayloadAction<AccountOpeningHistoryItem>) {
      state.history.unshift(action.payload);
    },

    resetAccountOpeningState() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(generatePreview.pending, (state) => {
        state.previewLoading = true;
        state.previewError = null;
      })
      .addCase(generatePreview.fulfilled, (state) => {
        state.previewLoading = false;
      })
      .addCase(generatePreview.rejected, (state, action) => {
        state.previewLoading = false;
        state.previewError =
          action.payload ?? action.error.message ?? 'Preview failed';
      })

      .addCase(createApplication.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = null;
      })

      .addCase(createApplication.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = action.payload.message;

        const savedData = action.payload.data || {};

        state.history.unshift({
          id: String(savedData.id ?? Date.now()),
          created_at: savedData.created_at ?? new Date().toISOString(),
          bank_name: savedData.bank_name ?? state.selectedBank,
          customer_id: savedData.customer_id ?? state.formData.customer_id,
          bank_id: savedData.bank_id ?? state.formData.bank_id,
          branch_id: savedData.branch_id ?? state.formData.branch_id,
          account_type: savedData.account_type ?? state.formData.account_type,
          full_name: savedData.full_name ?? state.formData.full_name,
          father_name: savedData.father_name ?? state.formData.father_name,
          dob: savedData.dob ?? state.formData.dob,
          gender: savedData.gender ?? state.formData.gender,
          mobile: savedData.mobile ?? state.formData.mobile,
          email: savedData.email ?? state.formData.email,
          address: savedData.address ?? state.formData.address,
          city: savedData.city ?? state.formData.city,
          state: savedData.state ?? state.formData.state,
          pin: savedData.pin ?? state.formData.pin,
          aadhaar: savedData.aadhaar ?? state.formData.aadhaar,
          pan: savedData.pan ?? state.formData.pan,
          occupation: savedData.occupation ?? state.formData.occupation,
          income: savedData.income ?? state.formData.income,
          nominee_name: savedData.nominee_name ?? state.formData.nominee_name,
          nominee_relation:
            savedData.nominee_relation ?? state.formData.nominee_relation,
          nominee_dob: savedData.nominee_dob ?? state.formData.nominee_dob,
          nominee_mobile:
            savedData.nominee_mobile ?? state.formData.nominee_mobile,
          include_passbook:
            savedData.include_passbook ?? state.formData.include_passbook,
          status: savedData.status ?? state.formData.status,
          photo_url: savedData.photo_url ?? state.formData.photo_url,
          signature_url:
            savedData.signature_url ?? state.formData.signature_url,
        });
      })

      .addCase(createApplication.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError =
          action.payload ?? action.error.message ?? 'Submission failed';
      })

      .addCase(downloadApplicationPdf.pending, (state) => {
        state.pdfLoading = true;
        state.pdfError = null;
      })
      .addCase(downloadApplicationPdf.fulfilled, (state) => {
        state.pdfLoading = false;
      })
      .addCase(downloadApplicationPdf.rejected, (state, action) => {
        state.pdfLoading = false;
        state.pdfError =
          action.payload ?? action.error.message ?? 'PDF download failed';
      });
  },
});

export const {
  setActiveTab,
  setStep,
  setSelectedBank,
  setSelectedType,
  setCustomerNotFound,
  setCustomerId,
  setBankId,
  setBranchId,
  updateFormField,
  resetSubmitState,
  resetCustomerLookup,
  setCustomerLookupStatus,
  addHistoryItem,
  resetAccountOpeningState,
} = accountOpeningSlice.actions;

export default accountOpeningSlice.reducer;