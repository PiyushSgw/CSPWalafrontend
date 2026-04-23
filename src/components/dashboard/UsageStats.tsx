
'use client';

interface Props {
  stats: any;
  loading: boolean;
}

export default function UsageStats({ stats, loading }: Props) {
  const monthly = stats?.printsThisMonth || 0;
  const limit = stats?.monthlyLimit || 200;
  const passbook = stats?.passbookPrints || 0;
  const forms = stats?.accountForms || 0;
  const daily = stats?.dailyLimitUsage || 0;
  const spend = stats?.totalSpendThisMonth || 0;

  const rows = [
    { label: 'Daily limit usage', value: `${daily}%`, fill: daily, barClass: 'bg-emerald-600' },
    { label: 'Passbook prints', value: String(passbook), fill: Math.min((passbook / limit) * 100, 100), barClass: 'bg-[#0f2744]' },
    { label: 'Account forms', value: String(forms), fill: Math.min((forms / limit) * 100, 100), barClass: 'bg-[#d97706]' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
           <span className="w-2 h-2 bg-emerald-600 rounded-full" />
          {new Date().toLocaleString('en-IN', { month: 'long' })} Usage
        </h2>
        <span className="bg-[#eff6ff] text-[11px] font-semibold text-[#0284c7] rounded-full px-2 py-0.5">
          {loading ? '...' : `${monthly} / ${limit}`}
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[11.5px] text-slate-500 font-medium">{row.label}</span>
              <span className="text-[11.5px] font-semibold text-slate-800">
                {loading ? '...' : row.value}
              </span>
            </div>
            <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${row.barClass}`}
                style={{ width: loading ? '0%' : `${row.fill}%` }}
              />
            </div>
          </div>
        ))}
      </div>

       <div className="pt-3 mt-0">

        {/* Divider */}
        <span className="block border-t border-gray-200 my-2"></span>

        {/* Content */}
        <div className="flex justify-between items-center text-[12px] pt-3">
          <span className="text-[#6b7280]">
            Total spend this month
          </span>
          <span className="font-bold text-[#0f2744] font-mono">
            {loading ? '...' : `₹${spend}`}
          </span>
        </div>

      </div>
    </div>
  );
}