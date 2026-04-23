/**
 * No Sidebar/Header/BottomBar needed here.
 * They come from (main)/layout.tsx automatically.
 */
'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import TabBar from './TopBar';
import StepIndicator from './StepIndicator';
import BankSelector from './BankSelector';
import AccountTypeSelector from './AccountTypeSelector';
import CustomerDetailsForm from './CustomerDetailsForm';
import PrintOptions from './PrintOption';
import LiveFormPreview from './LiveFormPreview';
import ConfirmPrint from './ConfirmPrint';
import FormHistory from './FormHistory';

const emptyForm = {
  fullName: '', fatherName: '', dob: '', gender: '',
  mobile: '', email: '', address: '', city: '',
  state: 'Uttar Pradesh', pin: '', aadhaar: '', pan: '',
  occupation: '', income: '', nomineeName: '',
  nomineeRelation: '', nomineeDob: '', nomineeMobile: '',
};

export default function AccountFormPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [selectedType, setSelectedType] = useState('Savings Account');
  const [formData, setFormData] = useState(emptyForm);
  const [includePassbook, setIncludePassbook] = useState(false);
  const walletBalance = 485;

  const handleFieldChange = (field: keyof typeof emptyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirm = () => {
    const charge = includePassbook ? 13 : 10;
    toast.success(`Form PDF generated! ₹${charge} deducted. Wallet: ₹${walletBalance - charge}`);
  };

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-extrabold text-gray-900 tracking-[-0.5px]">
          📋 Account Opening Form
        </h1>
        <p className="text-[13px] text-gray-400 mt-1">
          Fill bank account opening form details and print pre-filled PDF
        </p>
      </div>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* New Form Tab */}
      {activeTab === 'new' && (
        <div>
          {/* Step Indicator */}
          <StepIndicator currentStep={step} />

          {/* Step 1 — Bank & Type */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-[14px] font-bold text-gray-800">🏦 Step 1 — Select Bank & Form Type</h3>
              </div>
              <div className="p-5">
                <BankSelector selected={selectedBank} onSelect={setSelectedBank} />
                <AccountTypeSelector selected={selectedType} onSelect={setSelectedType} />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[13px] font-bold transition-all"
                  >
                    Next: Fill Details →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Customer Details */}
          {step === 2 && (
            <div className="grid grid-cols-[1fr_340px] gap-5 items-start">

              {/* Left — Form */}
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-gray-800">👤 Customer / Applicant Details</h3>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-600 hover:bg-gray-50">
                      Load Existing
                    </button>
                  </div>
                  <div className="p-5">
                    <CustomerDetailsForm formData={formData} onChange={handleFieldChange} />
                  </div>
                </div>

                <PrintOptions includePassbook={includePassbook} onToggle={setIncludePassbook} />

                <div className="flex justify-between flex-wrap gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 border-[1.5px] border-gray-300 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    ← Back to Bank Selection
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[13px] font-bold transition-all"
                  >
                    Preview Form →
                  </button>
                </div>
              </div>

              {/* Right — Live Preview */}
              <LiveFormPreview
                bank={selectedBank}
                accountType={selectedType}
                formData={formData}
              />
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && (
            <ConfirmPrint
              bank={selectedBank}
              accountType={selectedType}
              customerName={formData.fullName}
              includePassbook={includePassbook}
              walletBalance={walletBalance}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}
            />
          )}
        </div>
      )}
      {/* History Tab */}
      {activeTab === 'history' && <FormHistory />}
    </div>
  );
}