import React from "react";
import { CustomerRow } from "./CustomerRow";
import { ApiMeta, Customer, MappedCustomer } from "./customer";
// import "./../../styles.css";

interface Props {
  customers: MappedCustomer[];
  meta?: ApiMeta;
  loading?: boolean;
}

export const CustomerListSection: React.FC<Props> = ({ customers }) => {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">All Customers</div>
          <div className="search-bar" style={{ width: 260 }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Name, account no., mobile..."
              className="form-input"
            />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Account No.</th>
                <th>Bank</th>
                <th>Type</th>
                <th>Last Print</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust, i) => (
                <CustomerRow key={i} customer={cust} />
              ))}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--ink3)",
          }}
        >
          <span>Showing 7 of 63 customers</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-xs">← Prev</button>
            <span
              style={{
                padding: "4px 8px",
                background: "var(--navy)",
                color: "white",
                borderRadius: 5,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              1
            </span>
            <button className="btn btn-ghost btn-xs" style={{ color: "var(--ink3)" }}>
              2
            </button>
            <button className="btn btn-ghost btn-xs">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};