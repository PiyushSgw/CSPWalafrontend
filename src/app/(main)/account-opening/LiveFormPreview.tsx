'use client';

import { useAppSelector } from '@/redux/hooks';

interface PreviewFieldProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
}

function PreviewField({
  label,
  value,
  placeholder = 'Not entered yet',
}: PreviewFieldProps) {
  const displayValue =
    value !== undefined && value !== null && String(value).trim() !== ''
      ? String(value)
      : '';

  return (
    <div className="text-[11px]">
      <div className="mb-1 text-[10px] uppercase tracking-[0.5px] text-gray-500">
        {label}
      </div>

      {displayValue ? (
        <div className="flex min-h-[30px] items-center rounded bg-[#eef4ff] px-2 py-1 font-mono text-[11px] font-bold text-[#0f2744]">
          {displayValue}
        </div>
      ) : (
        <div className="flex min-h-[30px] items-center rounded border border-dashed border-gray-200 px-2 py-1 text-[11px] italic text-gray-300">
          {placeholder}
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-3 border-l-[3px] border-[#0f2744] pl-2 text-[10px] font-bold uppercase tracking-[1px] text-[#0f2744]">
      {children}
    </div>
  );
}

export default function LiveFormPreview() {
  const { selectedBank, selectedType, formData } = useAppSelector(
    (state) => state.accountOpening
  );

  const bankText = selectedBank || '';
  const typeText = selectedType || '';
  const today = new Date().toLocaleDateString('en-IN');

  const aadhaarMasked = formData.aadhaar
    ? `XXXX XXXX ${formData.aadhaar.slice(-4)}`
    : '';

  const fullAddress = [formData.address, formData.city, formData.state]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="sticky top-20 w-full self-start overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3 className="text-[13px] font-bold text-gray-800">
          👁️ Live Form Preview
        </h3>
        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">
          Auto-updating
        </span>
      </div>

      <div className="bg-[#0f2744] px-4 py-3 text-[12px] font-bold tracking-[0.5px] text-white">
        🏦 {(bankText || 'BANK').toUpperCase()} —{' '}
        {(typeText || 'ACCOUNT').toUpperCase()} OPENING FORM
      </div>

      <div className="p-4">
        <SectionLabel>Personal Details</SectionLabel>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Full Name" value={formData.full_name} />
          <PreviewField
            label="Father / Husband Name"
            value={formData.father_name}
          />
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Date of Birth" value={formData.dob} />
          <PreviewField
            label="Gender"
            value={formData.gender}
            placeholder="Not selected"
          />
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Mobile Number" value={formData.mobile} />
          <PreviewField
            label="Email Address"
            value={formData.email}
            placeholder="Not entered"
          />
        </div>

        <SectionLabel>Address</SectionLabel>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Full Address" value={fullAddress} />
          <PreviewField label="PIN Code" value={formData.pin} />
        </div>

        <SectionLabel>KYC</SectionLabel>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Aadhaar" value={aadhaarMasked} />
          <PreviewField
            label="PAN"
            value={formData.pan}
            placeholder="Optional"
          />
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField
            label="Occupation"
            value={formData.occupation}
            placeholder="Not selected"
          />
          <PreviewField
            label="Income"
            value={formData.income}
            placeholder="Not selected"
          />
        </div>

        <SectionLabel>Nominee</SectionLabel>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField
            label="Nominee Name"
            value={formData.nominee_name}
          />
          <PreviewField
            label="Relation"
            value={formData.nominee_relation}
            placeholder="Not entered"
          />
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField
            label="Nominee DOB"
            value={formData.nominee_dob}
            placeholder="Not entered"
          />
          <PreviewField
            label="Nominee Mobile"
            value={formData.nominee_mobile}
            placeholder="Not entered"
          />
        </div>

        <SectionLabel>Auto-filled by System</SectionLabel>
        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Bank" value={bankText} />
          <PreviewField label="Customer ID" value={formData.customer_id} />
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <PreviewField label="Account Type" value={typeText} />
          <PreviewField label="Print Date" value={today} />
        </div>

        <div className="mt-3 rounded-lg border border-dashed border-teal-200 bg-teal-50 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.6px] text-teal-700">
            Print Option
          </div>
          <div className="mt-1 text-[11px] font-semibold text-teal-900">
            {formData.include_passbook
              ? 'Form + Passbook Printing'
              : 'Form Printing Only'}
          </div>
        </div>
      </div>
    </div>
  );
}