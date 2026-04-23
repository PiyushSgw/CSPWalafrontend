import React from "react";
// import "./../../styles.css";

export const PageHeaderSection: React.FC = () => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-title">👥 Customer Management</div>
        <div className="page-sub">
          63 customers registered · Search, view, edit, and manage customer records
        </div>
      </div>
      <div className="page-header-actions">
        <button className="btn btn-outline btn-sm">⬇️ Export CSV</button>
        <button className="btn btn-teal btn-sm" onClick={() => {
          document.getElementById("add-cust-form")?.scrollIntoView({ behavior: "smooth" });
        }}>
          + Add Customer
        </button>
      </div>
    </div>
  );
};