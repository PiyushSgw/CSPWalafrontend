import { useEffect, useState } from "react"
import { useWallet } from '@/hooks/useWallet'

export const RechargeTabSection: React.FC<{
  paymentDetails: any
  loading: boolean
  error: string | null
  onClose: () => void
  onSubmit: (data: { amount: number; utr: string; payment_mode: string }) => Promise<any>
  onClearError: () => void
}> = ({ paymentDetails, loading, error, onClose, onSubmit, onClearError }) => {
  const wallet = useWallet()

  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(500)
  const [enteredAmount, setEnteredAmount] = useState<number>(500)
  const [utr, setUtr] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI')
  const [copying, setCopying] = useState(false)

  useEffect(() => {
    if (selectedAmount !== 'custom' && selectedAmount !== paymentDetails?.amount) {
      wallet.loadPaymentDetails(selectedAmount as number)
    }
  }, [selectedAmount, paymentDetails?.amount, wallet])

  useEffect(() => {
    if (paymentDetails?.amount) {
      setEnteredAmount(Number(paymentDetails.amount))
    }
  }, [paymentDetails])

  const selectAmount = (amount: number | 'custom') => {
    setSelectedAmount(amount)
    if (amount !== 'custom') {
      setEnteredAmount(amount as number)
    }
  }

  const handleCopyUpi = async () => {
    const upiId = paymentDetails?.upi_id || 'cspwala@upi'

    try {
      setCopying(true)
      await navigator.clipboard.writeText(upiId)
      alert('UPI ID copied!')
    } catch (err) {
      alert('Failed to copy UPI ID')
    } finally {
      setCopying(false)
    }
  }

  const handleRechargeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onClearError()

    if (!enteredAmount || enteredAmount <= 0) {
      return
    }

    if (!utr.trim()) {
      return
    }

    try {
      await onSubmit({
        amount: Number(enteredAmount),
        utr: utr.trim(),
        payment_mode: paymentMethod
      })

      setUtr('')
      setSelectedAmount(500)
      setEnteredAmount(500)
      setPaymentMethod('UPI')
      onClose()
    } catch (err) {
      // handled by Redux / parent
    }
  }

  const rechargeOptions = [
    { amount: 200, title: "₹200", subtitle: "~40 prints" },
    { amount: 500, title: "₹500", subtitle: "~100 prints" },
    { amount: 1000, title: "₹1,000", subtitle: "~200 prints" },
    { amount: 'custom' as const, title: "Custom", subtitle: "Enter amount" },
  ]

  const upiId = paymentDetails?.upi_id || 'cspwala@upi'
  const bankName = paymentDetails?.bank_name || 'State Bank of India'
  const accountName = paymentDetails?.account_name || 'Alpha Vision Labs'
  const accountNumber = paymentDetails?.account_number || 'XXXX XXXX XXXX 4521'
  const ifsc = paymentDetails?.ifsc || 'SBIN0000XXX'

  return (
    <div id="wt-recharge">
      {error && (
        <div className="alert-box error" style={{ marginBottom: 20 }}>
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">{error}</div>
          <button onClick={onClearError} className="btn btn-sm btn-outline" type="button">
            Dismiss
          </button>
        </div>
      )}

      <div className="two-col" style={{ gap: 20, alignItems: "start" }}>
        <div>
          <div className="alert-box info" style={{ marginBottom: 20 }}>
            <div className="alert-icon">📌</div>
            <div className="alert-body">
              <strong>How to Recharge</strong>
              <div>
                Make a payment using UPI or bank transfer to the details below, then submit your
                UTR/reference number in the form. Admin will verify and credit your wallet within
                30 minutes.
              </div>
            </div>
          </div>

          <div className="upi-box" style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--sky)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 4
              }}
            >
              UPI Payment ID
            </div>

            <div className="upi-id">{upiId}</div>

            <div
              className="upi-copy"
              style={{ cursor: "pointer" }}
              onClick={handleCopyUpi}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCopyUpi()
                }
              }}
            >
              📋 {copying ? 'Copying...' : 'Copy UPI ID'}
            </div>

            <hr
              style={{
                borderColor: "rgba(2,132,199,0.2)",
                margin: "14px 0"
              }}
            />

            <div
              style={{
                fontSize: 11,
                color: "var(--sky)",
                marginBottom: 4,
                fontWeight: 600
              }}
            >
              OR BANK TRANSFER
            </div>

            <div
              style={{
                fontSize: 12,
                color: "var(--ink2)",
                textAlign: "left",
                fontFamily: "'DM Mono', monospace"
              }}
            >
              Bank: {bankName}
              <br />
              A/C: {accountNumber}
              <br />
              IFSC: {ifsc}
              <br />
              Name: {accountName}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📝 Submit Recharge Request</div>
            </div>

            <div className="card-body">
              <form onSubmit={handleRechargeSubmit}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--ink3)",
                    marginBottom: 12
                  }}
                >
                  Select Amount
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: 10,
                    marginBottom: 16
                  }}
                >
                  {rechargeOptions.map((opt, i) => (
                    <div
                      key={i}
                      className={`bank-card ${selectedAmount === opt.amount ? "selected" : ""}`}
                      style={{ padding: 12, textAlign: "center", cursor: "pointer" }}
                      onClick={() => selectAmount(opt.amount)}
                    >
                      <div
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--navy)"
                        }}
                      >
                        {opt.title}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--ink3)" }}>
                        {opt.subtitle}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">
                    Amount Paid (₹) <span className="req">*</span>
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    value={enteredAmount || ''}
                    onChange={(e) => setEnteredAmount(parseFloat(e.target.value) || 0)}
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
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="12-digit UTR or transaction reference"
                  />
                  <div className="form-hint">
                    Found in your UPI app or bank transaction history
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">
                    Payment Method <span className="req">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="UPI">UPI</option>
                    <option value="NEFT">NEFT</option>
                    <option value="IMPS">IMPS</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <button
                  className="btn btn-teal"
                  style={{ width: "100%" }}
                  type="submit"
                  disabled={loading || !utr.trim() || !enteredAmount}
                >
                  {loading ? 'Submitting...' : 'Submit Recharge Request'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div>
          <div className="recharge-steps">
            <div className="rs-item">
              <div className="rs-num">1</div>
              <div>
                <div className="rs-title">Make Payment</div>
                <div className="rs-desc">
                  Pay via UPI ({upiId}) or NEFT to the bank account shown.
                </div>
              </div>
            </div>

            <div className="rs-item">
              <div className="rs-num">2</div>
              <div>
                <div className="rs-title">Note UTR Number</div>
                <div className="rs-desc">
                  Copy the 12-digit UTR/reference number from your UPI app or bank statement.
                </div>
              </div>
            </div>

            <div className="rs-item">
              <div className="rs-num">3</div>
              <div>
                <div className="rs-title">Submit Request</div>
                <div className="rs-desc">
                  Enter the amount and UTR in the form on the left and click Submit.
                </div>
              </div>
            </div>

            <div className="rs-item">
              <div className="rs-num">4</div>
              <div>
                <div className="rs-title">Admin Verifies</div>
                <div className="rs-desc">
                  Our team verifies your payment and credits your wallet — usually within 30 minutes.
                </div>
              </div>
            </div>

            <div
              className="rs-item"
              style={{ background: "var(--teal-light)", borderColor: "var(--teal-mid)" }}
            >
              <div className="rs-num" style={{ background: "var(--teal)" }}>
                ✓
              </div>
              <div>
                <div className="rs-title" style={{ color: "var(--teal)" }}>
                  Wallet Credited
                </div>
                <div className="rs-desc">
                  You get an SMS notification when your wallet is recharged. Start printing!
                </div>
              </div>
            </div>
          </div>

          <div className="alert-box warn" style={{ marginTop: 16 }}>
            <div className="alert-icon">⚠️</div>
            <div className="alert-body">
              <strong>Important:</strong> Make sure to submit the correct UTR number. Wrong UTR can
              delay approval. Contact support if not credited within 2 hours.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}