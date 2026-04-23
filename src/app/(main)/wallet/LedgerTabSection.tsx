import { WalletTransaction } from "@/redux/slices/walletSlice"
import { WalletCardSection } from "./WalletCardSection"
import { WalletTransactionRow } from "./WalletTransactionRow"

export interface Props {
  balance: any
  transactions: WalletTransaction[]
  loading: boolean
  onRequestRecharge: () => void
}

debugger
export const LedgerTabSection: React.FC<Props> = ({
  balance,
  transactions,
  loading,
  onRequestRecharge
}) => {
  if (loading && !balance) {
    return <div className="skeleton">Loading wallet...</div>
  }

  const passbookPrints = 118 // TODO: Calculate from ledger
  const totalDebit = 830
  const totalRecharge = 1500

  return (
    <div id="wt-ledger">
      {/* Rest of your existing JSX stays exactly same */}
      <div className="col-1-2" style={{ gap: 16, marginBottom: 20, alignItems: "start" }}>
        <WalletCardSection availableBalance={balance?.balance || 0} />
        {/* Your existing CardStat grid + button */}
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Transaction Ledger</div>
          <button className="btn btn-outline btn-xs">Export PDF</button>
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