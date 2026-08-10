import { WalletTransaction } from "@/redux/slices/walletSlice"
import { WalletCardSection } from "./WalletCardSection"
import { WalletTransactionRow } from "./WalletTransactionRow"
import { Totalvalue } from "./Totalvalue"

export interface Props {
  balance: any
  transactions: WalletTransaction[]
  loading: boolean
  onRequestRecharge: () => void
}

const exportLedgerToPDF = (transactions: WalletTransaction[], balance: number) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wallet Ledger - CSPWala</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #0d8f72; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f3f4f6; font-weight: bold; }
        .credit { color: #16a34a; }
        .debit { color: #dc2626; }
        .summary { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>📒 Wallet Ledger</h1>
      <div class="summary">
        <strong>Current Balance:</strong> ₹${balance.toFixed(2)}<br>
        <strong>Generated:</strong> ${new Date().toLocaleString('en-IN')}
      </div>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Balance After</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(tx => `
            <tr>
              <td>${tx.dateTime}</td>
              <td>${tx.desc}</td>
              <td class="${tx.type === 'Credit' ? 'credit' : 'debit'}">${tx.type}</td>
              <td class="${tx.type === 'Credit' ? 'credit' : 'debit'}">${tx.amount}</td>
              <td>${tx.balanceAfter}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

export const LedgerTabSection: React.FC<Props> = ({
  balance,
  transactions,
  loading,
  onRequestRecharge
}) => {
  if (loading && !balance) {
    return <div className="skeleton">Loading wallet...</div>
  }

  const debitTxs = transactions.filter(tx => tx.type === 'Debit')
  const creditTxs = transactions.filter(tx => tx.type === 'Credit')

  const passbooks = debitTxs.filter(tx => tx.desc.toLowerCase().includes('passbook')).length
  const forms = debitTxs.filter(tx => tx.desc.toLowerCase().includes('form')).length
  const spent = debitTxs.reduce((sum, tx) => sum + (tx.amount_raw || 0), 0)
  const recharged = creditTxs.reduce((sum, tx) => sum + (tx.amount_raw || 0), 0)

  return (
    <div id="wt-ledger">
      {/* Rest of your existing JSX stays exactly same */}
      <div className="col-1-2" style={{ marginBottom: 20, alignItems: "start" }}>
        <WalletCardSection availableBalance={balance?.balance || 0} />
        {/* Your existing CardStat grid + button */}
        <div className="">
         <Totalvalue
           passbooks={passbooks}
           forms={forms}
           spent={spent}
           recharged={recharged}
           onRechargeClick={onRequestRecharge}
         />
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Transaction Ledger</div>
          <button 
            className="btn btn-outline btn-xs"
            onClick={() => exportLedgerToPDF(transactions, balance?.balance || 0)}
            disabled={transactions.length === 0}
          >
            Export PDF
          </button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <WalletTransactionRow key={tx.id} {...tx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}