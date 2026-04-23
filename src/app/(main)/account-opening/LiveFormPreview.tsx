'use client';

interface Props {
  bank: string;
  accountType: string;
  formData: any;
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px]">
      <div className="text-[10px] text-gray-400 uppercase tracking-[0.5px] mb-1">{label}</div>
      {value ? (
        <div className="font-bold text-[#0f2744] bg-[#eef4ff] px-2 py-1 rounded font-mono text-[11px]">{value}</div>
      ) : (
        <div className="text-gray-300 italic border border-dashed border-gray-200 px-2 py-1 rounded text-[11px]">Not entered yet</div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="text-[10px] font-bold text-[#0f2744] uppercase tracking-[1px] border-l-[3px] border-[#0f2744] pl-2 my-3">
      {children}
    </div>
  );
}

export default function LiveFormPreview({ bank, accountType, formData }: Props) {
  const today = new Date().toLocaleDateString('en-IN');

  return (
    <div className="bg-white border-2 border-gray-200 rounded-[10px] overflow-hidden sticky top-20">
      {/* Header */}
      <div className="bg-[#0f2744] text-white px-4 py-3.5 text-[12px] font-bold tracking-[0.5px]">
        🏦 {bank.toUpperCase()} — {accountType.toUpperCase()} OPENING FORM
      </div>

      {/* Body */}
      <div className="p-4 max-h-[70vh] ">
        <SectionLabel>Personal Details</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="Full Name" value={formData.fullName} />
          <PreviewField label="Father / Husband Name" value={formData.fatherName} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="Date of Birth" value={formData.dob} />
          <PreviewField label="Gender" value={formData.gender} />
        </div>

        <SectionLabel>Address</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="Full Address" value={formData.address} />
          <PreviewField label="PIN Code" value={formData.pin} />
        </div>

        <SectionLabel>KYC</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="Aadhaar" value={formData.aadhaar ? `XXXX XXXX ${formData.aadhaar.slice(-4)}` : ''} />
          <PreviewField label="PAN" value={formData.pan || 'Optional'} />
        </div>

        <SectionLabel>Nominee</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="Nominee Name" value={formData.nomineeName} />
          <PreviewField label="Relation" value={formData.nomineeRelation} />
        </div>

        <SectionLabel>Auto-Filled by System</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <PreviewField label="CSP Name" value="Rampur Banking Pt." />
          <PreviewField label="CSP Code" value="CSP-UP-0421" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <PreviewField label="Bank" value={bank} />
          <PreviewField label="Print Date" value={today} />
        </div>
      </div>
    </div>
  );
}