"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createCustomer, clearError, fetchBranchesByBankId } from "../../../redux/slices/customersSlice";
import type { Branch } from "../../../redux/slices/customersSlice";
import { isAuthError } from "../../../utils/authError";

const EMPTY_FORM = {
  name: "",
  mobile: "",
  account_number: "",
  account_type: "",
  ifsc: "",
  opening_balance: 0,
  bank_id: "",
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("csp_access_token");
};

export const AddCustomerForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { creating, createError, branches, branchesLoading } = useAppSelector((s) => s.customers);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [success, setSuccess] = useState(false);
  const [branchRequestOpen, setBranchRequestOpen] = useState(false);
  const [branchReqName, setBranchReqName] = useState("");
  const [branchReqIfsc, setBranchReqIfsc] = useState("");
  const [branchReqCity, setBranchReqCity] = useState("");
  const [branchReqRemarks, setBranchReqRemarks] = useState("");
  const [branchReqSubmitting, setBranchReqSubmitting] = useState(false);
  const [branchReqSuccess, setBranchReqSuccess] = useState(false);
  const [branchReqError, setBranchReqError] = useState("");

  useEffect(() => {
    if (formData.bank_id) {
      dispatch(fetchBranchesByBankId(Number(formData.bank_id)));
    }
  }, [formData.bank_id, dispatch]);

  const set = (k: keyof typeof EMPTY_FORM, v: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [k]: v };
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

  const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  const handleRequestBranch = async () => {
    if (!branchReqName.trim() || !branchReqIfsc.trim()) return;
    if (!IFSC_REGEX.test(branchReqIfsc.trim())) {
      setBranchReqError("Invalid IFSC format — expected 4 letters, then 0, then 6 alphanumeric characters (e.g. SBIN0004521)");
      return;
    }
    setBranchReqSubmitting(true);
    setBranchReqError("");

    try {
      const token = getAuthToken();
      if (!token) {
        setBranchReqError("Authentication required. Please log in again.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/csp/branch-requests`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          bank_id: Number(formData.bank_id),
          branch_name: branchReqName.trim(),
          ifsc: branchReqIfsc.trim(),
          city: branchReqCity.trim() || undefined,
          remarks: branchReqRemarks.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || `HTTP ${response.status}`);

      setBranchReqSuccess(true);
      setBranchReqName("");
      setBranchReqIfsc("");
      setBranchReqCity("");
      setBranchReqRemarks("");
      setTimeout(() => {
        setBranchRequestOpen(false);
        setBranchReqSuccess(false);
      }, 2000);
    } catch (err: any) {
      setBranchReqError(err.message || "Failed to submit branch request");
    } finally {
      setBranchReqSubmitting(false);
    }
  };

  const errorMsg = createError
    ? isAuthError(createError)
      ? "Session expired — please log in again."
      : createError
    : null;

  const selectedBank = BANK_OPTIONS.find((b) => b.id === Number(formData.bank_id));

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
              onChange={(e) => set("bank_id", e.target.value ? Number(e.target.value) : "")}
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
              disabled={!formData.bank_id}
            >
              <option value="">
                {!formData.bank_id
                  ? "Select a bank first"
                  : branchesLoading
                  ? "Loading branches..."
                  : branches.length === 0
                  ? "No branches available"
                  : "Select Branch"}
              </option>
              {branches.map((branch: Branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {formData.bank_id && !branchesLoading && branches.length === 0 && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ marginTop: 8, fontSize: 13, padding: "6px 14px" }}
                onClick={() => setBranchRequestOpen(true)}
              >
                Request Branch
              </button>
            )}
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

      {branchRequestOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setBranchRequestOpen(false);
              setBranchReqError("");
              setBranchReqSuccess(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        >
          <div className="bg-white w-full max-w-[480px] rounded-[14px] shadow-xl border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
              <h2 className="text-[15px] font-bold text-[#111827]">Request New Branch</h2>
              <button
                onClick={() => {
                  setBranchRequestOpen(false);
                  setBranchReqError("");
                  setBranchReqSuccess(false);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] text-[#6b7280] text-[18px] leading-none"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-5 flex flex-col gap-4">
              {branchReqSuccess ? (
                <div style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, background: "var(--color-background-success)", color: "var(--color-text-success)" }}>
                  Branch request submitted successfully! The admin will review and add the branch.
                </div>
              ) : (
                <>
                  {branchReqError && (
                    <div style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, background: "var(--color-background-danger)", color: "var(--color-text-danger)", marginBottom: 8 }}>
                      {branchReqError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#374151]">Bank</label>
                    <input
                      type="text"
                      className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#6b7280] bg-[#f9fafb] cursor-not-allowed w-full"
                      value={selectedBank ? `${selectedBank.name} (${selectedBank.shortCode})` : ""}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#374151]">
                      Branch Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full"
                      placeholder="Enter branch name"
                      value={branchReqName}
                      onChange={(e) => setBranchReqName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#374151]">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full"
                      placeholder="e.g. SBIN0004521"
                      maxLength={11}
                      value={branchReqIfsc}
                      onChange={(e) => setBranchReqIfsc(e.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#374151]">City (Optional)</label>
                    <input
                      type="text"
                      className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full"
                      placeholder="Enter city"
                      value={branchReqCity}
                      onChange={(e) => setBranchReqCity(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-[#374151]">Remarks (Optional)</label>
                    <textarea
                      className="h-[80px] px-3 py-2 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full resize-none"
                      placeholder="Any additional details"
                      value={branchReqRemarks}
                      onChange={(e) => setBranchReqRemarks(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {!branchReqSuccess && (
              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
                <button
                  onClick={() => {
                    setBranchRequestOpen(false);
                    setBranchReqError("");
                  }}
                  className="h-[36px] px-4 rounded-[8px] border border-[#d1d5db] text-[13px] font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestBranch}
                  disabled={branchReqSubmitting || !branchReqName.trim() || !branchReqIfsc.trim()}
                  className="h-[36px] px-5 rounded-[8px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[13px] font-bold transition-colors disabled:opacity-50"
                >
                  {branchReqSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
