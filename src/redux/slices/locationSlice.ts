import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'
import { clear } from 'console'

interface LocationItem {
  name: string
}

interface LocationState {
  states: LocationItem[]
  districts: LocationItem[]
  talukas: LocationItem[]
  villages: LocationItem[]
  pinCode: LocationItem[];
  fullAddress: LocationItem[];
  loading: boolean
  loadingDistricts: boolean
  loadingTalukas: boolean
  error: string | null
}

const initialState: LocationState = {
  states: [],
  districts: [],
  talukas: [],
  villages: [],
  pinCode: [],
  fullAddress: [],
  loading: false,
  loadingDistricts: false,
  loadingTalukas: false,
  error: null,
}

export const fetchStates = createAsyncThunk(
  'location/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/locations/states')
      return res.data.data as LocationItem[]
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load states')
    }
  }
)
  'location/fetchDistricts',
  async (state: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(state)}/districts`)
      return res.data.data as LocationItem[]
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load districts')
    }
  }
)

export const fetchTalukas = createAsyncThunk(
  'location/fetchTalukas',
  async ({ state, district }: { state: string; district: string }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(state)}/districts/${encodeURIComponent(district)}/talukas`)
      return res.data.data as LocationItem[]
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load talukas')
    }
  }
)

export const fetchVillages = createAsyncThunk(
  'location/fetchVillages',
  async ({ state, district, taluka }: { state: string; district: string; taluka: string }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/locations/states/${encodeURIComponent(state)}/districts/${encodeURIComponent(district)}/talukas/${encodeURIComponent(taluka)}/villages`)
      return res.data.data as LocationItem[]
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Failed to load villages')
    }
  }
)

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearDistricts: (state) => { state.districts = []; state.talukas = []; state.villages = []; state.pincode = []; },
    clearTalukas: (state) => { state.talukas = []; state.villages = [] },
    clearVillages: (state) => { state.villages = [] },
    clearPinCode: () => { state.pincode = []},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchStates.fulfilled, (state, action) => { state.loading = false; state.states = action.payload })
      .addCase(fetchStates.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
      .addCase(fetchDistricts.pending, (state) => { state.loadingDistricts = true; state.error = null })
      .addCase(fetchDistricts.fulfilled, (state, action) => { state.loadingDistricts = false; state.districts = action.payload })
      .addCase(fetchDistricts.rejected, (state, action) => { state.loadingDistricts = false; state.error = action.payload as string })
      .addCase(fetchTalukas.pending, (state) => { state.loadingTalukas = true; state.error = null })
      .addCase(fetchTalukas.fulfilled, (state, action) => { state.loadingTalukas = false; state.talukas = action.payload })
      .addCase(fetchTalukas.rejected, (state, action) => { state.loadingTalukas = false; state.error = action.payload as string })
      .addCase(fetchVillages.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchVillages.fulfilled, (state, action) => { state.loading = false; state.villages = action.payload })
      .addCase(fetchVillages.rejected, (state, action) => { state.loading = false; state.error = action.payload as string })
  },
})

export const { clearDistricts, clearTalukas, clearVillages } = locationSlice.actions
export default locationSlice.reducer
