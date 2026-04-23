'use client';

interface Props {
  activeTab: 'new' | 'history';
  onChange: (tab: 'new' | 'history') => void;
}

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <div className="flex gap-0.5 bg-gray-100 border border-gray-200 rounded-[9px] p-[3px] mb-5">
      {[
        { key: 'new',     label: '📝 New Form' },
        { key: 'history', label: '🗂️ Form History' },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key as 'new' | 'history')}
          className={`flex-1 py-[7px] px-4 rounded-[7px] text-[12px] font-semibold transition-all ${
            activeTab === tab.key
              ? 'bg-white text-[#0f2744] shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}