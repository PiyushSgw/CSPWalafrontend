import React, { useState } from "react";

type TabId = "wt-ledger" | "wt-recharge" | "wt-requests";

interface Props {
  activeTab?: TabId;
  onTabChange?: (tabId: TabId) => void;
}

export const WalletTabBarSection: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const [internalActive, setInternalActive] = useState<TabId>("wt-ledger");

  const active = activeTab || internalActive;

  const setTab = (id: TabId) => {
    setInternalActive(id);
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