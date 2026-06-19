'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createApplication,
  downloadApplicationPdf,
  setStep,
} from '@/redux/slices/accountOpeningSlice';
import { RootState } from '@/redux/store';
import { FORM_SECTIONS } from './formfield';

interface Phase3Props {
  onBack: () => void;
  onComplete: () => void;
}

export const Phase3PreviewPDF: React.FC<Phase3Props> = ({ onBack, onComplete }) => {
  const dispatch = useDispatch();
  const {
    formData,
    selectedBank,
    submitLoading,
    submitError,
    submitSuccess,
    pdfLoading,
    pdfError,
  } = useSelector((state: RootState) => state.accountOpening);

  const [showFullPreview, setShowFullPreview] = useState(true);
  const [agreementChecked, setAgreementChecked] = useState(false);

  const handleSubmit = async () => {
    if (!agreementChecked) {
      alert('Please accept the terms and conditions');
      return;
    }

    try {
      const result = await dispatch(createApplication(formData) as any);
      if (result.payload?.data?.id) {
        // ✅ Application saved successfully - NOW generate PDF
        await dispatch(
          downloadApplicationPdf(result.payload.data.id) as any
        );
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-emerald-700 mb-2">
              {selectedBank} - Service Request Form
            </h1>
            <p className="text-gray-600 text-sm">Step 3 of 3: Review & Generate PDF</p>
          </div>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-semibold">✓ {submitSuccess}</p>
          </div>
        )}

        {/* Error Messages */}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-semibold">✗ {submitError}</p>
          </div>
        )}

        {pdfError && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-600 font-semibold">⚠ PDF Error: {pdfError}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setShowFullPreview(true)}
              className={`flex-1 px-6 py-4 font-semibold text-sm transition-all ${
                showFullPreview
                  ? 'border-b-4 border-emerald-600 text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 bg-white hover:bg-gray-50'
              }`}
            >
              📄 Form Preview
            </button>
            <button
              onClick={() => setShowFullPreview(false)}
              className={`flex-1 px-6 py-4 font-semibold text-sm transition-all ${
                !showFullPreview
                  ? 'border-b-4 border-emerald-600 text-emerald-700 bg-emerald-50'
                  : 'text-gray-600 bg-white hover:bg-gray-50'
              }`}
            >
              ✓ Confirm & Submit
            </button>
          </div>

          {/* Tab 1: Form Preview */}
          {showFullPreview ? (
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                Form Summary
              </h2>

              {/* Customer Information Section */}
              <div className="mb-8">
                <div className="bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide px-4 py-3 rounded-md mb-6">
                  {FORM_SECTIONS.CUSTOMER_INFO}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Account Number</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatValue(formData.account_number)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {[formData.first_name, formData.middle_name, formData.last_name]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatValue(formData.email)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mobile</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatValue(formData.mobile)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="mb-8">
                <div className="bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide px-4 py-3 rounded-md mb-6">
                  {FORM_SECTIONS.ADDRESS}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.address_line1)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">City/District</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.city)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">State</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.state)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Pin Code</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.pin)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Identity Information Section */}
              <div className="mb-8">
                <div className="bg-emerald-700 text-white text-sm font-bold uppercase tracking-wide px-4 py-3 rounded-md mb-6">
                  {FORM_SECTIONS.IDENTITY}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.dob)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">PAN Card</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.pan)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Aadhaar Number</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.aadhaar)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Occupation</p>
                    <p className="text-base text-gray-800">
                      {formatValue(formData.occupation)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => setShowFullPreview(false)}
                className="w-full mt-8 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                Proceed to Confirmation →
              </button>
            </div>
          ) : (
            /* Tab 2: Confirmation & Submit */
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                Confirm & Submit
              </h2>

              {/* Agreement Checkbox */}
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-4">
                  <input
                    type="checkbox"
                    id="agreement"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                    className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer flex-shrink-0 mt-0.5"
                  />
                  <label htmlFor="agreement" className="cursor-pointer flex-1">
                    <p className="font-semibold text-gray-800 mb-2">
                      I/We agree to the terms and conditions
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      मी/आम्ही तुम्हाली विनंती करतो की, तुम्ही वरील सेवा सुलभ कराव्यात आणि
                      जर काही असेल तर किंवा वेळोवेळी लागू असल्यास सेवा शुल्क माझ्या/आमच्या
                      खात्यातून डेबिट करावे.
                    </p>
                    <p className="text-sm text-gray-700">
                      I/We request you to facilitate the above services and debit my/our account
                      for service charges if any or as applicable from time to time.
                    </p>
                  </label>
                </div>
              </div>

              {/* Declaration Box */}
              <div className="mb-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-gray-800 mb-3">📋 Declaration</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  By submitting this form, I/we declare that all information provided is accurate
                  and true. I/we understand that any false information may lead to account closure
                  and legal action.
                </p>
              </div>

              {/* Submission Summary */}
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">
                  📊 Submission Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-semibold text-gray-800">{selectedBank}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Customer Name:</span>
                    <span className="font-semibold text-gray-800">
                      {[formData.first_name, formData.last_name]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-semibold text-gray-800">
                      {formData.account_number || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Form Type:</span>
                    <span className="font-semibold text-gray-800">
                      Service Request Form (SRF-1)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={onBack}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  ← Back to Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!agreementChecked || submitLoading || pdfLoading}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {submitLoading || pdfLoading
                    ? '⏳ Processing...'
                    : '✓ Submit & Generate Marathi PDF'}
                </button>
              </div>

              {/* Success State - ONLY AFTER SUCCESSFUL SUBMIT + PDF */}
              {submitSuccess && pdfLoading === false && !pdfError && (
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    ✓ Application Submitted Successfully!
                  </h3>
                  <p className="text-sm text-green-600 mb-6">
                    Your application has been saved to the database and the Marathi SRF-1 PDF has been generated and downloaded.
                  </p>
                  <button
                    onClick={onComplete}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    ✓ Complete & Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};