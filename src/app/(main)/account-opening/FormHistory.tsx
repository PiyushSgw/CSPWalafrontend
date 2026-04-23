'use client';

const historyData = [
  { id: 'F-0042', date: '15 Mar · 8:55 AM', customer: 'Geeta Singh',  bank: 'PNB', type: 'Savings', charge: '-₹10', badge: 'sky' },
  { id: 'F-0041', date: '15 Mar · 9:18 AM', customer: 'Mohan Lal',    bank: 'SBI', type: 'Combo',   charge: '-₹13', badge: 'amber' },
  { id: 'F-0040', date: '14 Mar · 2:30 PM', customer: 'Laxmi Devi',   bank: 'SBI', type: 'Jan Dhan', charge: '-₹8', badge: 'green' },
];

const badgeStyles: any = {
  sky:   'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-green-50 text-green-700',
};

export default function FormHistory() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-gray-800">📋 Form Print History</h3>
        <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-[11px] font-semibold text-gray-600 hover:bg-gray-50">
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['#', 'Date & Time', 'Customer', 'Bank', 'Form Type', 'Charge', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-[0.7px] text-gray-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyData.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0">
                <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{row.id}</td>
                <td className="px-4 py-3 text-[12px] text-gray-400 whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{row.customer}</td>
                <td className="px-4 py-3 text-gray-600">{row.bank}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeStyles[row.badge]}`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[12px] font-bold text-red-500">{row.charge}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700">
                    Printed
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                    Reprint
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}