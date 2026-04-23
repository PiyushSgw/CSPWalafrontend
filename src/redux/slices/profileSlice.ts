import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Debugger } from "inspector/promises";

const API_BASE_URL = "http://localhost:5001/";

export interface Profile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  photo_url: string | null;
  bio: string;
  kyc_status: "pending" | "verified" | "rejected";
  created_at: string;

  aadhaar_url?: string | null;
  pan_url?: string | null;
  csp_certificate_url?: string | null;
  outlet_photo_url?: string | null;
  bank_letter_url?: string | null;

  location?: string;
  status?: string;
  member_since?: string;
  total_prints?: number;
  total_spend?: number;
  customers_added?: number;

  outlet_name?: string;
  csp_code?: string;
  bank_name?: string;
  branch_name?: string;
  ifsc?: string;
  agent_code?: string;

  [key: string]: any;
}

export interface Dashboard {
  total_customers: number;
  total_balance: number;
  recent_activity: string[];
  wallet_balance?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
  errors?: any[];
}

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("csp_access_token");
};

let abortController: AbortController | null = null;

interface ProfileState {
  profile: Profile | null;
  dashboard: Dashboard | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  dashboard: null,
  loading: false,
  error: null,
};

export const loadProfile = createAsyncThunk<
  ApiResponse<Profile>,
  void,
  { rejectValue: string }
>("profile/loadProfile", async (_, { rejectWithValue }) => {
  if (abortController) abortController.abort();
  abortController = new AbortController();

  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found. Please login again.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: abortController.signal,
    });

    const data: ApiResponse<any> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    abortController = null;
    return data;
  } catch (error: any) {
    abortController = null;
    if (error.name === "AbortError") return rejectWithValue("Request cancelled");
    return rejectWithValue(error.message || "Failed to load profile");
  }
});

export const loadDashboard = createAsyncThunk<
  ApiResponse<Dashboard>,
  void,
  { rejectValue: string }
>("profile/loadDashboard", async (_, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data: ApiResponse<Dashboard> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to load dashboard");
  }
});

export const updateProfile = createAsyncThunk<
  ApiResponse<Profile>,
  Partial<Profile>,
  { rejectValue: string }
>("profile/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data: ApiResponse<Profile> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update profile");
  }
});

export const updateBankDetails = createAsyncThunk<
  ApiResponse<Profile>,
  {
    outlet_name?: string;
    bank_name?: string;
    branch_name?: string;
    ifsc?: string;
    agent_code?: string;
    location?: string;
  },
  { rejectValue: string }
>("profile/updateBankDetails", async (bankData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bankData),
    });

    const data: ApiResponse<Profile> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to update bank details");
  }
});

export const uploadPhoto = createAsyncThunk<
  ApiResponse<{ photo_url: string }>,
  FormData,
  { rejectValue: string }
>("profile/uploadPhoto", async (formData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data: ApiResponse<{ photo_url: string }> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to upload photo");
  }
});

export const uploadKYC = createAsyncThunk<
  ApiResponse<{ kyc_status: string }>,
  FormData,
  { rejectValue: string }
>("profile/uploadKYC", async (formData, { rejectWithValue }) => {
  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile/kyc`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data: ApiResponse<{ kyc_status: string }> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to upload KYC");
  }
});

export const changePassword = createAsyncThunk<
  ApiResponse<void>,
  { current_Password: string; new_Password: string },
  { rejectValue: string }
>("profile/changePassword", async (passwordData, { rejectWithValue }) => {
  debugger;

  try {
    const token = getAuthToken();
    if (!token) return rejectWithValue("No auth token found.");

    const response = await fetch(`${API_BASE_URL}api/csp/profile/change-password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: passwordData.current_Password,
        new_password: passwordData.new_Password,
      }),
    });

    const data: ApiResponse<void> = await response.json();

    console.log("Change Password Response:", data); // ✅ debug

    if (!response.ok || !data.success) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to change password");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.dashboard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...action.payload.data,
          aadhaar_url: action.payload.data.kyc_doc_url || null,
          pan_url: action.payload.data.kyc_doc_url2 || null,
          outlet_photo_url: action.payload.data.outlet_photo_url || null,
          bank_letter_url: action.payload.data.bank_letter_url || null,
          csp_certificate_url: action.payload.data.csp_certificate_url || null,
        };
        state.error = null;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load profile";
      })

      .addCase(loadDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload.data;
      })
      .addCase(loadDashboard.rejected, (state, action) => {
        state.error = action.payload || "Failed to load dashboard";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...(state.profile || {}),
          ...action.payload.data,
        };
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      })

      .addCase(updateBankDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBankDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...(state.profile || {}),
          ...action.payload.data,
        };
        state.error = null;
      })
      .addCase(updateBankDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update bank details";
      })

      .addCase(uploadPhoto.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.photo_url = action.payload.data.photo_url;
        }
        state.error = null;
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.error = action.payload || "Photo upload failed";
      })

      .addCase(uploadKYC.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadKYC.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile.kyc_status =
            action.payload.data.kyc_status as "pending" | "verified" | "rejected";
        }
        state.error = null;
      })
      .addCase(uploadKYC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "KYC upload failed";
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload || "Password change failed";
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;