"use client";

import React, { useEffect, useState } from "react";
import { MappedCustomer } from "./customer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData: MappedCustomer | null;
  onUpdate: (data: MappedCustomer) => void;
}

type AccountType = "Savings" | "Current" | "Jan Dhan";

const EditCustomerModal: React.FC<Props> = ({ isOpen, onClose, editData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    account_number: "",
    bank: "",
    type: "Savings" as AccountType,
    lastPrint: "",
    fetchedAt: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name:           editData.name           || "",
        mobile:         editData.mobile         || "",
        account_number: editData.account_number || "",
        bank:           editData.bank           || "",
        type:           (editData.type as AccountType) || "Savings",
        lastPrint:      editData.lastPrint      || "",
        fetchedAt:      editData.fetchedAt      || "",
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!editData) return;
    onUpdate({
      ...editData,
      name:           formData.name,
      mobile:         formData.mobile,
      account_number: formData.account_number,
      accountShort:   formData.account_number ? `XXXX ${formData.account_number.slice(-4)}` : "XXXX",
      bank:           formData.bank,
      type:           formData.type,
      lastPrint:      formData.lastPrint,
      fetchedAt:      formData.fetchedAt,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white w-full max-w-[480px] rounded-[14px] shadow-xl border border-[#e5e7eb] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <h2 className="text-[15px] font-bold text-[#111827]">Edit Customer Details</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] text-[#6b7280] text-[18px] leading-none">×</button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Customer Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Enter customer name" className={fieldCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Mobile Number</label>
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange}
              placeholder="Enter mobile number" maxLength={10} className={fieldCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Account Number</label>
            <input type="text" name="account_number" value={formData.account_number} onChange={handleChange}
              placeholder="Enter account number" className={fieldCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Bank Name</label>
            <input type="text" name="bank" value={formData.bank} onChange={handleChange}
              placeholder="Enter bank name" className={fieldCls} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Account Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className={fieldCls}>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Jan Dhan">Jan Dhan</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-semibold text-[#374151]">Last Print Date</label>
            <input type="text" name="lastPrint" value={formData.lastPrint} disabled
              className="h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#6b7280] bg-[#f9fafb] cursor-not-allowed" />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
          <button onClick={onClose}
            className="h-[36px] px-4 rounded-[8px] border border-[#d1d5db] text-[13px] font-semibold text-[#374151] hover:bg-[#f3f4f6] transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="h-[36px] px-5 rounded-[8px] bg-[#0d8f72] hover:bg-[#0b7a62] text-white text-[13px] font-bold transition-colors">
            Update Customer
          </button>
        </div>

      </div>
    </div>
  );
};

const fieldCls = "h-[40px] px-3 rounded-[8px] border border-[#d1d5db] text-[13px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0d8f72] focus:ring-1 focus:ring-[#0d8f72] transition-all bg-white w-full";

export default EditCustomerModal;