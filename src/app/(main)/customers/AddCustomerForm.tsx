"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createCustomer, clearError } from "../../../redux/slices/customersSlice";
import { isAuthError } from "../../../utils/authError";

const EMPTY_FORM = {
  name: "",
  account_number: "",
  account_type: "savings",
  ifsc: "",
  mobile: "",
  opening_balance: 0,
  bank_id: 1,
};

const BANK_OPTIONS = [
  { id: 1, name: "State Bank of India", shortCode: "SBI" },
  { id: 2, name: "Bank of Baroda", shortCode: "BOB" },
  { id: 3, name: "Punjab National Bank", shortCode: "PNB" },
  { id: 4, name: "Canara Bank", shortCode: "CNB" },
  { id: 5, name: "Union Bank of India", shortCode: "UBI" },
  { id: 6, name: "Bank of India", shortCode: "BOI" },
  { id: 7, name: "Indian Bank", shortCode: "IB" },
  { id: 8, name: "Central Bank of India", shortCode: "CBI" },
  { id: 9, name: "UCO Bank", shortCode: "UCO" },
  { id: 10, name: "Indian Overseas Bank", shortCode: "IOB" },
];

export const AddCustomerForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creating, createError } = useAppSelector((s) => s.customers);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof EMPTY_FORM, v: string | number) =>
    setFormData((prev) => ({ ...prev, [k]: v }));

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const submitAndCreate = () => {
    dispatch(clearError());
    return dispatch(
      createCustomer({
        name: formData.name.trim(),
        account_number: formData.account_number.trim(),
        account_type: formData.account_type,
        ifsc: formData.ifsc.trim(),
        bank_id: Number(formData.bank_id),
        branch_id: 0,
        mobile: formData.mobile.trim(),
        opening_balance: Number(formData.opening_balance),
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitAndCreate();
    if (createCustomer.fulfilled.match(result)) resetForm();
  };

  const handleSaveAndPrint = async () => {
    const result = await submitAndCreate();
    if (createCustomer.fulfilled.match(result)) {
      resetForm();
      router.push("/passbook");
    }
  };

  const errorMsg = createError
    ? isAuthError(createError)
      ? "Session expired — please log in again."
      : createError
    : null;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Add New Customer</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          {success && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                background: "var(--color-background-success)",
                color: "var(--color-text-success)",
              }}
            >
              Customer saved successfully.
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                background: "var(--color-background-danger)",
                color: "var(--color-text-danger)",
              }}
            >
              {errorMsg}
              {isAuthError(createError!) && (
                <>
                  {" "}
                  &nbsp;
                  <a href="/login" style={{ color: "inherit", fontWeight: 500 }}>
                    Log in again
                  </a>
                </>
              )}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Name as per bank records"
              value={formData.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Account Number (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="Bank account number (if available)"
              value={formData.account_number}
              onChange={(e) => set("account_number", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">
              Account Type <span className="req">*</span>
            </label>
            <select
              className="form-select"
              value={formData.account_type}
              onChange={(e) => set("account_type", e.target.value)}
              required
            >
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="jan_dhan">Jan Dhan (PMJDY)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">
              Bank Name <span className="req">*</span>
            </label>
            <select
              className="form-select"
              value={formData.bank_id}
              onChange={(e) => set("bank_id", Number(e.target.value))}
              required
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.id} - {bank.name} ({bank.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">IFSC Code (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. SBIN0004521 (if available)"
              value={formData.ifsc}
              onChange={(e) => set("ifsc", e.target.value.toUpperCase())}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Mobile Number (Optional)</label>
            <input
              className="form-input"
              type="tel"
              placeholder="9123456789"
              value={formData.mobile}
              onChange={(e) => set("mobile", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Opening Balance (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.opening_balance || ""}
              onChange={(e) => set("opening_balance", Number(e.target.value) || 0)}
            />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="submit"
              className="btn btn-teal"
              style={{ flex: 1 }}
              disabled={creating}
            >
              {creating ? "Saving..." : "Save Customer"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ flex: 1 }}
              disabled={creating}
              onClick={handleSaveAndPrint}
            >
              {creating ? "Saving..." : "Save & Print Passbook"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};