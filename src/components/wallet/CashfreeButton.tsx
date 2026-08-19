'use client'

import { useState, useCallback } from 'react'
import api from '@/utils/axios'

declare global {
  interface Window {
    Cashfree: any
  }
}

interface Props {
  amount: number
  onSuccess?: (data: any) => void
  onError?: (msg: string) => void
}

export function CashfreeButton({ amount, onSuccess, onError }: Props) {
  const [loading, setLoading] = useState(false)

  const loadScript = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      if (document.querySelector('script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }, [])

  const handlePayment = useCallback(async () => {
    if (!amount || amount < 1) {
      onError?.('Minimum amount is ₹1')
      return
    }

    setLoading(true)

    try {
      const scriptLoaded = await loadScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Cashfree SDK')
      }

      // Step 1: Create order on backend
      const { data: orderData } = await api.post('/cashfree/create-order', {
        amount,
      })

      const order = orderData.data

      // Step 2: Open Cashfree checkout
      const cashfreeMode = process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ? 'production' : 'sandbox'
      const cashfree = window.Cashfree({ mode: cashfreeMode })

      const returnUrl = `${window.location.origin}/wallet?cf_order_id=${order.cf_order_id}&order_id=${order.order_id}`

      await cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: '_self',
        returnUrl: returnUrl,
      })
    } catch (err: any) {
      setLoading(false)
      onError?.(err.response?.data?.message || err.message || 'Payment failed')
    }
  }, [amount, loadScript, onSuccess, onError])

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !amount || amount < 1}
      className="btn btn-teal"
      style={{ width: '100%' }}
    >
      {loading ? 'Processing...' : `Pay ₹${amount} with Cashfree`}
    </button>
  )
}
