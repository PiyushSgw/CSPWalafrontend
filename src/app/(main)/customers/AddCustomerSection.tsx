import React from "react";
import { AddCustomerForm } from "./AddCustomerForm";
import { AddCustomerHintBox } from "./AddCustomerHintBox";
// import "./../../styles.css";

export const AddCustomerSection: React.FC = () => {
  return (
    <div id="add-cust-form" style={{ position: "sticky", top: 80 }}>
      <AddCustomerForm />
      <AddCustomerHintBox />
    </div>
  );
};