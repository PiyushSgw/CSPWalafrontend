import React from 'react'
import { WalletTransaction } from "@/redux/slices/walletSlice"

export const Totalvalue = ({ 
  passbooks = 118,
  forms = 24,
  spent = 830,
  recharged = 1500,
  onRechargeClick = () => {}
}) => {
  const stats = [
    { icon: '📖', value: passbooks, label: 'Passbooks this month', color: 'navy' },
    { icon: '📋', value: forms, label: 'Forms this month', color: 'navy' },
    { icon: '💸', value: `₹${spent.toLocaleString('en-IN')}`, label: 'Spent this month', color: 'red' },
    { icon: '💳', value: `₹${recharged.toLocaleString('en-IN')}`, label: 'Total recharged', color: 'green' }
  ]

  return (
    <div className="pl-20 w-full">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '12px'
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
              padding: '16px',
              border: '1px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              backgroundColor: 'var(--color-background-secondary)'
            }}
          >
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '20px',
                fontWeight: '500',
                color: `var(--${stat.color})`
              }}
            >
              {stat.value}
            </div>

            <div style={{
              fontSize: '11px',
              color: 'var(--color-text-tertiary)',
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <button
  onClick={onRechargeClick}
  style={{
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#0d8f72',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
    fontFamily: 'var(--font-sans)',
    textAlign: 'left'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#13997c';
    e.currentTarget.style.transform = 'translateY(-1px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#0d8f72';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  + Request Recharge Now
</button>
    </div>
  )
}