import { useRouter } from 'next/navigation'
import { AlertTriangle, Plus } from 'lucide-react'

interface Props {
  balance: number
  isLow: boolean
  loading: boolean
}

export default function WalletWidget({ balance, isLow, loading }: Props) {
  const router = useRouter()
  const printCharge = 5
  const printsRemaining = Math.floor(balance / printCharge)

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-slate-100 rounded w-1/2" />
          <div className="h-10 bg-slate-100 rounded" />
          <div className="h-8 bg-slate-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-slate-700">Wallet</h3>
        {isLow && (
          <div className="flex items-center gap-1 text-amber-600 text-[11px] font-semibold">
            <AlertTriangle size={11} />
            Low Balance
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] text-slate-400 mb-0.5">Current Balance</p>
        <p className="text-3xl font-bold text-slate-800">
          ₹<span>{balance.toFixed(2)}</span>
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          ~{printsRemaining} prints remaining at ₹{printCharge}/print
        </p>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div
          className="bg-green-500 h-1.5 rounded-full transition-all"
          style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
        />
      </div>

      <button
        onClick={() => router.push('/wallet')}
        className="w-full flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white text-[12.5px] font-semibold rounded-lg transition-colors"
      >
        <Plus size={13} /> Add Funds
      </button>
    </div>
  )
}