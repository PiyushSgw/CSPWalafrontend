"use client";

interface PreviewFieldProps {
  label: string;
  value?: string | number | boolean | null;
  placeholder?: string;
}

interface AccountOpeningPdfTemplateProps {
  selectedBank?: string;
  selectedType?: string;
  formData: {
    customer_id?: string | number | null;
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    full_name?: string;
    father_name?: string;
    mother_name?: string;
    marital_status?: string;
    dob?: string;
    gender?: string;
    mobile?: string;
    email?: string;
    annual_income?: string;
    net_worth?: string;
    category?: string;
    religion?: string;
    education?: string;
    occupation?: string;
    income?: string;
    pan?: string;
    proof_of_identity?: string;
    document_no?: string;
    same_address?: boolean;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    district?: string;
    state?: string;
    pin?: string;
    country?: string;
    address?: string;
    aadhaar?: string;
    nominee_name?: string;
    nominee_relation?: string;
    nominee_dob?: string;
    nominee_mobile?: string;
    nominee_address?: string;
    nominee_age?: string;
    ckyc_number?: string;
    date?: string;
    permanent_address_type?: string;
    nationality?: string;
    person_with_disability?: string;
    tax_residency_india_only?: string;
    politically_exposed?: string;
    printer_type?: string;
    place_of_birth?: string;
    account_type?: string;
    cheque_book?: boolean;
    atm_card_required?: boolean;
    branch_code?: string;
    official_name?: string;
    pf_number?: string;
    designation?: string;
    account_number?: string;
    branch_name?: string;
    place?: string;
    include_passbook?: boolean;
    photo_url?: string;
    signature_url?: string;
  };
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

function SectionHeader({
  children,
  checked,
}: {
  children: React.ReactNode;
  checked?: boolean;
}) {
  return (
    <div className="pdf-section-header">
      {checked !== undefined && (
        <span className="pdf-section-checkbox">{checked ? "☑" : "☐"}</span>
      )}
      {children}
    </div>
  );
}

export default function AccountOpeningPdfTemplate({
  selectedBank,
  selectedType,
  formData,
}: AccountOpeningPdfTemplateProps) {
  const bankText = selectedBank || "";
  const typeText = selectedType || "";
  const today = new Date().toLocaleDateString("en-IN");

  const aadhaarMasked = formData.aadhaar
    ? `XXXX XXXX ${String(formData.aadhaar).slice(-4)}`
    : "";

  return (
    <>
      <style>{`
        @page { size: A4; margin: 14mm; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background: #ffffff; color: #111827; }

        .pdf-page { width: 100%; background: #ffffff; border: 1px solid #d1d5db; }

        .pdf-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #e5e7eb; background: #f9fafb; }
        .pdf-topbar-title { font-size: 13px; font-weight: 700; color: #1f2937; }
        .pdf-badge { padding: 4px 10px; border-radius: 999px; background: #ecfdf5; color: #16a34a; font-size: 10px; font-weight: 700; }

        .pdf-header { background: var(--teal); color: #ffffff; padding: 12px 14px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }

        .pdf-content { padding: 14px; }

        .pdf-section-label { margin: 10px 0 8px; border-left: 3px solid var(--teal); padding-left: 8px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--teal); }

        .pdf-section-header { display: flex; align-items: center; gap: 8px; background: var(--teal); color: #ffffff; padding: 7px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; margin: 10px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .pdf-section-checkbox { font-size: 12px; }

        .pdf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px; }
        .pdf-grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; margin-bottom: 6px; }
        .pdf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 6px; }

        .pdf-field { font-size: 11px; break-inside: avoid; page-break-inside: avoid; }
        .pdf-field-label { margin-bottom: 3px; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }

        .pdf-field-value { min-height: 28px; display: flex; align-items: center; padding: 4px 7px; border-radius: 4px; font-size: 10px; line-height: 1.4; }
        .pdf-field-value.filled { background: #eef4ff; color: #0f2744; font-family: "Courier New", Courier, monospace; font-weight: 700; }
        .pdf-field-value.empty { border: 1px dashed #d1d5db; color: #9ca3af; font-style: italic; background: #ffffff; }

        .pdf-service-row { display: flex; gap: 12px; margin-bottom: 6px; }
        .pdf-service-item { display: flex; align-items: center; gap: 6px; border: 1px solid #d1d5db; border-radius: 6px; padding: 6px 12px; font-size: 10px; font-weight: 600; color: #374151; }
        .pdf-service-item.checked { border-color: var(--teal); background: var(--teal-light); color: var(--teal); }
        .pdf-service-checkbox { font-size: 12px; }

        .pdf-print-option { margin-top: 10px; border: 1px dashed #99f6e4; background: #f0fdfa; border-radius: 6px; padding: 8px 10px; }
        .pdf-print-option-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #0f766e; }
        .pdf-print-option-value { margin-top: 3px; font-size: 10px; font-weight: 700; color: #134e4a; }

        @media print { html, body { background: #ffffff; } .pdf-page { border: none; } }
      `}</style>

      <div className="pdf-page">
        <div className="pdf-topbar">
          <div className="pdf-topbar-title">Account Opening Form Preview</div>
          <div className="pdf-badge">Ready to Print</div>
        </div>

        <div className="pdf-header">
          {(bankText || "BANK").toUpperCase()} —{" "}
          {(typeText || "ACCOUNT").toUpperCase()} OPENING FORM
        </div>

        <div className="pdf-content">
          {/* Personal Details */}
          <SectionHeader>Personal Details</SectionHeader>
          <div className="pdf-grid-4">
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
          </div>
          <div className="pdf-grid">
            <PreviewField label="Father Name" value={formData.father_name} />
            <PreviewField
              label="Mother Name"
              value={formData.mother_name}
              placeholder="Not entered"
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
          <div className="pdf-grid-4">
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
          </div>
          <div className="pdf-grid-4">
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

          {/* Identity Details */}
          <SectionHeader>Identity Details</SectionHeader>
          <div className="pdf-grid-3">
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
            <PreviewField
              label="PAN"
              value={formData.pan}
              placeholder="Optional"
            />
          </div>
          <div className="pdf-grid">
            <PreviewField label="Aadhaar" value={aadhaarMasked} />
          </div>

          {/* Address */}
          <SectionHeader checked={formData.same_address}>
            Are Permanent Address &amp; Current Address same?
          </SectionHeader>
          <p
            style={{
              textAlign: "center",
              fontSize: "10px",
              fontWeight: "600",
              color: "var(--teal)",
              marginBottom: "6px",
            }}
          >
            Permanent Address
          </p>
          <div className="pdf-grid">
            <PreviewField
              label="Address Line 1"
              value={formData.address_line1}
            />
            <PreviewField
              label="Address Line 2"
              value={formData.address_line2}
              placeholder="—"
            />
          </div>
          <div className="pdf-grid-4">
            <PreviewField label="City/Village" value={formData.city} />
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
          <div className="pdf-grid">
            <PreviewField label="Country" value={formData.country} />
          </div>

          {/* Nomination */}
          <SectionHeader checked>Nomination Required</SectionHeader>
          <div className="pdf-grid-4">
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
          </div>
          <div className="pdf-grid">
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

          {/* Optional Details */}
          <SectionHeader checked>Optional Details</SectionHeader>
          <div className="pdf-grid-4">
            <PreviewField
              label="CKYC Number"
              value={formData.ckyc_number}
              placeholder="Not entered"
            />
            <PreviewField label="Date" value={formData.date} />
            <PreviewField label="Account Type" value={formData.account_type} />
            <PreviewField
              label="Permanent Address Type"
              value={formData.permanent_address_type}
            />
          </div>
          <div className="pdf-grid-4">
            <PreviewField label="Nationality" value={formData.nationality} />
            <PreviewField
              label="Person with Disability"
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
          </div>
          <div className="pdf-grid">
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

          {/* Services */}
          <SectionLabel>Service Required</SectionLabel>
          <div className="pdf-service-row">
            <div
              className={`pdf-service-item ${formData.cheque_book ? "checked" : ""}`}
            >
              <span className="pdf-service-checkbox">
                {formData.cheque_book ? "☑" : "☐"}
              </span>{" "}
              Cheque Book
            </div>
            <div
              className={`pdf-service-item ${formData.atm_card_required ? "checked" : ""}`}
            >
              <span className="pdf-service-checkbox">
                {formData.atm_card_required ? "☑" : "☐"}
              </span>{" "}
              ATM Card Required
            </div>
          </div>

          {/* Bank Use */}
          <SectionHeader checked>Bank Use</SectionHeader>
          <div className="pdf-grid-4">
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
          </div>
          <div className="pdf-grid-4">
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

          {/* System */}
          <SectionLabel>Auto-filled by System</SectionLabel>
          <div className="pdf-grid">
            <PreviewField label="Bank" value={bankText} />
            <PreviewField label="Print Date" value={today} />
          </div>

          <div className="pdf-print-option">
            <div className="pdf-print-option-label">Print Option</div>
            <div className="pdf-print-option-value">
              {formData.include_passbook
                ? "Form + Passbook Printing"
                : "Form Printing Only"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
