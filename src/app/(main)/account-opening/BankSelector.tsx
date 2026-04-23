'use client';

interface Bank {
  id: number;
  name: string;
  short: string;
}

const banks: Bank[] = [
  { id: 1, name: 'State Bank of India', short: 'SBI' },
  { id: 2, name: 'Punjab National Bank', short: 'PNB' },
  { id: 3, name: 'Bank of Baroda', short: 'BOB' },
  { id: 4, name: 'Canara Bank', short: 'CAN' },
  { id: 5, name: 'Union Bank', short: 'UBI' },
  { id: 6, name: 'Bank of India', short: 'BOI' },
  { id: 7, name: 'IPPB', short: 'India Post' },
  { id: 8, name: 'Central Bank', short: 'CBI' },
];

interface Props {
  selected: string;
  onSelect: (payload: { bankName: string; bankId: number }) => void;
}

export default function BankSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.8px] text-gray-500">
        Choose Bank
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {banks.map((bank) => {
          const isSelected = selected === bank.name;

          return (
            <button
              key={bank.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                onSelect({
                  bankName: bank.name,
                  bankId: bank.id,
                })
              }
              className={[
                'rounded-[10px] border-2 p-3.5 text-center transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/20',
                isSelected
                  ? 'border-teal-600 bg-teal-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-teal-600 hover:bg-teal-50',
              ].join(' ')}
            >
              <span className="mb-2 block text-[28px]" aria-hidden="true">
                🏦
              </span>
              <div className="text-[11px] font-bold text-gray-700">
                {bank.name}
              </div>
              <div className="mt-0.5 text-[10px] text-gray-400">
                {bank.short}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}