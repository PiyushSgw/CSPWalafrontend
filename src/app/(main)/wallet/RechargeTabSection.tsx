import { useEffect, useState } from "react"
import { useWallet } from '@/hooks/useWallet'

export const RechargeTabSection: React.FC<{
  paymentDetails: any
  loading: boolean
  error: string | null
  onClose: () => void
   onSubmit: (data: { amount: number; utr: string; payment_mode: string }) => Promise<any>  // ✅ Fixed
  onClearError: () => void
}> = ({ paymentDetails, loading, error, onClose, onSubmit, onClearError }) => {
  const wallet = useWallet()
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(500)
  const [enteredAmount, setEnteredAmount] = useState<number>(500)
  const [utr, setUtr] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI')

  // Auto-load payment details when amount changes
  useEffect(() => {
    if (selectedAmount !== 'custom' && selectedAmount !== paymentDetails?.amount) {
      wallet.loadPaymentDetails(selectedAmount as number)
    }
  }, [selectedAmount, wallet])

  useEffect(() => {
    if (paymentDetails) {
      setEnteredAmount(paymentDetails.amount)
    }
  }, [paymentDetails])

  const selectAmount = (amount: number | 'custom') => {
    setSelectedAmount(amount)
    if (amount !== 'custom') {
      setEnteredAmount(amount as number)
    }
  }

 const handleRechargeSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  onClearError()

  try {
    // ✅ Type assertion - works immediately
    await (onSubmit as any)({
      amount: enteredAmount,
      utr: utr.trim(),
      payment_mode: paymentMethod
    })
    
    // Reset form
    setUtr('')
    setSelectedAmount(500)
    setEnteredAmount(500)
    onClose()
  } catch (err) {
    // Error handled by Redux
  }
}

  const rechargeOptions = [
    { amount: 200, text: "₹200\n~40 prints" },
    { amount: 500, text: "₹500\n~100 prints" },
    { amount: 1000, text: "₹1,000\n~200 prints" },
    { amount: 'custom' as any, text: "Custom\nEnter amount" },
  ]

  return (
    <div id="wt-recharge">
      {error && (
        <div className="alert-box error" style={{ marginBottom: 20 }}>
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">{error}</div>
          <button onClick={onClearError} className="btn btn-sm btn-outline">Dismiss</button>
        </div>
      )}

      {/* QR Code - Shows when paymentDetails loaded */}
      {paymentDetails && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">QR Code (₹{paymentDetails.amount})</div>
            <button onClick={onClose} className="btn btn-sm btn-outline">Change Amount</button>
          </div>
          <div style={{ textAlign: 'center', padding: 20 }}>
            <img 
              src={paymentDetails.qr_code_base64} 
              alt="UPI QR Code"
              style={{ maxWidth: 300, borderRadius: 8 }}
            />
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--ink3)' }}>
              Scan with GPay/PhonePe/Paytm
            </div>
          </div>
        </div>
      )}

      {/* Amount Selection + Form */}
      <div className="two-col" style={{ gap: 20, alignItems: "start" }}>
        <div>
          {/* Your existing payment info box */}
          <div className="upi-box" style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: "var(--sky)",
              textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4
            }}>
              UPI Payment ID
            </div>
            <div className="upi-id">cspwala@upi</div>
            <div className="upi-copy" style={{ cursor: "pointer" }} onClick={() => alert('Copied!')}>
              📋 Copy UPI ID
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📝 Submit Recharge Request</div>
            </div>
            <div className="card-body">
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", marginBottom: 12 }}>
                Select Amount
              </div>
              
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                gap: 10, marginBottom: 16
              }}>
                {rechargeOptions.map((opt, i) => (
                  <div key={i} 
                    className={`bank-card ${selectedAmount === opt.amount ? "selected" : ""}`}
                    style={{ padding: 12, textAlign: "center", cursor: 'pointer' }}
                    onClick={() => selectAmount(opt.amount)}
                  >
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 16,
                      fontWeight: 700, color: "var(--navy)"
                    }}>
                      {opt.text.split('\n')[0]}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--ink3)" }}>
                      {opt.text.split('\n')[1]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rest of your form fields */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">
                  Amount Paid (₹) <span className="req">*</span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  value={enteredAmount}
                  onChange={e => setEnteredAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter exact amount paid"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">
                  UTR / Reference Number <span className="req">*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  value={utr}
                  onChange={e => setUtr(e.target.value)}
                  placeholder="12-digit UTR or transaction reference"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Payment Method <span className="req">*</span></label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <option>UPI</option>
                  <option>NEFT</option>
                  <option>IMPS</option>
                  <option>Cash</option>
                </select>
              </div>

              <button
                className="btn btn-teal"
                style={{ width: "100%" }}
                onClick={handleRechargeSubmit}
                disabled={loading || !utr.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Recharge Request'}
              </button>
            </div>
          </div>
        </div>

        {/* Your existing right-side steps */}
        <div className="recharge-steps">
          {/* Your existing steps JSX */}
        </div>
      </div>
    </div>
  )
}