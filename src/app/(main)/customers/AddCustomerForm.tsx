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
};

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

  // ── shared: build payload + dispatch once ──────────────
  const submitAndCreate = () => {
    debugger;
    dispatch(clearError());
    return dispatch(
      createCustomer({
        name: formData.name.trim(),
        account_number: formData.account_number.trim(),
        account_type: formData.account_type,
        ifsc: formData.ifsc.trim(),
        bank_id: 1,      // TODO: get from props / selector
        branch_id: 0,    // TODO: must not be 0 — server rejects it
        mobile: formData.mobile.trim(),
        opening_balance: Number(formData.opening_balance),
      })
    );
  };

  // ── save only ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitAndCreate();
    if (createCustomer.fulfilled.match(result)) resetForm();
  };

  // ── save + go to passbook ──────────────────────────────
  const handleSaveAndPrint = async () => {
    const result = await submitAndCreate();
    if (createCustomer.fulfilled.match(result)) {
      resetForm();
      router.push("/passbook");
    }
  };

  // ── classify error for user-facing message ─────────────
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

          {/* ── success banner ── */}
          {success && (
            <div style={{
              marginBottom: 16, padding: "10px 14px",
              borderRadius: 8, fontSize: 13,
              background: "var(--color-background-success)",
              color: "var(--color-text-success)",
            }}>
              Customer saved successfully.
            </div>
          )}

          {/* ── error banner ── */}
          {errorMsg && (
            <div style={{
              marginBottom: 16, padding: "10px 14px",
              borderRadius: 8, fontSize: 13,
              background: "var(--color-background-danger)",
              color: "var(--color-text-danger)",
            }}>
              {errorMsg}
              {isAuthError(createError!) && (
                <> &nbsp;<a href="/login" style={{ color: "inherit", fontWeight: 500 }}>
                  Log in again
                </a></>
              )}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Full Name <span className="req">*</span></label>
            <input className="form-input" type="text"
              placeholder="Name as per bank records"
              value={formData.name}
              onChange={(e) => set("name", e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Account Number <span className="req">*</span></label>
            <input className="form-input" type="text"
              placeholder="Bank account number"
              value={formData.account_number}
              onChange={(e) => set("account_number", e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Account Type <span className="req">*</span></label>
            <select className="form-select" value={formData.account_type}
              onChange={(e) => set("account_type", e.target.value)} required>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="jan_dhan">Jan Dhan (PMJDY)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">IFSC Code <span className="req">*</span></label>
            <input className="form-input" type="text"
              placeholder="e.g. SBIN0004521"
              value={formData.ifsc}
              onChange={(e) => set("ifsc", e.target.value.toUpperCase())} required />
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Mobile Number</label>
            <input className="form-input" type="tel"
              placeholder="9123456789"
              value={formData.mobile}
              onChange={(e) => set("mobile", e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Opening Balance (₹)</label>
            <input className="form-input" type="number" min="0" step="0.01"
              placeholder="0.00"
              value={formData.opening_balance || ""}
              onChange={(e) => set("opening_balance", Number(e.target.value) || 0)} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-teal"
              style={{ flex: 1 }} disabled={creating}>
              {creating ? "Saving..." : "Save Customer"}
            </button>
            <button type="button" className="btn btn-outline"
              style={{ flex: 1 }} disabled={creating}
              onClick={handleSaveAndPrint}>
              {creating ? "Saving..." : "Save & Print Passbook"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};