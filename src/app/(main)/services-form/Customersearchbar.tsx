'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, Customer, clearList } from '@/redux/slices/customersSlice';
import {
  applyCustomerToFormData,
  setCustomerId,
  AccountOpeningFormData,
} from '@/redux/slices/accountOpeningSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useDebouncedValue } from './Usedebouncedvalue';

/**
 * Maps Customer -> AccountOpeningFormData
 * Handles name as full_name since we can't reliably split it back.
 */
function mapCustomerToFormData(customer: Customer): Partial<AccountOpeningFormData> {
  return {
    customer_id: customer.id,
    full_name: customer.name,
    mobile: customer.mobile,
    account_number: customer.account_number,
    account_type: customer.account_type,
    aadhaar: customer.aadhar_number,
    address: customer.address,
    address_line1: customer.address,
    pin: customer.pin_code,
    photo_url: customer.photo_url,
  };
}

// Fields that trigger overwrite confirmation
const OVERWRITE_CHECK_FIELDS: (keyof AccountOpeningFormData)[] = [
  'full_name',
  'mobile',
  'account_number',
  'aadhaar',
  'address',
  'pin',
];

export default function CustomerSearchBar() {
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector((state: RootState) => state.customers);
  const formData = useSelector((state: RootState) => state.accountOpening.formData);

  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<Customer | null>(null);

  const debouncedQuery = useDebouncedValue(inputValue, 400);

  // Live search on debounced query
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(fetchCustomers({ search: debouncedQuery.trim(), limit: 10 }));
      setShowDropdown(true);
    } else {
      dispatch(clearList());
      setShowDropdown(false);
    }
  }, [debouncedQuery, dispatch]);

  const hasExistingData = useMemo(() => {
    return OVERWRITE_CHECK_FIELDS.some((key) => {
      const value = formData[key];
      return value !== undefined && value !== null && value !== '';
    });
  }, [formData]);

  const applyCustomer = (customer: Customer) => {
    dispatch(applyCustomerToFormData(mapCustomerToFormData(customer)));
    dispatch(setCustomerId(customer.id));
    setInputValue(`${customer.name} - ${customer.mobile}`);
    setShowDropdown(false);
  };

  const handleSelect = (customer: Customer) => {
    if (hasExistingData) {
      setPendingCustomer(customer);
      return;
    }
    applyCustomer(customer);
  };

  const confirmOverwrite = () => {
    if (!pendingCustomer) return;
    applyCustomer(pendingCustomer);
    setPendingCustomer(null);
  };

  return (
    <div className="relative mb-8">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        🔍 Search Existing Customer (Name or Mobile)
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => list.length > 0 && setShowDropdown(true)}
        placeholder="Type customer name or mobile number…"
        className="w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                   transition-all"
      />

      {loading && (
        <div className="absolute right-3 top-11 text-xs text-gray-400 font-medium">
          ⏳ Searching…
        </div>
      )}

      {showDropdown && list.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {list.map((c) => (
            <li
              key={c.id}
              onClick={() => handleSelect(c)}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-emerald-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center transition-colors"
            >
              <div>
                <p className="font-medium text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-500">{c.account_number || 'No A/c'}</p>
              </div>
              <span className="text-gray-400 text-xs font-medium">{c.mobile}</span>
            </li>
          ))}
        </ul>
      )}

      {showDropdown && !loading && list.length === 0 && debouncedQuery.length >= 2 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          No customers found. Continue to enter new customer details below.
        </div>
      )}

      {formData.customer_id && (
        <p className="mt-2 text-xs text-emerald-600 font-medium">
          ✓ Customer ID {formData.customer_id} loaded · A/c {formData.account_number || '—'}
        </p>
      )}

      {/* Overwrite Confirmation Modal */}
      {pendingCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              ⚠️ Replace customer details?
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Selecting <span className="font-semibold">{pendingCustomer.name}</span> will replace 
              the details you've already entered with this customer's saved information.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPendingCustomer(null)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmOverwrite}
                className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-medium"
              >
                Yes, Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}