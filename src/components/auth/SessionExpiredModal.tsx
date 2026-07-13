'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, LogIn, Loader2 } from 'lucide-react'
import { onSessionExpired, resetSessionExpiredFlag } from '@/utils/sessionExpired'

const AUTO_REDIRECT_SECONDS = 5

interface SessionExpiredModalProps {
  onLoginPath?: string
}

export default function SessionExpiredModal({ onLoginPath = '/user' }: SessionExpiredModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [navigating, setNavigating] = useState(false)
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS)

  const clearSessionAndRedirect = useCallback(() => {
    setNavigating(true)
    localStorage.removeItem('csp_access_token')
    localStorage.removeItem('csp_refresh_token')
    localStorage.removeItem('admin_token')
    if (typeof document !== 'undefined') {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    resetSessionExpiredFlag()
    router.push(onLoginPath)
  }, [onLoginPath, router])

  useEffect(() => {
    const unsubscribe = onSessionExpired(() => {
      setIsOpen(true)
      setCountdown(AUTO_REDIRECT_SECONDS)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!isOpen || navigating) return

    if (countdown <= 0) {
      clearSessionAndRedirect()
      return
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [isOpen, navigating, countdown, clearSessionAndRedirect])

  if (!isOpen) return null

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin w-10 h-10 text-green-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">Redirecting to login...</p>
          </div>
        </div>
      )}

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]" />

      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-6 pb-4 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
              Session Expired
            </h2>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Your session has expired. You will be redirected to login in{' '}
              <span className="font-bold text-red-600">{countdown}</span> seconds.
            </p>

            <button
              onClick={clearSessionAndRedirect}
              disabled={navigating}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {navigating ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Login Again <LogIn size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
