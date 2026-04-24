'use client';

interface PreviewFieldProps {
  label: string;
  value?: string | number | null;
  placeholder?: string;
}

interface AccountOpeningPdfTemplateProps {
  selectedBank?: string;
  selectedType?: string;
  formData: {
    customer_id?: string | number | null;
    full_name?: string;
    father_name?: string;
    dob?: string;
    gender?: string;
    mobile?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pin?: string;
    aadhaar?: string;
    pan?: string;
    occupation?: string;
    income?: string;
    nominee_name?: string;
    nominee_relation?: string;
    nominee_dob?: string;
    nominee_mobile?: string;
    include_passbook?: boolean;
  };
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
    <div className="pdf-field">
      <div className="pdf-field-label">{label}</div>

      {displayValue ? (
        <div className="pdf-field-value filled">{displayValue}</div>
      ) : (
        <div className="pdf-field-value empty">{placeholder}</div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="pdf-section-label">{children}</div>;
}

export default function AccountOpeningPdfTemplate({
  selectedBank,
  selectedType,
  formData,
}: AccountOpeningPdfTemplateProps) {
  const bankText = selectedBank || '';
  const typeText = selectedType || '';
  const today = new Date().toLocaleDateString('en-IN');

  const aadhaarMasked = formData.aadhaar
    ? `XXXX XXXX ${String(formData.aadhaar).slice(-4)}`
    : '';

  const fullAddress = [formData.address, formData.city, formData.state]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <style>{`
        @page {
          size: A4;
          margin: 14mm;
        }

        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        body {
          margin: 0;
          padding: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #ffffff;
          color: #111827;
        }

        .pdf-page {
          width: 100%;
          background: #ffffff;
          border: 1px solid #d1d5db;
        }

        .pdf-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .pdf-topbar-title {
          font-size: 13px;
          font-weight: 700;
          color: #1f2937;
        }

        .pdf-badge {
          padding: 4px 10px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #16a34a;
          font-size: 10px;
          font-weight: 700;
        }

        .pdf-header {
          background: #0f2744;
          color: #ffffff;
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .pdf-content {
          padding: 14px;
        }

        .pdf-section-label {
          margin: 12px 0 10px;
          border-left: 3px solid #0f2744;
          padding-left: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f2744;
        }

        .pdf-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
        }

        .pdf-field {
          font-size: 11px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .pdf-field-label {
          margin-bottom: 4px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
        }

        .pdf-field-value {
          min-height: 32px;
          display: flex;
          align-items: center;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 11px;
          line-height: 1.4;
        }

        .pdf-field-value.filled {
          background: #eef4ff;
          color: #0f2744;
          font-family: "Courier New", Courier, monospace;
          font-weight: 700;
        }

        .pdf-field-value.empty {
          border: 1px dashed #d1d5db;
          color: #9ca3af;
          font-style: italic;
          background: #ffffff;
        }

        .pdf-print-option {
          margin-top: 12px;
          border: 1px dashed #99f6e4;
          background: #f0fdfa;
          border-radius: 8px;
          padding: 10px 12px;
        }

        .pdf-print-option-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #0f766e;
        }

        .pdf-print-option-value {
          margin-top: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #134e4a;
        }

        @media print {
          html,
          body {
            background: #ffffff;
          }

          .pdf-page {
            border: none;
          }
        }
      `}</style>

      <div className="pdf-page">
        <div className="pdf-topbar">
          <div className="pdf-topbar-title">Account Opening Form Preview</div>
          <div className="pdf-badge">Ready to Print</div>
        </div>

        <div className="pdf-header">
          {(bankText || 'BANK').toUpperCase()} — {(typeText || 'ACCOUNT').toUpperCase()} OPENING FORM
        </div>

        <div className="pdf-content">
          <SectionLabel>Personal Details</SectionLabel>
          <div className="pdf-grid">
            <PreviewField label="Full Name" value={formData.full_name} />
            <PreviewField
              label="Father / Husband Name"
              value={formData.father_name}
            />
          </div>

          <div className="pdf-grid">
            <PreviewField label="Date of Birth" value={formData.dob} />
            <PreviewField
              label="Gender"
              value={formData.gender}
              placeholder="Not selected"
            />
          </div>

          <div className="pdf-grid">
            <PreviewField label="Mobile Number" value={formData.mobile} />
            <PreviewField
              label="Email Address"
              value={formData.email}
              placeholder="Not entered"
            />
          </div>

          <SectionLabel>Address</SectionLabel>
          <div className="pdf-grid">
            <PreviewField label="Full Address" value={fullAddress} />
            <PreviewField label="PIN Code" value={formData.pin} />
          </div>

          <SectionLabel>KYC</SectionLabel>
          <div className="pdf-grid">
            <PreviewField label="Aadhaar" value={aadhaarMasked} />
            <PreviewField
              label="PAN"
              value={formData.pan}
              placeholder="Optional"
            />
          </div>

          <div className="pdf-grid">
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
          <div className="pdf-grid">
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

          <div className="pdf-grid">
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
          <div className="pdf-grid">
            <PreviewField label="Bank" value={bankText} />
            <PreviewField label="Customer ID" value={formData.customer_id} />
          </div>

          <div className="pdf-grid">
            <PreviewField label="Account Type" value={typeText} />
            <PreviewField label="Print Date" value={today} />
          </div>

          <div className="pdf-print-option">
            <div className="pdf-print-option-label">Print Option</div>
            <div className="pdf-print-option-value">
              {formData.include_passbook
                ? 'Form + Passbook Printing'
                : 'Form Printing Only'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}