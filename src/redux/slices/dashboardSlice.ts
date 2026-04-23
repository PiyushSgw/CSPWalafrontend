import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface DashboardStats {
  walletBalance: number
  printsToday: number
  printsThisMonth: number
  totalCustomers: number
  printsRemaining: number
  recentJobs: RecentJob[]
  monthlyUsage: number
  monthlyLimit: number
  dailyLimitUsage: number
  passbookPrints: number
  accountForms: number
  totalSpendThisMonth: number
}

interface RecentJob {
  id: number
  customer_name: string
  account_number: string
  bank_code: string
  charge: number
  is_reprint: boolean
  created_at: string
}

interface DashboardState {
  stats: DashboardStats | null
  loading: boolean
  error: string | null
}

const getFallbackData = (): DashboardStats => ({
  walletBalance: 0,
  printsToday: 0,
  printsThisMonth: 0,
  totalCustomers: 0,
  printsRemaining: 0,
  recentJobs: [],
  monthlyUsage: 0,
  monthlyLimit: 200,
  dailyLimitUsage: 0,
  passbookPrints: 0,
  accountForms: 0,
  totalSpendThisMonth: 0,
})

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, {}) => {
    try {
      const token = localStorage.getItem('admin_token')      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return getFallbackData()
      }

      const result = await response.json()
      console.log('✅ EXACT API RESPONSE:', result)

      const data = result.data  // ✅ Your exact structure

      return {
        // ✅ MAPPED TO YOUR EXACT API RESPONSE
        walletBalance: data.total_wallet_balance || 0,
        printsToday: data.pending_recharges?.count || 0,
        printsThisMonth: data.prints_last_30d?.count || 0,
        totalCustomers: data.csp?.active || 0,
        printsRemaining: data.pending_recharges?.amount || 0,
        recentJobs: [],
        monthlyUsage: data.prints_last_30d?.count || 0,
        monthlyLimit: 200,
        dailyLimitUsage: data.pending_recharges?.count || 0,
        passbookPrints: data.csp?.pending || 0,
        accountForms: data.csp?.under_review || 0,
        totalSpendThisMonth: data.prints_last_30d?.revenue || 0,
      } as DashboardStats

    } catch (error) {
      console.error('API Error:', error)
      return getFallbackData()
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  } as DashboardState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loading = false
        state.stats = getFallbackData()
      })
  }
})

export default dashboardSlice.reducer