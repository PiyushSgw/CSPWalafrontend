'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../utils/axios';

export default function WalletWidget() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/csp/wallet/ledger')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const balance = data?.balance || 0;
  const lastRecharge = data?.lastRecharge;
  const transactions = data?.transactions || [];

  return (
    <div className="flex flex-col gap-4">
      {/* ✅ wallet-card: bg gradient #0f2744→#1e4b8c border-radius 14px padding 24px */}
      <div
        className="rounded-[14px] p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2744, #1e4b8c)' }}
      >
        {/* ✅ wallet-card::before — big ₹ watermark */}
        <div className="absolute right-[-10px] top-[-20px] text-[160px] font-black text-white/[0.03] font-mono pointer-events-none leading-none select-none">
          ₹
        </div>

        {/* ✅ wc-label: 11px uppercase tracking 1.5px opacity 0.5 */}
        <p className="text-[11px] uppercase tracking-[1.5px] opacity-50 mb-2 relative">
          Available Wallet Balance
        </p>

        {/* ✅ wc-amount: DM Mono 40px 500 line-height 1 */}
        <div className="font-mono text-[40px] font-medium leading-none mb-1.5 relative">
          {/* ✅ wc-rs: 22px opacity 0.6 */}
          <span className="text-[22px] opacity-60 mr-1">₹</span>
          {loading ? '...' : balance.toFixed(2)}
        </div>

        {/* ✅ wc-sub: 12px opacity 0.55 margin-bottom 20px */}
        <p className="text-[12px] opacity-55 mb-5 relative">
          {lastRecharge
            ? `Last recharged: ₹${lastRecharge.amount} on ${lastRecharge.date}`
            : 'No recharge yet'}
        </p>

        {/* ✅ wc-btns: flex gap 10px */}
        <div className="flex gap-[10px] relative">
          {/* ✅ wc-btn main: bg #0d8f72 white 12px 700 padding 10px border-radius 9px */}
          <button
            onClick={() => router.push('/wallet/recharge')}
            className="flex-1 py-[10px] rounded-[9px] bg-[#0d8f72] text-white text-[12px] font-bold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            + Recharge Now
          </button>
          {/* ✅ wc-btn sec: bg rgba(255,255,255,0.1) color rgba(255,255,255,0.8) */}
          <button
            onClick={() => router.push('/wallet')}
            className="flex-1 py-[10px] rounded-[9px] bg-white/10 text-white/80 text-[12px] font-bold hover:opacity-90 hover:-translate-y-px transition-all"
          >
            View Ledger
          </button>
        </div>
      </div>

      {/* ✅ card: bg white border #e5e7eb border-radius 12px */}
      <div className="bg-white border border-[#e5e7eb] rounded-[12px] overflow-hidden">
        {/* ✅ card-header: padding 16px 20px border-bottom */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          {/* ✅ card-title: 14px 700 #111827 flex gap 8px */}
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#111827]">
            <div className="w-2 h-2 rounded-full bg-[#0d8f72]" />
            Recent Transactions
          </div>
        </div>

        {/* ✅ card-body: padding 14px 16px */}
        <div className="px-4 py-[14px]">
          {loading ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="text-center text-[#6b7280] text-[13px] py-4">No transactions yet</div>
          ) : (
            <div>
              {transactions.map((tx: any, i: number) => (
                // ✅ tx-item: flex gap 12px padding 12px 0 border-bottom #e5e7eb
                <div key={i} className="flex items-center gap-3 py-3 border-b border-[#e5e7eb] last:border-0">
                  {/* ✅ tx-icon: 36x36 border-radius 9px debit=red-bg credit=green-bg */}
                  <div className={`w-9 h-9 rounded-[9px] flex items-center justify-center text-[15px] flex-shrink-0 ${
                    tx.amount > 0 ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'
                  }`}>
                    {tx.icon}
                  </div>

                  {/* ✅ tx-body: flex-1 */}
                  <div className="flex-1 min-w-0">
                    {/* ✅ tx-desc: 13px 600 #111827 */}
                    <p className="text-[13px] font-semibold text-[#111827] truncate leading-tight">
                      {tx.name}
                    </p>
                    {/* ✅ tx-date: 11px #6b7280 margin-top 2px */}
                    <p className="text-[11px] text-[#6b7280] mt-0.5">{tx.time}</p>
                  </div>

                  {/* ✅ tx-amount: DM Mono 14px 500 debit=#dc2626 credit=#16a34a */}
                  <span className={`font-mono text-[14px] font-medium flex-shrink-0 ${
                    tx.amount > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'
                  }`}>
                    {tx.amount > 0 ? '+' : '-'}₹{Math.abs(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}