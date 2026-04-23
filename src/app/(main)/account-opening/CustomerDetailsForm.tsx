'use client';

interface FormData {
  fullName: string;
  fatherName: string;
  dob: string;
  gender: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  aadhaar: string;
  pan: string;
  occupation: string;
  income: string;
  nomineeName: string;
  nomineeRelation: string;
  nomineeDob: string;
  nomineeMobile: string;
}

interface Props {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

const inputClass = "w-full px-3 py-[9px] border-[1.5px] border-gray-300 rounded-lg text-[13px] text-gray-800 bg-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 transition-all";
const labelClass = "text-[12px] font-semibold text-gray-700";
const sectionClass = "text-[11px] font-bold text-[#0f2744] uppercase tracking-[0.8px] border-l-[3px] border-[#0f2744] pl-2 mb-3 mt-1";

export default function CustomerDetailsForm({ formData, onChange }: Props) {
  return (
    <div className="space-y-4">

      {/* Personal Details */}
      <div className={sectionClass}>Personal Details</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Full Name (as per Aadhaar) <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="e.g. Ramesh Kumar Sharma"
            value={formData.fullName} onChange={(e) => onChange('fullName', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Father / Husband Name <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="Father or husband's name"
            value={formData.fatherName} onChange={(e) => onChange('fatherName', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
          <input type="date" className={inputClass}
            value={formData.dob} onChange={(e) => onChange('dob', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Gender <span className="text-red-500">*</span></label>
          <select className={inputClass} value={formData.gender} onChange={(e) => onChange('gender', e.target.value)}>
            <option value="">Select</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
          <input type="tel" className={inputClass} placeholder="10-digit mobile"
            value={formData.mobile} onChange={(e) => onChange('mobile', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Email Address</label>
          <input type="email" className={inputClass} placeholder="Optional"
            value={formData.email} onChange={(e) => onChange('email', e.target.value)} />
        </div>
      </div>

      {/* Address */}
      <hr className="border-gray-200 my-2" />
      <div className={sectionClass}>Address Details</div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Full Address <span className="text-red-500">*</span></label>
        <textarea className={`${inputClass} resize-none min-h-[72px]`} rows={2}
          placeholder="House no., street, village/locality"
          value={formData.address} onChange={(e) => onChange('address', e.target.value)} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>City / Town <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="City"
            value={formData.city} onChange={(e) => onChange('city', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>State <span className="text-red-500">*</span></label>
          <select className={inputClass} value={formData.state} onChange={(e) => onChange('state', e.target.value)}>
            <option>Uttar Pradesh</option><option>Bihar</option>
            <option>Madhya Pradesh</option><option>Rajasthan</option><option>Maharashtra</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>PIN Code <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="6-digit PIN"
            value={formData.pin} onChange={(e) => onChange('pin', e.target.value)} />
        </div>
      </div>

      {/* KYC */}
      <hr className="border-gray-200 my-2" />
      <div className={sectionClass}>KYC & Identity</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Aadhaar Number <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="XXXX XXXX XXXX"
            value={formData.aadhaar} onChange={(e) => onChange('aadhaar', e.target.value)} />
          <p className="text-[11px] text-gray-400">Will be masked in print: XXXX XXXX 1234</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>PAN Number</label>
          <input className={inputClass} placeholder="AAAAA1234A (optional)"
            value={formData.pan} onChange={(e) => onChange('pan', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Occupation</label>
          <select className={inputClass} value={formData.occupation} onChange={(e) => onChange('occupation', e.target.value)}>
            <option value="">Select</option>
            <option>Farmer</option><option>Business</option><option>Service / Job</option>
            <option>Housewife</option><option>Student</option><option>Labour / Daily Wage</option><option>Other</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Annual Income Range</label>
          <select className={inputClass} value={formData.income} onChange={(e) => onChange('income', e.target.value)}>
            <option value="">Select</option>
            <option>Below ₹1 Lakh</option><option>₹1–3 Lakh</option>
            <option>₹3–5 Lakh</option><option>Above ₹5 Lakh</option>
          </select>
        </div>
      </div>

      {/* Nominee */}
      <hr className="border-gray-200 my-2" />
      <div className={sectionClass}>Nominee Details</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Name <span className="text-red-500">*</span></label>
          <input className={inputClass} placeholder="Full name of nominee"
            value={formData.nomineeName} onChange={(e) => onChange('nomineeName', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Relation <span className="text-red-500">*</span></label>
          <select className={inputClass} value={formData.nomineeRelation} onChange={(e) => onChange('nomineeRelation', e.target.value)}>
            <option value="">Select</option>
            <option>Wife</option><option>Husband</option><option>Son</option><option>Daughter</option>
            <option>Father</option><option>Mother</option><option>Brother</option><option>Sister</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Date of Birth</label>
          <input type="date" className={inputClass}
            value={formData.nomineeDob} onChange={(e) => onChange('nomineeDob', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Mobile</label>
          <input type="tel" className={inputClass} placeholder="Optional"
            value={formData.nomineeMobile} onChange={(e) => onChange('nomineeMobile', e.target.value)} />
        </div>
      </div>

      {/* Photo & Signature */}
      <hr className="border-gray-200 my-2" />
      <div className={sectionClass}>Photo & Signature</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Customer Photo</label>
          <input type="file" accept="image/*" className={inputClass} />
          <p className="text-[11px] text-gray-400">Passport size · JPG/PNG · max 1MB</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Customer Signature</label>
          <input type="file" accept="image/*" className={inputClass} />
          <p className="text-[11px] text-gray-400">Scanned signature image · max 1MB</p>
        </div>
      </div>

    </div>
  );
}