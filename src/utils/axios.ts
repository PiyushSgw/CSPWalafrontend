import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const access = localStorage.getItem('csp_access_token')
    if (access) {
      config.headers.Authorization = `Bearer ${access}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config

    // Not 401 or already retried → just reject
    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error)
    }

    const rt = typeof window !== 'undefined'
      ? localStorage.getItem('refresh_token')
      : null

    if (!rt) {
      // Option A: just reject and let caller decide
      return Promise.reject(error)

      // Option B (if you want auto logout instead):
      // if (typeof window !== 'undefined') {
      //   localStorage.clear()
      //   window.location.href = '/login'
      // }
      // return Promise.reject(error)
    }

    original._retry = true

    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/auth/refresh-token`,
        { refresh_token: rt },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      )

      const access = data?.data?.access_token
      const refresh = data?.data?.refresh_token

      if (!access) {
        // If refresh API doesn’t send access token, give up
        return Promise.reject(new Error('No access token in refresh response'))
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('csp_access_token', access)
        if (refresh) localStorage.setItem('refresh_token', refresh)
      }

      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${access}`

      return api(original)
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
      return Promise.reject(err)
    }
  }
)

export default api