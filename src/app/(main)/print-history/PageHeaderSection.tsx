import React from "react";

export const PageHeaderSection: React.FC = () => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-title">🗂️ Print History</div>
        <div className="page-sub">
          Complete log of all print jobs — passbooks and account forms
        </div>
      </div>
      <div className="page-header-actions">
        <button className="btn btn-outline btn-sm">📅 Filter by Date</button>
        <button className="btn btn-outline btn-sm">⬇️ Export CSV</button>
      </div>
    </div>
  );
};