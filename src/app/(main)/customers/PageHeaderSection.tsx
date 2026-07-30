import React from "react";
import type { MappedCustomer } from "./customer";

import { exportCustomersCSV } from "../../../utils/exportCustomersCSV";

// import "./../../styles.css";
interface Props {
  customers: MappedCustomer[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onExportCSV: () => void;
}
export const PageHeaderSection: React.FC<Props> = ({
  customers,
  searchTerm,
  setSearchTerm,
  onExportCSV,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-title">👥 Customer Management</div>
        <div className="page-sub">
          63 customers registered · Search, view, edit, and manage customer records
        </div>
      </div>
      <div className="page-header-actions"><button
        onClick={onExportCSV}
      >
        ⬇️ Export CSV
      </button>
        <button className="btn btn-teal btn-sm" onClick={() => {
          document.getElementById("add-cust-form")?.scrollIntoView({ behavior: "smooth" });
        }}>
          + Add Customer
        </button>
      </div>
    </div>
  );
};