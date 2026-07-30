'use client'

import { useEffect, useRef } from 'react'
import { decodeJWTExp, triggerSessionExpired } from '@/utils/sessionExpired'

const WARNING_BEFORE_EXPIRY_MS = 120_000

export function useSessionTimer(tokenKey: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null

      const token = localStorage.getItem(tokenKey)
      if (!token) return

      const exp = decodeJWTExp(token)
      if (!exp) return

      const expiresAtMs = exp * 1000
      const delay = expiresAtMs - Date.now() - WARNING_BEFORE_EXPIRY_MS

      if (delay <= 0) {
        triggerSessionExpired()
        return
      }

      timerRef.current = setTimeout(() => {
        triggerSessionExpired()
      }, delay)
    }

    schedule()

    const handleStorage = (e: StorageEvent) => {
      if (e.key === tokenKey) schedule()
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      window.removeEventListener('storage', handleStorage)
    }
  }, [tokenKey])
}
