'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';

type HistoryItem = {
  id?: number | string;
  application_id?: number | string;
  customer_id?: number | string | null;
  bank_name?: string;
  bank?: string;
  account_type?: string;
  full_name?: string;
  mobile?: string;
  include_passbook?: boolean;
  created_at?: string;
  status?: string;
};

const getCharge = (item: HistoryItem) => {
  return item.include_passbook ? 13 : 10;
};

const getBankShort = (bank?: string) => {
  if (!bank) return '—';

  const map: Record<string, string> = {
    'State Bank of India': 'SBI',
    'Punjab National Bank': 'PNB',
    'Bank of Baroda': 'BOB',
    'Canara Bank': 'CAN',
    'Union Bank': 'UBI',
    'Bank of India': 'BOI',
    IPPB: 'IPPB',
    'Central Bank': 'CBI',
  };

  return map[bank] || bank;
};

const getAccountTypeLabel = (type?: string) => {
  if (!type) return '—';

  const map: Record<string, string> = {
    savings: 'Savings',
    current: 'Current',
    jan_dhan: 'Jan Dhan',
    minor: 'Minor',
  };

  return map[type] || type;
};

const getTypeBadgeClass = (type?: string) => {
  switch (type) {
    case 'savings':
      return 'bg-blue-50 text-blue-700';
    case 'current':
      return 'bg-purple-50 text-purple-700';
    case 'jan_dhan':
      return 'bg-green-50 text-green-700';
    case 'minor':
      return 'bg-orange-50 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusBadgeClass = (status?: string) => {
  const value = String(status || '').toLowerCase();

  if (
    value === 'printed' ||
    value === 'success' ||
    value === 'completed' ||
    value === 'submitted'
  ) {
    return 'bg-green-50 text-green-700';
  }

  if (value === 'preview' || value === 'pending') {
    return 'bg-yellow-50 text-yellow-700';
  }

  return 'bg-gray-100 text-gray-700';
};

export default function FormHistory() {
  const historyRaw = useAppSelector(
    (state) => state.accountOpening.history ?? []
  ) as HistoryItem[];

  const history = useMemo(() => {
    return [...historyRaw].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [historyRaw]);

  if (!history.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <div className="mb-3 text-[42px]">🗂️</div>
        <h3 className="mb-1 text-[16px] font-bold text-gray-800">
          No form history found
        </h3>
        <p className="text-[13px] text-gray-500">
          Submitted account opening forms will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <div>
          <h3 className="text-[15px] font-bold text-gray-800">
            📋 Form Print History
          </h3>
        </div>

        <button
          type="button"
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition-all hover:bg-gray-50"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                #
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Date & Time
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Customer
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Bank
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Form Type
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Charge
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.6px] text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((item, index) => {
              const rowId = item.application_id || item.id || index + 1;
              const charge = getCharge(item);

              const createdDate = item.created_at
                ? new Date(item.created_at).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '—';

              const accountTypeLabel = getAccountTypeLabel(item.account_type);
              const bankLabel = getBankShort(item.bank_name || item.bank);
              const statusLabel = item.status || 'Printed';

              return (
                <tr
                  key={rowId}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60"
                >
                  <td className="px-4 py-4 text-[13px] font-medium text-gray-700">
                    {String(rowId).startsWith('F-')
                      ? String(rowId)
                      : `F-${String(index + 1).padStart(4, '0')}`}
                  </td>

                  <td className="px-4 py-4 text-[13px] text-gray-600">
                    {createdDate}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-semibold text-gray-800">
                    {item.full_name || 'Unnamed User'}
                  </td>

                  <td className="px-4 py-4 text-[13px] text-gray-700">
                    {bankLabel}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${getTypeBadgeClass(
                        item.account_type
                      )}`}
                    >
                      {accountTypeLabel}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-[13px] font-medium text-red-600">
                    -₹{charge}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Reprint
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}