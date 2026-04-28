"use client";

import { useAppSelector } from "@/redux/hooks";

interface PreviewFieldProps {
  label: string;
  value?: string | number | boolean | null;
  placeholder?: string;
}

function PreviewField({
  label,
  value,
  placeholder = "Not entered yet",
}: PreviewFieldProps) {
  const displayValue =
    value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : "";
  return (
    <div className="lpv-field">
      <div className="lpv-field-label">{label}</div>
      {displayValue ? (
        <div className="lpv-field-value filled">{displayValue}</div>
      ) : (
        <div className="lpv-field-value empty">{placeholder}</div>
      )}
    </div>
  );
}

function SectionBanner({ children }: { children: React.ReactNode }) {
  return <div className="lpv-section-banner">{children}</div>;
}

export default function LiveFormPreview() {
  const { selectedBank, selectedType, formData } = useAppSelector(
    (state) => state.accountOpening,
  );

  const bankText = selectedBank || "";
  const typeText = selectedType || "";
  const today = new Date().toLocaleDateString("en-IN");
  const aadhaarMasked = formData.aadhaar
    ? `XXXX XXXX ${formData.aadhaar.slice(-4)}`
    : "";

  return (
    <>
      <style>{`
        .lpv-wrap {
          position: sticky;
          top: 76px;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
        }

        .lpv-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .lpv-topbar-title {
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .lpv-topbar-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--teal);
          display: inline-block;
          flex-shrink: 0;
        }
        .lpv-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 100px;
          background: #f0fdf4;
          color: #16a34a;
        }

        .lpv-bank-banner {
          background: var(--teal);
          color: #ffffff;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .lpv-body {
          max-height: 80vh;
          overflow-y: auto;
          padding: 6px 14px 16px;
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f3f4f6;
        }
        .lpv-body::-webkit-scrollbar { width: 5px; }
        .lpv-body::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }

        .lpv-section-banner {
          background: var(--teal);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 7px 12px;
          border-radius: 6px;
          margin: 12px 0 8px;
        }

        .lpv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 10px;
          margin-bottom: 6px;
        }
        .lpv-grid-1 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          margin-bottom: 6px;
        }

        .lpv-field { font-size: 11px; }
        .lpv-field-label {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #6b7280;
          margin-bottom: 3px;
        }
        .lpv-field-value {
          min-height: 26px;
          display: flex;
          align-items: center;
          padding: 3px 7px;
          border-radius: 4px;
          font-size: 10px;
          line-height: 1.4;
          word-break: break-all;
        }
        .lpv-field-value.filled {
          background: #eef4ff;
          color: #0f2744;
          font-family: 'DM Mono', 'Courier New', monospace;
          font-weight: 700;
        }
        .lpv-field-value.empty {
          border: 1px dashed #d1d5db;
          color: #d1d5db;
          font-style: italic;
          background: #ffffff;
        }

        .lpv-service-row {
          display: flex;
          gap: 10px;
          margin-bottom: 6px;
        }
        .lpv-service-item {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 5px 10px;
          font-size: 10px;
          font-weight: 600;
          color: #374151;
        }
        .lpv-service-item.checked {
          border-color: var(--teal);
          background: var(--teal-light);
          color: var(--teal);
        }
      `}</style>

      <div className="lpv-wrap">
        {/* Top header */}
        <div className="lpv-topbar">
          <span className="lpv-topbar-title">
            <span className="lpv-topbar-dot" />
            Live Form Preview
          </span>
          <span className="lpv-badge">Auto-updating</span>
        </div>

        {/* Bank banner */}
        <div className="lpv-bank-banner">
          🏦 {(bankText || "BANK").toUpperCase()} —{" "}
          {(typeText || "ACCOUNT").toUpperCase()} OPENING FORM
        </div>

        {/* Scrollable body */}
        <div className="lpv-body">
          <SectionBanner>Personal Details</SectionBanner>
          <div className="lpv-grid">
            <PreviewField label="First Name" value={formData.first_name} />
            <PreviewField
              label="Middle Name"
              value={formData.middle_name}
              placeholder="—"
            />
            <PreviewField label="Last Name" value={formData.last_name} />
            <PreviewField
              label="Marital Status"
              value={formData.marital_status}
              placeholder="Not selected"
            />
            <PreviewField label="Father Name" value={formData.father_name} />
            <PreviewField
              label="Mother Name"
              value={formData.mother_name}
              placeholder="Not entered"
            />
            <PreviewField label="Date of Birth" value={formData.dob} />
            <PreviewField
              label="Gender"
              value={formData.gender}
              placeholder="Not selected"
            />
            <PreviewField
              label="Category"
              value={formData.category}
              placeholder="Not selected"
            />
            <PreviewField
              label="Religion"
              value={formData.religion}
              placeholder="Not selected"
            />
            <PreviewField
              label="Education"
              value={formData.education}
              placeholder="Not selected"
            />
            <PreviewField
              label="Occupation"
              value={formData.occupation}
              placeholder="Not selected"
            />
            <PreviewField
              label="Annual Income"
              value={formData.annual_income}
              placeholder="Not entered"
            />
            <PreviewField
              label="Net Worth"
              value={formData.net_worth}
              placeholder="Not entered"
            />
            <PreviewField
              label="Email"
              value={formData.email}
              placeholder="Not entered"
            />
            <PreviewField label="Mobile" value={formData.mobile} />
          </div>

          <SectionBanner>Identity Details</SectionBanner>
          <div className="lpv-grid">
            <PreviewField
              label="Proof of Identity"
              value={formData.proof_of_identity}
              placeholder="Not selected"
            />
            <PreviewField
              label="Document No."
              value={formData.document_no}
              placeholder="Not entered"
            />
            <PreviewField label="Aadhaar" value={aadhaarMasked} />
            <PreviewField
              label="PAN"
              value={formData.pan}
              placeholder="Optional"
            />
          </div>

          <SectionBanner>Address</SectionBanner>
          <div className="lpv-grid">
            <PreviewField
              label="Address Line 1"
              value={formData.address_line1}
            />
            <PreviewField
              label="Address Line 2"
              value={formData.address_line2}
              placeholder="—"
            />
            <PreviewField label="City / Village" value={formData.city} />
            <PreviewField label="Pincode" value={formData.pin} />
            <PreviewField
              label="District"
              value={formData.district}
              placeholder="Not entered"
            />
            <PreviewField
              label="State"
              value={formData.state}
              placeholder="Not selected"
            />
          </div>
          <div className="lpv-grid-1">
            <PreviewField label="Country" value={formData.country} />
          </div>

          <SectionBanner>Nomination Required</SectionBanner>
          <div className="lpv-grid">
            <PreviewField label="Nominee Name" value={formData.nominee_name} />
            <PreviewField
              label="Mobile"
              value={formData.nominee_mobile}
              placeholder="Not entered"
            />
            <PreviewField
              label="Relationship"
              value={formData.nominee_relation}
              placeholder="Not entered"
            />
            <PreviewField
              label="Nominee Address"
              value={formData.nominee_address}
              placeholder="Not entered"
            />
            <PreviewField
              label="Nominee Age"
              value={formData.nominee_age}
              placeholder="Not entered"
            />
            <PreviewField
              label="Nominee DOB"
              value={formData.nominee_dob}
              placeholder="Not entered"
            />
          </div>

          <SectionBanner>Optional Details</SectionBanner>
          <div className="lpv-grid">
            <PreviewField
              label="CKYC Number"
              value={formData.ckyc_number}
              placeholder="Not entered"
            />
            <PreviewField
              label="Date"
              value={formData.date}
              placeholder="Not entered"
            />
            <PreviewField label="Account Type" value={formData.account_type} />
            <PreviewField
              label="Perm. Address Type"
              value={formData.permanent_address_type}
            />
            <PreviewField label="Nationality" value={formData.nationality} />
            <PreviewField
              label="Person w/ Disability"
              value={formData.person_with_disability}
            />
            <PreviewField
              label="Tax Residency India"
              value={formData.tax_residency_india_only}
            />
            <PreviewField
              label="Politically Exposed"
              value={formData.politically_exposed}
            />
            <PreviewField
              label="Printer Type"
              value={formData.printer_type}
              placeholder="Not selected"
            />
            <PreviewField
              label="Place of Birth"
              value={formData.place_of_birth}
              placeholder="Not entered"
            />
          </div>

          <SectionBanner>Service Required</SectionBanner>
          <div className="lpv-service-row">
            <div
              className={`lpv-service-item ${formData.cheque_book ? "checked" : ""}`}
            >
              {formData.cheque_book ? "☑" : "☐"} Cheque Book
            </div>
            <div
              className={`lpv-service-item ${formData.atm_card_required ? "checked" : ""}`}
            >
              {formData.atm_card_required ? "☑" : "☐"} ATM Card Required
            </div>
          </div>

          <SectionBanner>Bank Use</SectionBanner>
          <div className="lpv-grid">
            <PreviewField
              label="Branch Code"
              value={formData.branch_code}
              placeholder="Not entered"
            />
            <PreviewField
              label="Official Name"
              value={formData.official_name}
              placeholder="Not entered"
            />
            <PreviewField
              label="PF Number"
              value={formData.pf_number}
              placeholder="Not entered"
            />
            <PreviewField
              label="Designation"
              value={formData.designation}
              placeholder="Not selected"
            />
            <PreviewField label="Customer ID" value={formData.customer_id} />
            <PreviewField
              label="Account Number"
              value={formData.account_number}
              placeholder="Not entered"
            />
            <PreviewField
              label="Branch Name"
              value={formData.branch_name}
              placeholder="Not entered"
            />
            <PreviewField
              label="Place"
              value={formData.place}
              placeholder="Not entered"
            />
          </div>

          <SectionBanner>Auto-filled by System</SectionBanner>
          <div className="lpv-grid">
            <PreviewField label="Bank" value={bankText} />
            <PreviewField label="Account Type" value={typeText} />
            <PreviewField label="Print Date" value={today} />
            <PreviewField
              label="Print Option"
              value={
                formData.include_passbook
                  ? "Form + Passbook"
                  : "Form Printing Only"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
