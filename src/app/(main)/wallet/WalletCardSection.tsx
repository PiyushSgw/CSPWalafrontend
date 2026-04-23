import React from "react";

interface CardStatProps {
  title: string;
  icon: string;
  value: string | React.ReactNode;
  desc: string;
}

const CardStat: React.FC<CardStatProps> = ({ title, icon, value, desc }) => {
  return (
    <div className="card" style={{ textAlign: "center", padding: 16 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 20,
          fontWeight: 500,
          color: "var(--navy)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: "var(--ink3)" }}>{desc}</div>
    </div>
  );
};

export const WalletCardSection: React.FC<{ availableBalance: number }> = ({ availableBalance }) => {
  const remainingPrints = Math.floor(availableBalance / 5);

  return (
    <div
      className="wallet-card"
      style={{
        minHeight: "auto",
        margin: "0 0 16px 0",
      }}
    >
      <div className="wc-label">Available Balance</div>
      <div className="wc-amount">
        <span className="wc-rs">₹</span>
        {availableBalance.toFixed(2)}
      </div>
      <div className="wc-sub">≈ {remainingPrints} passbook prints remaining</div>
      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: 12,
          opacity: 0.6,
        }}
      >
        Last recharged ₹500 on 10 Mar 2026
      </div>
    </div>
  );
};