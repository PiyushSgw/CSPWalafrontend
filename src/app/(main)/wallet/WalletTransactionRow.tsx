import React from "react";

interface Props {
  dateTime: string;
  desc: string;
  type: "Debit" | "Credit";
  amount: string;
  balanceAfter: string;
}

export const WalletTransactionRow: React.FC<Props> = ({ dateTime, desc, type, amount, balanceAfter }) => {
  return (
    <tr>
      <td style={{ fontSize: 12 }}>{dateTime}</td>
      <td>{desc}</td>
      <td>
        <span className={`badge ${type === "Debit" ? "red" : "green"}`}>{type}</span>
      </td>
      <td
        style={{
          fontFamily: "'DM Mono', monospace",
          color: type === "Debit" ? "var(--red)" : "var(--green)",
        }}
      >
        {amount}
      </td>
      <td
        style={{
          fontFamily: "'DM Mono', monospace",
          fontWeight: 600,
        }}
      >
        {balanceAfter}
      </td>
    </tr>
  );
};