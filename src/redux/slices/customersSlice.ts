import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface Customer {
  id: number;
  name: string;
  mobile: string;
  account_number: string;
  account_type: string;
  ifsc: string;
  opening_balance: string;
  photo_url: string;
  aadhar_number: string;
  address: string;
  pin_code: string;
  created_at: string;
  bank_name: string;
  bank_code: string;
  branch_name: string | null;
}

export interface MappedCustomer {
  id: number;
  name: string;
  mobile: string;
  account_number: string;
  accountShort: string;
  bank: string;
  type: "Savings" | "Current" | "Jan Dhan";
  lastPrint: string;
  fetchedAt: string;
}

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
  errors?: any[];
}

export interface Branch {
  id: number;
  name: string;
  ifsc?: string;
  city?: string;
  state?: string;
}

export interface CreateCustomerPayload {
  name: string;
  mobile: string;
  account_number?: string;
  account_type?: string;
  ifsc?: string;
  bank_id?: number;
  branch_id?: number;
  opening_balance?: number;
  aadhar_number?: string;
  address?: string;
  pin_code?: string;
}

export interface FetchCustomersParams {
  page?: number;
  search?: string;
  limit?: number;
}

export interface UpdateCustomerPayload {
  id: number;
  name?: string;
  mobile?: string;
  account_number?: string;
  account_type?: string;
  ifsc?: string;
  bank_id?: number;
  branch_id?: number;
  opening_balance?: number;
  aadhar_number?: string;
  address?: string;
  pin_code?: string;
}

interface CustomersState {
  list: Customer[];
  mappedList: MappedCustomer[];
  total: number;
  meta: ApiMeta | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
  branches: Branch[];
  branchesLoading: boolean;
  branchesError: string | null;
}

const initialState: CustomersState = {
  list: [],
  mappedList: [],
  total: 0,
  meta: null,
  loading: false,
  error: null,
  creating: false,
  createError: null,
  branches: [],
  branchesLoading: false,
  branchesError: null,
};

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("csp_access_token");
};

let abortController: AbortController | null = null;

export const fetchCustomers = createAsyncThunk<
  ApiResponse<Customer[]>,
  FetchCustomersParams | undefined,
  { rejectValue: string }
>("customers/fetchAll", async (params = {}, { rejectWithValue }) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found. Please login again.");

    const url = new URL(`${API_BASE_URL}/csp/customers`);
    url.searchParams.set("page", String(params.page || 1));
    url.searchParams.set("limit", String(params.limit || 20));
    if (typeof params.search === "string" && params.search.trim()) {
      url.searchParams.set("search", params.search.trim());
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      signal: abortController.signal,
    });

    const data: ApiResponse<Customer[]> = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || `HTTP ${response.status}`);

    abortController = null;
    return data;
  } catch (error: any) {
    abortController = null;
    if (error.name === "AbortError") return rejectWithValue("__CANCELLED__");
    return rejectWithValue(error.message || "Failed to fetch customers");
  }
});

export const createCustomer = createAsyncThunk<
  ApiResponse<Customer>,
  CreateCustomerPayload,
  { rejectValue: string }
>("customers/create", async (customerData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found. Please login again.");

    const response = await fetch(`${API_BASE_URL}/csp/customers`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    const data: ApiResponse<Customer> = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to create customer");
  }
});

export const fetchBranchesByBankId = createAsyncThunk<
  Branch[],
  number,
  { rejectValue: string }
>("customers/fetchBranches", async (bankId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/public/banks/${bankId}/branches`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data: ApiResponse<Branch[]> = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || `HTTP ${response.status}`);
    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch branches");
  }
});

export const updateCustomer = createAsyncThunk<
  ApiResponse<Customer>,
  UpdateCustomerPayload,
  { rejectValue: string }
>("customers/update", async (customerData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found. Please login again.");

    const response = await fetch(`${API_BASE_URL}/csp/customers/${customerData.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    const data: ApiResponse<Customer> = await response.json();
    if (!response.ok || data.success === false) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update customer");
  }
});

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearList: (state) => {
      state.list = [];
      state.mappedList = [];
      state.total = 0;
      state.meta = null;
    },
    setMappedList: (state, action: PayloadAction<MappedCustomer[]>) => {
      state.mappedList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<ApiResponse<Customer[]>>) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.meta = action.payload.meta || null;
        state.total = action.payload.meta?.total || 0;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "__CANCELLED__") {
          state.error = action.payload || "Failed to fetch customers";
        }
      })
      .addCase(createCustomer.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action: PayloadAction<ApiResponse<Customer>>) => {
        state.creating = false;
        state.createError = null;
        state.list.unshift(action.payload.data);
        state.total += 1;
        if (state.meta) state.meta.total += 1;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || "Failed to create customer";
      })
      .addCase(fetchBranchesByBankId.pending, (state) => {
        state.branches = [];
        state.branchesLoading = true;
        state.branchesError = null;
      })
      .addCase(fetchBranchesByBankId.fulfilled, (state, action: PayloadAction<Branch[]>) => {
        state.branchesLoading = false;
        state.branches = action.payload;
        state.branchesError = null;
      })
      .addCase(fetchBranchesByBankId.rejected, (state, action) => {
        state.branchesLoading = false;
        state.branchesError = action.payload || "Failed to fetch branches";
      })
      .addCase(updateCustomer.fulfilled, (state, action: PayloadAction<ApiResponse<Customer>>) => {
        const updated = action.payload.data;
        const idx = state.list.findIndex((c) => c.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
      });
  },
});

export const { clearError, clearList, setMappedList } = customersSlice.actions;
export default customersSlice.reducer;