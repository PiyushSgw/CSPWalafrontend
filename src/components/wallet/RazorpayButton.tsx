'use client'

import { useState, useCallback } from 'react'
import api from '@/utils/axios'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface Props {
  amount: number
  onSuccess?: (data: any) => void
  onError?: (msg: string) => void
}

export function RazorpayButton({ amount, onSuccess, onError }: Props) {
  const [loading, setLoading] = useState(false)

  const loadScript = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
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
        throw new Error('Failed to load Razorpay SDK')
      }

      // Step 1: Create order on backend
      const { data: orderData } = await api.post('/razorpay/create-order', {
        amount: amount * 100, // convert rupees to paise
      })

      const order = orderData.data

      // Step 2: Open Razorpay modal
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'CSP Wala',
        description: `Wallet Recharge - ₹${amount}`,
        order_id: order.order_id,
        handler: async (response: any) => {
          // Step 3: Verify payment on backend
          try {
            const { data: verifyData } = await api.post('/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount,
            })

            if (verifyData.data.verified) {
              onSuccess?.(verifyData.data)
            } else {
              onError?.('Payment verification failed')
            }
          } catch {
            onError?.('Payment verification failed. Contact support.')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#0d8f72',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            onError?.('Payment cancelled')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false)
        onError?.(response.error?.description || 'Payment failed')
      })
      razorpay.open()
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
      {loading ? 'Processing...' : `Pay ₹${amount} with Razorpay`}
    </button>
  )
}
