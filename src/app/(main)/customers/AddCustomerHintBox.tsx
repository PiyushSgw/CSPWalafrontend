import React from "react";
// import "./../../styles.css";

export const AddCustomerHintBox: React.FC = () => {
  return (
    <div className="alert-box info" style={{ marginTop: 12 }}>
      <div className="alert-icon">💡</div>
      <div className="alert-body">
        <strong>Tip:</strong> Save a customer first, then reuse their details for both
        passbook printing and account opening forms without re‑entering data.
      </div>
    </div>
  );
};