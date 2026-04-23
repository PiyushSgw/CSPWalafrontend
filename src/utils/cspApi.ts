import axios from 'axios'

const CSP_TOKEN_KEY = 'csp_access_token'

export const cspApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// CSP token only for wallet APIs
cspApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(CSP_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default cspApi