'use client';

const accountTypes = [
  { name: 'Savings Account', icon: '💰', price: '₹10 / print' },
  { name: 'Current Account', icon: '🏪', price: '₹12 / print' },
  { name: 'Jan Dhan (PMJDY)', icon: '🌿', price: '₹8 / print' },
  { name: 'Minor Account', icon: '🧒', price: '₹10 / print' },
];

interface Props {
  selected: string;
  onSelect: (type: string) => void;
}

export default function AccountTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.8px] mb-3">
        Account Type
      </p>
      <div className="grid grid-cols-4 gap-3 mb-5">
        {accountTypes.map((type) => (
          <div
            key={type.name}
            onClick={() => onSelect(type.name)}
            className={`border-2 rounded-[10px] py-3 px-2.5 cursor-pointer text-center transition-all ${
              selected === type.name
                ? 'border-teal-600 bg-teal-50'
                : 'border-gray-200 bg-white hover:border-teal-600 hover:bg-teal-50'
            }`}
          >
            <span className="text-[20px] mb-2 block">{type.icon}</span>
            <div className="text-[11px] font-bold text-gray-700">{type.name}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{type.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}