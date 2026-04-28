import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const access = localStorage.getItem('csp_access_token')
    if (access) config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

let isRefreshing = false
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = []

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config

    if (
      error.response?.status !== 401 ||
      original?._retry ||
      original?.url?.includes('/auth/refresh-token') ||
      original?.url?.includes('/auth/login')
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const rt = typeof window !== 'undefined'
      ? localStorage.getItem('csp_refresh_token')
      : null

    if (!rt) {
      isRefreshing = false
      processQueue(new Error('No refresh token'), null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh-token`, // ✅ no /api prefix — BASE_URL already has it
        { refresh_token: rt },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      )

      const access: string = data?.data?.access_token
      const refresh: string = data?.data?.refresh_token

      if (!access) throw new Error('No access token in refresh response')

      localStorage.setItem('csp_access_token', access)
      if (refresh) localStorage.setItem('csp_refresh_token', refresh)

      api.defaults.headers.common.Authorization = `Bearer ${access}`
      processQueue(null, access)

      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${access}`
      return api(original)

    } catch (err) {
      processQueue(err, null)
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default api