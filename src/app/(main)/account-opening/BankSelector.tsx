'use client';

const banks = [
  { name: 'State Bank of India', short: 'SBI' },
  { name: 'Punjab National Bank', short: 'PNB' },
  { name: 'Bank of Baroda', short: 'BOB' },
  { name: 'Canara Bank', short: 'CAN' },
  { name: 'Union Bank', short: 'UBI' },
  { name: 'Bank of India', short: 'BOI' },
  { name: 'IPPB', short: 'India Post' },
  { name: 'Central Bank', short: 'CBI' },
];

interface Props {
  selected: string;
  onSelect: (bank: string) => void;
}

export default function BankSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.8px] mb-3">
        Choose Bank
      </p>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {banks.map((bank) => (
          <div
            key={bank.short}
            onClick={() => onSelect(bank.name)}
            className={`border-2 rounded-[10px] p-3.5 cursor-pointer text-center transition-all ${
              selected === bank.name
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-teal-600 hover:bg-teal-50'
            }`}
          >
            <span className="text-[28px] mb-2 block">🏦</span>
            <div className="text-[11px] font-bold text-gray-700">{bank.name}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{bank.short}</div>
          </div>
        ))}
      </div>
    </div>
  );
}