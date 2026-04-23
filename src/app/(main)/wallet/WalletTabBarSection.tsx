import React, { useState } from "react";

type TabId = "wt-ledger" | "wt-recharge" | "wt-requests";

interface Props {
  onTabChange?: (tabId: TabId) => void;
}

export const WalletTabBarSection: React.FC<Props> = ({ onTabChange }) => {
  const [active, setActive] = useState<TabId>("wt-ledger");

  const setTab = (id: TabId) => {
    setActive(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <div className="tab-bar" style={{ maxWidth: 440 }}>
      <button
        className={`tab-item ${active === "wt-ledger" ? "active" : ""}`}
        onClick={() => setTab("wt-ledger")}
      >
        📊 Ledger
      </button>
      <button
        className={`tab-item ${active === "wt-recharge" ? "active" : ""}`}
        onClick={() => setTab("wt-recharge")}
      >
        + Recharge Wallet
      </button>
      <button
        className={`tab-item ${active === "wt-requests" ? "active" : ""}`}
        onClick={() => setTab("wt-requests")}
      >
        📋 My Requests
      </button>
    </div>
  );
};