'use client';

import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFormField, setStep, generatePreview } from '@/redux/slices/accountOpeningSlice';
import { FORM_FIELDS, FieldConfig } from './formfield';
import { AppDispatch, RootState } from '@/redux/store';
import CustomerSearchBar from './Customersearchbar';

interface Phase2Props {
  onNext: () => void;
  onBack: () => void;
}

type FieldValue = string | number | boolean | undefined;

export const Phase2FormFields: React.FC<Phase2Props> = ({ onNext, onBack }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, selectedBank } = useSelector(
    (state: RootState) => state.accountOpening
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const sections = useMemo(() => {
    const sectionMap: Record<string, FieldConfig[]> = {};

    Object.values(FORM_FIELDS).forEach((field) => {
      if (!sectionMap[field.section]) {
        sectionMap[field.section] = [];
      }
      sectionMap[field.section].push(field);
    });

    return sectionMap;
  }, []);

  const handleFieldChange = (field: string, value: FieldValue) => {
    dispatch(updateFormField({ field: field as keyof typeof formData, value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateField = (field: FieldConfig, value: FieldValue): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(String(value))) {
        return `${field.label} format is invalid`;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return `${field.label} is not a valid email`;
      }
    }

    return null;
  };

  const handleNext = async () => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    Object.values(FORM_FIELDS).forEach((field) => {
      const value = formData[field.field as keyof typeof formData] as FieldValue;
      const error = validateField(field, value);
      if (error) {
        newErrors[field.field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsValidating(false);

      const firstErrorField = Object.values(FORM_FIELDS).find(
        (field) => newErrors[field.field]
      );
      if (firstErrorField) {
        const el = document.getElementById(`section-${firstErrorField.section}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    try {
      await dispatch(generatePreview(formData));
      dispatch(setStep(3));
      onNext();
    } catch {
      setErrors({ form: 'Failed to generate preview. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  const renderField = (fieldKey: string, field: FieldConfig): JSX.Element | null => {
    const rawValue = formData[field.field as keyof typeof formData] as FieldValue;
    const error = errors[field.field];

    const baseInputClass =
      'w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all';
    const errorInputClass = error ? 'border-red-500 bg-red-50' : '';

    const renderLabel = () => (
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
        {field.hindi && (
          <span className="block text-[11px] font-normal text-gray-400 normal-case tracking-normal mt-0.5">
            {field.hindi}
          </span>
        )}
      </label>
    );

    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email': {
        const textValue = rawValue === undefined || rawValue === null ? '' : String(rawValue);
        return (
          <div key={fieldKey}>
            {renderLabel()}
            <input
              type={field.type}
              value={textValue}
              onChange={(e) => handleFieldChange(field.field, e.target.value)}
              placeholder={field.placeholder}
              className={`${baseInputClass} ${errorInputClass}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      case 'number': {
        const numberValue =
          typeof rawValue === 'number'
            ? rawValue
            : typeof rawValue === 'string' && rawValue !== ''
              ? Number(rawValue)
              : '';
        return (
          <div key={fieldKey}>
            {renderLabel()}
            <input
              type="number"
              value={numberValue}
              onChange={(e) =>
                handleFieldChange(
                  field.field,
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              className={`${baseInputClass} ${errorInputClass}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      case 'date': {
        const dateValue = typeof rawValue === 'string' ? rawValue : '';
        return (
          <div key={fieldKey}>
            {renderLabel()}
            <input
              type="date"
              value={dateValue}
              onChange={(e) => handleFieldChange(field.field, e.target.value)}
              className={`${baseInputClass} ${errorInputClass}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      case 'textarea': {
        const textareaValue = typeof rawValue === 'string' ? rawValue : '';
        return (
          <div key={fieldKey}>
            {renderLabel()}
            <textarea
              value={textareaValue}
              onChange={(e) => handleFieldChange(field.field, e.target.value)}
              rows={3}
              className={`${baseInputClass} ${errorInputClass}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      case 'select': {
        const selectValue = typeof rawValue === 'string' ? rawValue : '';
        return (
          <div key={fieldKey}>
            {renderLabel()}
            <select
              value={selectValue}
              onChange={(e) => handleFieldChange(field.field, e.target.value)}
              className={`${baseInputClass} ${errorInputClass}`}
            >
              <option value="">Select</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      case 'checkbox': {
        const checkedValue = Boolean(rawValue);
        return (
          <div key={fieldKey} className="flex items-end pb-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={checkedValue}
                onChange={(e) => handleFieldChange(field.field, e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700">
                {field.label}
                {field.hindi && (
                  <span className="block text-xs text-gray-400">{field.hindi}</span>
                )}
              </span>
            </label>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedBank} - Services Form
            </h1>
            <p className="text-sm text-gray-500">Step 2 of 3: Search Customer & Fill Details</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Customer Search Bar - PHASE 2 FEATURE */}
          <CustomerSearchBar />

          {/* Form Error */}
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{errors.form}</p>
            </div>
          )}

          {/* All Form Sections */}
          <div className="space-y-8">
            {Object.keys(sections).map((section) => (
              <div key={section} id={`section-${section}`}>
                <div className="bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide px-4 py-3 rounded-md mb-6">
                  {section}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sections[section]?.map((field) =>
                    renderField(field.section + field.label, field)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={isValidating}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {isValidating ? 'Validating...' : 'Preview →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};