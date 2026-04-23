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

const API_BASE = "http://localhost:5001";
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

const mapJob = (j: PrintJob): MappedPrintJob => ({
  id: `#${String(j.id ?? 0).padStart(6, "0")}`,
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
  charge: `₹${Number(j.charge ?? 0).toFixed(2)}`,
  rawCharge: Number(j.charge ?? 0),
  status: mapStatus(j.status),
  isFree: Boolean(j.is_free),
  createdAtRaw: j.created_at,   // 🟩 yeh line add karo
});
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
  if (Array.isArray(raw?.data?.jobs)) return raw.data.jobs;
  if (Array.isArray(raw?.data?.history)) return raw.data.history;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.jobs)) return raw.jobs;
  if (Array.isArray(raw?.history)) return raw.history;
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

    const url = new URL("/csp/passbook/history", API_BASE);

    if (params.customer_id) {
      url.searchParams.set("customer_id", String(params.customer_id));
    }
    if (params.bank_id) {
      url.searchParams.set("bank_id", String(params.bank_id));
    }
    if (params.from_date) {
      url.searchParams.set("from_date", params.from_date);
    }
    if (params.to_date) {
      url.searchParams.set("to_date", params.to_date);
    }

    url.searchParams.set("page", String(params.page ?? 1));
    url.searchParams.set("limit", String(params.limit ?? 100));

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: ac.signal,
    });

    if (res.status === 401) {
      handleAuthError();
      return rejectWithValue("Session expired. Redirecting to login...");
    }

    const raw = await res.json();

    if (!res.ok || !raw?.success) {
      return rejectWithValue(raw?.message || `HTTP ${res.status}`);
    }

    const normalizedData = normalizeHistoryArray(raw);
    const apiData = raw?.data ?? {};

    const meta: ApiMeta = {
      total: Number(apiData?.total ?? normalizedData.length ?? 0),
      page: Number(apiData?.page ?? params.page ?? 1),
      limit: Number(apiData?.limit ?? params.limit ?? 100),
      totalPages: Number(apiData?.totalPages ?? 1),
    };

    ac = null;

    return {
      success: true,
      message: raw?.message ?? "Success",
      data: normalizedData,
      meta,
    };
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

        const list = Array.isArray(payload?.data) ? payload.data : [];

        state.list = list;
        state.mappedList = list.map(mapJob);
        state.stats = calcStats(list);
        state.meta = payload?.meta ?? null;
        state.fetchedAt = new Date().toISOString();
      })
      .addCase(fetchPrintHistory.rejected, (state, action) => {
        state.loading = false;

        if (action.payload === "Request cancelled") {
          return;
        }

        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch print history";
      });
  },
});

export const { clearError, clearList } = printHistorySlice.actions;
export default printHistorySlice.reducer;