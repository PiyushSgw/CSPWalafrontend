"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createCustomer, clearError } from "../../../redux/slices/customersSlice";
import { isAuthError } from "../../../utils/authError";

const EMPTY_FORM = {
  name: "",
  mobile: "",
  account_number: "",
  account_type: "savings",
  ifsc: "",
  opening_balance: 0,
  bank_id: 1,
  branch_id: "",
  aadhar_number: "",
  address: "",
  pin_code: "",
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

// Branch data mapped by bank_id
const BRANCHES_BY_BANK: { [key: number]: { id: number; name: string }[] } = {
  1: [
    { id: 1, name: "Main Branch Delhi" },
  ],
  2: [
    { id: 2, name: "Branch Mumbai" },
    { id: 3, name: "Indore" },
    { id: 4, name: "Bank of Baroda Indore" },
    { id: 5, name: "Bank of Baroda Bhopal" },
  ],
  3: [
    { id: 6, name: "PNB Jaipur Main" },
    { id: 7, name: "PNB Lucknow" },
  ],
  4: [
    { id: 8, name: "Canara Bank Pune" },
    { id: 9, name: "Canara Bank Chennai" },
  ],
  5: [
    { id: 10, name: "Union Bank Hyderabad" },
  ],
  6: [
    { id: 11, name: "Bank of India Surat" },
  ],
  7: [
    { id: 12, name: "Indian Bank Nagpur" },
  ],
  8: [
    { id: 13, name: "Central Bank Patna" },
  ],
  9: [],
  10: [],
};

export const AddCustomerForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creating, createError } = useAppSelector((s) => s.customers);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof EMPTY_FORM, v: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [k]: v };
      // Reset branch_id when bank changes
      if (k === "bank_id") {
        updated.branch_id = "";
      }
      return updated;
    });
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const submitAndCreate = () => {
    dispatch(clearError());
    const payload: any = {
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
    };

    if (formData.account_number) payload.account_number = formData.account_number.trim();
    if (formData.account_type) payload.account_type = formData.account_type;
    if (formData.ifsc) payload.ifsc = formData.ifsc.trim();
    if (formData.bank_id) payload.bank_id = Number(formData.bank_id);
    if (formData.branch_id) payload.branch_id = Number(formData.branch_id);
    if (formData.opening_balance) payload.opening_balance = Number(formData.opening_balance);
    if (formData.aadhar_number) payload.aadhar_number = formData.aadhar_number.trim();
    if (formData.address) payload.address = formData.address.trim();
    if (formData.pin_code) payload.pin_code = formData.pin_code.trim();

    return dispatch(createCustomer(payload));
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

  // Get branches for selected bank
  const availableBranches = BRANCHES_BY_BANK[formData.bank_id as number] || [];

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
            <label className="form-label">
              Mobile Number <span className="req">*</span>
            </label>
            <input
              className="form-input"
              type="tel"
              placeholder="9123456789"
              value={formData.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Aadhar Number (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="12 digit aadhar number"
              value={formData.aadhar_number}
              onChange={(e) => set("aadhar_number", e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Address (Optional)</label>
            <textarea
              className="form-input"
              placeholder="Full address"
              value={formData.address}
              onChange={(e) => set("address", e.target.value)}
              style={{ minHeight: 80 }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Pin Code (Optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="6 digit pin code"
              value={formData.pin_code}
              onChange={(e) => set("pin_code", e.target.value)}
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
            <label className="form-label">Account Type (Optional)</label>
            <select
              className="form-select"
              value={formData.account_type}
              onChange={(e) => set("account_type", e.target.value)}
            >
              <option value="">Select Account Type</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="jan_dhan">Jan Dhan (PMJDY)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Bank Name (Optional)</label>
            <select
              className="form-select"
              value={formData.bank_id}
              onChange={(e) => set("bank_id", Number(e.target.value))}
            >
              <option value="">Select Bank</option>
              {BANK_OPTIONS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.id} - {bank.name} ({bank.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Branch (Optional)</label>
            <select
              className="form-select"
              value={formData.branch_id}
              onChange={(e) => set("branch_id", e.target.value ? Number(e.target.value) : "")}
              disabled={!formData.bank_id || availableBranches.length === 0}
            >
              <option value="">
                {!formData.bank_id
                  ? "Select a bank first"
                  : availableBranches.length === 0
                  ? "No branches available"
                  : "Select Branch"}
              </option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
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

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Opening Balance (₹) (Optional)</label>
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