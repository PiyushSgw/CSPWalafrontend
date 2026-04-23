import React from "react";
import type { TabId } from "./page";

interface Props {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export const ProfileTabBarSection: React.FC<Props> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      className="tab-bar"
      style={{ maxWidth: 560, marginBottom: 20 }}
    >
      <button
        className={`tab-item ${activeTab === "pt-personal" ? "active" : ""}`}
        onClick={() => onTabChange("pt-personal")}
      >
        Personal Info
      </button>

      <button
        className={`tab-item ${activeTab === "pt-bank" ? "active" : ""}`}
        onClick={() => onTabChange("pt-bank")}
      >
        CSP & Bank Setup
      </button>

      <button
        className={`tab-item ${activeTab === "pt-docs" ? "active" : ""}`}
        onClick={() => onTabChange("pt-docs")}
      >
        Documents / KYC
      </button>

      <button
        className={`tab-item ${activeTab === "pt-security" ? "active" : ""}`}
        onClick={() => onTabChange("pt-security")}
      >
        Security
      </button>
    </div>
  );
};