import React from "react";
import type { MappedPrintJob } from "./printHistory";

debugger
type JobTypeLabel = MappedPrintJob["type"];
const JobTypeBadge: React.FC<{ type: JobTypeLabel }> = ({ type }) => {
  const isNavy = ["Passbook", "Acct Form", "Jan Dhan"].includes(type);
  return <span className={`badge ${isNavy ? "navy" : "sky"}`}>{type}</span>;
};

const statusClass: Record<MappedPrintJob["status"], string> = {
  Printed: "badge green",
  Failed:  "badge red",
  Pending: "badge amber",
};

export const PrintJobRow: React.FC<MappedPrintJob> = ({
  id, dateTime, customer, bank, type, pages, charge, status, isFree,
}) => (
  <tr>
    <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}>
      {id}
    </td>
    <td style={{ fontSize: 12 }}>{dateTime}</td>
    <td style={{ fontWeight: 500 }}>{customer}</td>
    <td>{bank}</td>
    <td><JobTypeBadge type={type} /></td>
    <td style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{pages}</td>
    <td style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-danger)", fontSize: 13 }}>
      {charge}
    </td>
    <td><span className={statusClass[status]}>{status}</span></td>
    <td>
      <button className={`btn ${isFree ? "btn-teal" : "btn-outline"} btn-xs`}>
        Reprint{isFree ? " (Free)" : ""}
      </button>
    </td>
  </tr>
);