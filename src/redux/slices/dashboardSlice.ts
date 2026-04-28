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
  async (_, { getState }) => {
    try {
      const state = getState() as any;
      const isAdmin = !!state.auth.admin;
      const isAdminAuthenticated = state.auth.isAdminAuthenticated;
      
      let token: string;
      let dashboardUrl: string;
      
      if (isAdmin && isAdminAuthenticated) {
        // Admin user - use admin API
        token = localStorage.getItem('admin_token') || '';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        dashboardUrl = baseUrl.includes('/api') 
          ? `${baseUrl}/admin/reports/dashboard`
          : `${baseUrl}/api/admin/reports/dashboard`
        console.log('🔗 Admin Dashboard API URL:', dashboardUrl)
      } else {
        // CSP user - use CSP API
        token = localStorage.getItem('csp_access_token') || '';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
        dashboardUrl = baseUrl.includes('/api') 
          ? `${baseUrl}/csp/dashboard`
          : `${baseUrl}/api/csp/dashboard`
        console.log('🔗 CSP Dashboard API URL:', dashboardUrl)
      }
      
      const response = await fetch(dashboardUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        console.log('❌ API FAILED, using fallback data')
        return getFallbackData()
      }

      const result = await response.json()
      
      if (isAdmin && isAdminAuthenticated) {
        console.log('✅ ADMIN DASHBOARD API RESPONSE:', result)
        const data = result.data  // Admin dashboard structure
        
        return {
          // ✅ MAPPED TO ADMIN DASHBOARD API RESPONSE
          walletBalance: data.total_wallet_balance || 0,
          printsToday: data.prints_last_30d?.count || 0,
          printsThisMonth: data.prints_last_30d?.count || 0,
          totalCustomers: data.csp?.active || 0,
          printsRemaining: Math.floor((data.total_wallet_balance || 0) / 10),
          recentJobs: [],
          monthlyUsage: data.prints_last_30d?.count || 0,
          monthlyLimit: 200,
          dailyLimitUsage: data.prints_last_30d?.count || 0,
          passbookPrints: data.csp?.pending || 0,
          accountForms: data.csp?.under_review || 0,
          totalSpendThisMonth: data.prints_last_30d?.revenue || 0,
        } as DashboardStats
      } else {
        console.log('✅ CSP DASHBOARD API RESPONSE:', result)
        const data = result.data  // CSP dashboard structure
        console.log('🔍 CSP Dashboard Data:', data)
        console.log('🔍 Wallet Balance from API:', data.wallet_balance)

        return {
          // ✅ MAPPED TO CSP DASHBOARD API RESPONSE
          walletBalance: data.wallet_balance || 0,
          printsToday: data.prints_today || 0,
          printsThisMonth: data.prints_this_month || 0,
          totalCustomers: data.total_customers || 0,
          printsRemaining: data.prints_remaining || 0,
          recentJobs: data.recent_print_jobs || [],
          monthlyUsage: data.prints_this_month || 0,
          monthlyLimit: 200,
          dailyLimitUsage: data.prints_today || 0,
          passbookPrints: data.prints_today || 0,
          accountForms: data.pending_recharge_requests || 0,
          totalSpendThisMonth: (data.prints_this_month || 0) * 10, // Assuming ₹10 per print
        } as DashboardStats
      }

    } catch (error) {
      console.error('Dashboard API Error:', error)
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