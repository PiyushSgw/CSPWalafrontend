'use client';

import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import TabBar from './TopBar';
import BankSelector from './BankSelector';
import AccountTypeSelector from './AccountTypeSelector';
import CustomerDetailsForm from './CustomerDetailsForm';
import PrintOptions from './PrintOption';
import LiveFormPreview from './LiveFormPreview';
import ConfirmPrint from './ConfirmPrint';
import FormHistory from './FormHistory';
import AccountOpeningPdfTemplate from './AccountOpeningPdfTemplate';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  createApplication,
  downloadApplicationPdf,
  resetSubmitState,
  setActiveTab,
  setSelectedBank,
  setSelectedType,
  setStep,
  updateFormField,
} from '@/redux/slices/accountOpeningSlice';

export default function AccountFormPage() {
  const dispatch = useAppDispatch();

  const {
    activeTab,
    step,
    selectedBank,
    selectedType,
    formData,
    history,
    customerNotFound,
    submitLoading,
    submitError,
    submitSuccess,
    previewLoading,
    previewError,
    pdfLoading,
    pdfError,
  } = useAppSelector((state) => state.accountOpening);

  const walletBalance = 485;

  useEffect(() => {
    if (submitSuccess) {
      toast.success(submitSuccess);
      dispatch(resetSubmitState());
    }
  }, [submitSuccess, dispatch]);

  useEffect(() => {
    if (submitError) {
      toast.error(submitError);
      dispatch(resetSubmitState());
    }
  }, [submitError, dispatch]);

  useEffect(() => {
    if (previewError) {
      toast.error(previewError);
      dispatch(resetSubmitState());
    }
  }, [previewError, dispatch]);

  useEffect(() => {
    if (pdfError) {
      toast.error(pdfError);
      dispatch(resetSubmitState());
    }
  }, [pdfError, dispatch]);

  const validateForm = () => {
    if (!selectedBank) return 'Bank is required';
    if (!selectedType) return 'Account type is required';
    if (!formData.customer_id) return 'Customer ID is required';
    if (!formData.full_name.trim()) return 'Full name is required';
    if (!formData.father_name.trim()) return 'Father / Husband name is required';
    if (!formData.dob) return 'Date of birth is required';
    if (!formData.gender) return 'Gender is required';
    if (!formData.mobile.trim()) return 'Mobile number is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.state.trim()) return 'State is required';
    if (!formData.pin.trim()) return 'PIN code is required';
    if (!formData.aadhaar.trim()) return 'Aadhaar is required';
    if (!formData.nominee_name.trim()) return 'Nominee name is required';
    if (!formData.nominee_relation.trim()) return 'Nominee relation is required';
    return null;
  };

  const isPreviewBlocked =
    customerNotFound || !formData.customer_id || previewLoading || submitLoading;

  const handleNextStep = () => {
    if (!selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    if (!selectedType) {
      toast.error('Please select account type');
      return;
    }

    dispatch(setStep(2));
  };

  const handlePreviewForm = async () => {
    if (customerNotFound) {
      toast.error('Customer not found');
      return;
    }

    if (!formData.customer_id) {
      toast.error('Please load a valid customer first');
      return;
    }

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await dispatch(createApplication(formData)).unwrap();
      dispatch(setStep(3));
    } catch {
      toast.error('Failed to save form');
    }
  };

  const handleConfirm = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const latestApplicationId = history?.[0]?.id;

    if (!latestApplicationId) {
      toast.error('Application ID not found. Please save the form again.');
      return;
    }

    try {
      const charge = formData.include_passbook ? 13 : 10;
      await dispatch(downloadApplicationPdf(latestApplicationId)).unwrap();
      toast.success(`PDF generated successfully! ₹${charge} deducted.`);
    } catch (error: any) {
      toast.error(error || 'PDF generation failed');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-gray-900">
          📋 Account Opening Form
        </h1>
        <p className="mt-1 text-[13px] text-gray-400">
          Fill bank account opening form details and print pre-filled PDF
        </p>
      </div>

      <TabBar
        activeTab={activeTab}
        onChange={(tab) => dispatch(setActiveTab(tab))}
      />

      {activeTab === 'new' && (
        <div>
          {step === 1 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="text-[14px] font-bold text-gray-800">
                  🏦 Step 1 — Select Bank & Form Type
                </h3>
              </div>

              <div className="p-5">
                <BankSelector
                  selected={selectedBank}
                  onSelect={(payload) =>
                    dispatch(
                      setSelectedBank({
                        bankName: payload.bankName,
                        bankId: payload.bankId,
                      })
                    )
                  }
                />

                <AccountTypeSelector
                  selected={selectedType}
                  onSelect={(payload) => dispatch(setSelectedType(payload))}
                />

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="rounded-lg bg-teal-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-teal-700"
                  >
                    Next: Fill Details →
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-[1fr_340px] items-start gap-5">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <h3 className="text-[14px] font-bold text-gray-800">
                      👤 Customer / Applicant Details
                    </h3>
                  </div>

                  <div className="p-5">
                    <CustomerDetailsForm />
                  </div>
                </div>

                <PrintOptions
                  includePassbook={formData.include_passbook}
                  onToggle={(value) =>
                    dispatch(
                      updateFormField({
                        field: 'include_passbook',
                        value,
                      })
                    )
                  }
                />

                <div className="flex flex-wrap justify-between gap-3">
                  <button
                    onClick={() => dispatch(setStep(1))}
                    className="rounded-lg border-[1.5px] border-gray-300 px-5 py-2.5 text-[13px] font-bold text-gray-600 transition-all hover:bg-gray-50"
                  >
                    ← Back to Bank Selection
                  </button>

                  <button
                    onClick={handlePreviewForm}
                    disabled={isPreviewBlocked}
                    className="rounded-lg bg-teal-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitLoading ? 'Saving...' : 'Preview Form →'}
                  </button>
                </div>
              </div>

              <AccountOpeningPdfTemplate
                selectedBank={selectedBank}
                selectedType={selectedType}
                formData={formData}
              />
            </div>
          )}

          {step === 3 && (
            <ConfirmPrint
              bank={selectedBank}
              accountType={selectedType}
              customerName={formData.full_name}
              includePassbook={formData.include_passbook}
              walletBalance={walletBalance}
              onBack={() => dispatch(setStep(2))}
              onConfirm={handleConfirm}
              loading={pdfLoading}
            />
          )}
        </div>
      )}

      {activeTab === 'history' && <FormHistory />}
    </div>
  );
}