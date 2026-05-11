import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { handleAuthError } from "../../utils/authError";
import type {
  ApiResponse,
  PrintJob,
  MappedPrintJob,
  ApiMeta,
  FetchPrintHistoryParams,
  PrintStats,
} from "../../app/(main)/print-history/printHistory";

import api from "../../utils/axios";
const TOKEN_KEY = "csp_access_token";

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

const mapJobType = (t?: string): MappedPrintJob["type"] => {
  switch ((t || "").toLowerCase()) {
    case "passbook":
      return "Passbook";
    case "form":
      return "Form";
    case "combo":
      return "Combo";
    case "acct_form":
    case "acct form":
      return "Acct Form";
    case "jan_dhan":
    case "jan dhan":
      return "Jan Dhan";
    default:
      return "Passbook";
  }
};

const mapStatus = (s?: string): MappedPrintJob["status"] => {
  switch ((s || "").toLowerCase()) {
    case "completed":
    case "printed":
      return "Printed";
    case "failed":
      return "Failed";
    case "pending":
    case "processing":
      return "Pending";
    default:
      return "Printed";
  }
};

const getDefaultCharge = (jobType?: string): number => {
  switch ((jobType || "").toLowerCase()) {
    case "combo":
      return 13;
    case "form":
    case "acct_form":
    case "jan_dhan":
      return 10;
    case "passbook":
    default:
      return 0;
  }
};

const mapJob = (j: PrintJob): MappedPrintJob => {
  // Calculate charge: use API value if available and not zero, otherwise use default
  const apiCharge = Number(j.charge ?? 0);
  const defaultCharge = getDefaultCharge(j.job_type);
  const finalCharge = apiCharge > 0 ? apiCharge : defaultCharge;
  
  return {
    id: String(j.id ?? 0), // Keep as string for display but without # prefix
    jobId: `#${String(j.id ?? 0).padStart(6, "0")}`, // New field for formatted display

    // ✅ FIX: add required raw date field
    createdAtRaw: j.created_at ?? "",

    dateTime: j.created_at
      ? new Date(j.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",

    customer: j.customer_name || "—",
    bank: j.bank_code || j.bank_name || "—",
    type: mapJobType(j.job_type),
    pages: `${Number(j.pages ?? 0)} pg`,
    charge: `₹${finalCharge.toFixed(2)}`,
    rawCharge: finalCharge,
    status: mapStatus(j.status),
    isFree: Boolean(j.is_free),
  };
};

const calcStats = (list: PrintJob[]): PrintStats => ({
  totalJobs: list.length,
  totalPages: list.reduce((sum, j) => sum + (Number(j.pages) || 0), 0),
  totalCharge: list.reduce((sum, j) => sum + (Number(j.charge ?? 0) || 0), 0),
  freeJobs: list.filter((j) => Boolean(j.is_free)).length,
});

interface PrintHistoryState {
  list: PrintJob[];
  mappedList: MappedPrintJob[];
  stats: PrintStats;
  meta: ApiMeta | null;
  fetchedAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrintHistoryState = {
  list: [],
  mappedList: [],
  stats: {
    totalJobs: 0,
    totalPages: 0,
    totalCharge: 0,
    freeJobs: 0,
  },
  meta: null,
  fetchedAt: null,
  loading: false,
  error: null,
};

let ac: AbortController | null = null;

const normalizeHistoryArray = (raw: any): PrintJob[] => {
  if (Array.isArray(raw?.jobs)) return raw.jobs;
  if (Array.isArray(raw?.history)) return raw.history;
  if (Array.isArray(raw?.data?.jobs)) return raw.data.jobs;
  if (Array.isArray(raw?.data?.history)) return raw.data.history;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
};

export const fetchPrintHistory = createAsyncThunk<
  ApiResponse<PrintJob[]>,
  FetchPrintHistoryParams | undefined,
  { rejectValue: string }
>("printHistory/fetchAll", async (params = {}, { rejectWithValue }) => {
  ac?.abort();
  ac = new AbortController();

  try {
    const token = getToken();

    if (!token) {
      handleAuthError();
      return rejectWithValue("No auth token. Redirecting...");
    }

    const res = await api.get('/csp/passbook/history', { params });

    if (res.status === 401) {
      handleAuthError();
      return rejectWithValue("Unauthorized");
    }

    const normalized = normalizeHistoryArray(res.data);

    return res.data;
  } catch (e: unknown) {
    ac = null;

    if (e instanceof DOMException && e.name === "AbortError") {
      return rejectWithValue("Request cancelled");
    }

    return rejectWithValue(
      e instanceof Error ? e.message : "Failed to fetch print history"
    );
  }
});

const printHistorySlice = createSlice({
  name: "printHistory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearList: (state) => {
      state.list = [];
      state.mappedList = [];
      state.meta = null;
      state.fetchedAt = null;
      state.stats = {
        totalJobs: 0,
        totalPages: 0,
        totalCharge: 0,
        freeJobs: 0,
      };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrintHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrintHistory.fulfilled, (state, { payload }) => {
        state.loading = false;

        const jobs = normalizeHistoryArray(payload);
        const meta = {
          total: payload?.total ?? 0,
          page: payload?.page ?? 1,
          limit: payload?.limit ?? 20,
          totalPages: payload?.totalPages ?? 1,
        };

        state.list = jobs;
        state.mappedList = jobs.map(mapJob);
        state.stats = calcStats(jobs);
        state.meta = meta;
        state.fetchedAt = new Date().toISOString();
      })
      .addCase(fetchPrintHistory.rejected, (state, action) => {
        state.loading = false;

        if (action.payload === "Request cancelled") {
          return;
        }

        state.error = action.payload || "Failed to fetch print history";
      });
  },
});

export const { clearError, clearList } = printHistorySlice.actions;
export default printHistorySlice.reducer;