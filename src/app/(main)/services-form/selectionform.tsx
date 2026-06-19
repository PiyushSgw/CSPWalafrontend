'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedBank,
  setSelectedType,
  setStep,
} from '@/redux/slices/accountOpeningSlice';
import { BANKS_LIST, ACCOUNT_TYPES } from './formfield';
import { RootState } from '@/redux/store';

interface Phase1Props {
  onNext: () => void;
}

export const Phase1SelectionForm: React.FC<Phase1Props> = ({ onNext }) => {
  const dispatch = useDispatch();
  const { selectedBank, selectedType } = useSelector(
    (state: RootState) => state.accountOpening
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBankSelect = (bankName: string, bankId: number) => {
    dispatch(setSelectedBank({ bankName, bankId }));
    setErrors((prev) => ({ ...prev, bank: '' }));
  };

  const handleAccountTypeSelect = (label: string, value: string) => {
    dispatch(setSelectedType({ label, value }));
    setErrors((prev) => ({ ...prev, accountType: '' }));
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedBank) newErrors.bank = 'Please select a bank';
    if (!selectedType) newErrors.accountType = 'Please select an account type';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(setStep(2));
    onNext();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-emerald-700 mb-2">
                Service Request Form
              </h1>
              <p className="text-gray-500">SRF-1</p>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            Step 1 of 3: Select Bank & Account Type
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">

          {/* Bank Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Bank</h2>
            {errors.bank && (
              <p className="mb-4 text-sm text-red-600 font-medium">{errors.bank}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BANKS_LIST.map((bank) => {
                const isSelected = selectedBank === bank.name;
                return (
                  <div
                    key={bank.id}
                    onClick={() => handleBankSelect(bank.name, bank.id)}
                    className={`flex flex-col items-center justify-center py-8 px-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    <span className="text-4xl mb-3">🏦</span>
                    <p className="text-sm font-semibold text-gray-800 text-center leading-snug">
                      {bank.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{bank.code}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Type Selection */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Account Type</h2>
            {errors.accountType && (
              <p className="mb-4 text-sm text-red-600 font-medium">{errors.accountType}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ACCOUNT_TYPES.map((type) => {
                const isSelected = selectedType === type.value;
                return (
                  <div
                    key={type.value}
                    onClick={() => handleAccountTypeSelect(type.label, type.value)}
                    className={`flex flex-col items-center justify-center py-8 px-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                    }`}
                  >
                    <span className="text-4xl mb-3">💰</span>
                    <p className="text-sm font-semibold text-gray-800 text-center leading-snug">
                      {type.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};