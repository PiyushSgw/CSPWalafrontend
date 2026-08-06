"use client";

import React, { useEffect, useState } from "react";
import { MappedCustomer } from "./customer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchBranchesByBankId } from "../../../redux/slices/customersSlice";
import type { Branch } from "../../../redux/slices/customersSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: MappedCustomer | null;
  onUpdate: (data: MappedCustomer) => void;
}

type AccountType = "Savings" | "Current" | "Jan Dhan";

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

const EditCustomerModal: React.FC<Props> = ({ isOpen, onClose, editData, onUpdate }) => {
  const dispatch = useAppDispatch();
  const { branches, branchesLoading } = useAppSelector((s) => s.customers);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    account_number: "",
    bank: "",
    bank_id: "",
    branch_id: "",
    type: "Savings" as AccountType,
    lastPrint: "",
    fetchedAt: "",
    aadhar_number: "",
    address: "",
    pin_code: "",
    ifsc: "",
    opening_balance: 0,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        mobile: editData.mobile || "",
        account_number: editData.account_number || "",
        bank: editData.bank || "",
        bank_id: editData.bank_id ? String(editData.bank_id) : "",
        branch_id: editData.branch_id ? String(editData.branch_id) : "",
        type: (editData.type as AccountType) || "Savings",
        lastPrint: editData.lastPrint || "",
        fetchedAt: editData.fetchedAt || "",
        aadhar_number: editData.aadhar_number || "",
        address: editData.address || "",
        pin_code: editData.pin_code || "",
        ifsc: editData.ifsc || "",
        opening_balance: editData.opening_balance ?? 0,
      });
    }
  }, [editData]);

  useEffect(() => {
    if (formData.bank_id) {
      dispatch(fetchBranchesByBankId(Number(formData.bank_id)));
    }
  }, [formData.bank_id, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: name === "bank_id" ? value : value,
      };
      // Reset branch_id when bank changes
      if (name === "bank_id") {
        updated.branch_id = "";
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    if (!editData) return;
    onUpdate({
      ...editData,
      name: formData.name,
      mobile: formData.mobile,
      account_number: formData.account_number,
      accountShort: formData.account_number ? `XXXX ${formData.account_number.slice(-4)}` : "XXXX",
      bank: formData.bank,
      bank_id: formData.bank_id ? Number(formData.bank_id) : undefined,
      branch_id: formData.branch_id ? Number(formData.branch_id) : null,
      aadhar_number: formData.aadhar_number,
      address: formData.address,
      pin_code: formData.pin_code,
      photo_url: editData.photo_url,
      ifsc: formData.ifsc,
      opening_balance: Number(formData.opening_balance) || 0,
      type: formData.type,
      lastPrint: formData.lastPrint,
      fetchedAt: formData.fetchedAt,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white w-full max-w-[480px] rounded-[14px] shadow-xl border border-[#e5e7eb] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] font-bold text-[#111827]">Edit Customer Details</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] text-[#6b7280] text-[18px] leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Name - Required */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className={fieldCls}
              required
            />
          </div>

          {/* Mobile - Required */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              maxLength={10}
              className={fieldCls}
              required
            />
          </div>

          {/* Aadhar Number - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Aadhar Number (Optional)</label>
            <input
              type="text"
              name="aadhar_number"
              value={formData.aadhar_number}
              onChange={handleChange}
              placeholder="12 digit aadhar number"
              maxLength={12}
              className={fieldCls}
            />
          </div>

          {/* Address - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Address (Optional)</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full address"
              className={`${fieldCls} resize-none`}
              style={{ minHeight: 80 }}
            />
          </div>

          {/* Pin Code - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Pin Code (Optional)</label>
            <input
              type="text"
              name="pin_code"
              value={formData.pin_code}
              onChange={handleChange}
              placeholder="6 digit pin code"
              maxLength={6}
              className={fieldCls}
            />
          </div>

          {/* Account Number - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Account Number (Optional)</label>
            <input
              type="text"
              name="account_number"
              value={formData.account_number}
              onChange={handleChange}
              placeholder="Enter account number"
              className={fieldCls}
            />
          </div>

          {/* Bank Name Dropdown - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Bank Name (Optional)</label>
            <select
              name="bank_id"
              value={formData.bank_id}
              onChange={handleChange}
              className={fieldCls}
            >
              <option value="">Select Bank</option>
              {BANK_OPTIONS.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.id} - {bank.name} ({bank.shortCode})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown - Optional & Dynamic */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Branch (Optional)</label>
            <select
              name="branch_id"
              value={formData.branch_id}
              onChange={handleChange}
              disabled={!formData.bank_id}
              className={fieldCls}
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
          </div>

          {/* Account Type - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Account Type (Optional)</label>
            <select name="type" value={formData.type} onChange={handleChange} className={fieldCls}>
              <option value="">Select Account Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Jan Dhan">Jan Dhan</option>
            </select>
          </div>

          {/* IFSC Code - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">IFSC Code (Optional)</label>
            <input
              type="text"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              placeholder="e.g. SBIN0004521"
              className={fieldCls}
            />
          </div>

          {/* Opening Balance - Optional */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Opening Balance (₹) (Optional)</label>
            <input
              type="number"
              name="opening_balance"
              value={formData.opening_balance || ""}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={fieldCls}
            />
          </div>

          {/* Last Print Date - Read Only */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Last Print Date</label>
            <input
              type="text"
              name="lastPrint"
              value={formData.lastPrint}
              disabled
              className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#6b7280] bg-[#f9fafb] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
          <button
            onClick={onClose}
            className="h-[36px] px-4 rounded-[8px] border border-[#d1d5db] text-[13px] font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="h-[36px] px-5 rounded-[8px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[13px] font-bold transition-colors"
          >
            Update Customer
          </button>
        </div>
      </div>
    </div>
  );
};

const fieldCls =
  "h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full";

export default EditCustomerModal;