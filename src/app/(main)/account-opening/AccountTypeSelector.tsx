'use client';

interface AccountType {
  id: number;
  label: string;
  value: string;
  icon: string;
  price: string;
}

const accountTypes: AccountType[] = [
  { id: 1, label: 'Savings Account', value: 'savings', icon: '💰', price: '₹10 / print' },
  { id: 2, label: 'Current Account', value: 'current', icon: '🏪', price: '₹12 / print' },
  { id: 3, label: 'Jan Dhan (PMJDY)', value: 'jan_dhan', icon: '🌿', price: '₹8 / print' },
  { id: 4, label: 'Minor Account', value: 'minor', icon: '🧒', price: '₹10 / print' },
];

interface Props {
  selected: string;
  onSelect: (payload: { label: string; value: string }) => void;
}

export default function AccountTypeSelector({ selected, onSelect }: Props) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.8px] text-gray-500">
        Account Type
      </p>

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {accountTypes.map((type) => {
          const isSelected = selected === type.value;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect({ label: type.label, value: type.value })}
              aria-pressed={isSelected}
              className={[
                'rounded-[10px] border-2 px-2.5 py-3 text-center transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/20',
                isSelected
                  ? 'border-teal-600 bg-teal-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-teal-600 hover:bg-teal-50',
              ].join(' ')}
            >
              <span className="mb-2 block text-[20px]">{type.icon}</span>
              <div className="text-[11px] font-bold text-gray-700">{type.label}</div>
              <div className="mt-0.5 text-[10px] text-gray-400">{type.price}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}