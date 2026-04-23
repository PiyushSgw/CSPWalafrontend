'use client';

import { ChangeEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCustomers } from '@/redux/slices/customersSlice';
import {
  updateFormField,
  setCustomerId,
  setCustomerLookupStatus,
  resetCustomerLookup,
} from '@/redux/slices/accountOpeningSlice';

const occupations = [
  'Business',
  'Service',
  'Farmer',
  'Student',
  'Housewife',
  'Self Employed',
  'Retired',
  'Other',
];

const incomeRanges = [
  'Below 1 Lakh',
  '1-3 Lakh',
  '3-5 Lakh',
  '5-10 Lakh',
  '10+ Lakh',
];

const inputClass =
  'w-full px-3 py-[9px] border-[1.5px] border-gray-300 rounded-lg text-[13px] text-gray-800 bg-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 transition-all';

const inputErrorClass =
  'w-full px-3 py-[9px] border-[1.5px] border-red-400 rounded-lg text-[13px] text-gray-800 bg-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all';

const labelClass = 'text-[12px] font-semibold text-gray-700';
const sectionClass =
  'text-[11px] font-bold text-[#0f2744] uppercase tracking-[0.8px] border-l-[3px] border-[#0f2744] pl-2 mb-3 mt-1';

const normalizeMobile = (value: string | number | null | undefined) => {
  if (!value) return '';
  return String(value).replace(/\D/g, '').slice(-10);
};

type Customer = {
  id: number | string;
  full_name?: string;
  father_name?: string;
  dob?: string;
  gender?: string;
  mobile?: string | number;
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
  photo_url?: string;
  signature_url?: string;
};

export default function CustomerDetailsForm() {
  const dispatch = useAppDispatch();

  const formData = useAppSelector((state) => state.accountOpening.formData);
  const customerNotFound = useAppSelector(
    (state) => state.accountOpening.customerNotFound
  );

  const customers = useAppSelector((state) => state.customers.list as Customer[]);
  const customersLoading = useAppSelector((state) => state.customers.loading);
  const customersError = useAppSelector((state) => state.customers.error);

  useEffect(() => {
    if (!customers.length) {
      dispatch(fetchCustomers({ page: 1, limit: 1000 }));
    }
  }, [dispatch, customers.length]);

  useEffect(() => {
    return () => {
      if (formData.photo_url?.startsWith('blob:')) {
        URL.revokeObjectURL(formData.photo_url);
      }
      if (formData.signature_url?.startsWith('blob:')) {
        URL.revokeObjectURL(formData.signature_url);
      }
    };
  }, []);

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    dispatch(updateFormField({ field, value }));
  };

  const fillCustomerData = (customer: Customer) => {
    dispatch(setCustomerId(customer.id as number));

    const mappedFields: Partial<typeof formData> = {
      customer_id: customer.id as number,
      full_name: customer.full_name ?? '',
      father_name: customer.father_name ?? '',
      dob: customer.dob ?? '',
      gender: customer.gender ?? '',
      mobile: normalizeMobile(customer.mobile),
      email: customer.email ?? '',
      address: customer.address ?? '',
      city: customer.city ?? '',
      state: customer.state ?? '',
      pin: customer.pin ?? '',
      aadhaar: customer.aadhaar ?? '',
      pan: customer.pan ?? '',
      occupation: customer.occupation ?? '',
      income: customer.income ?? '',
      nominee_name: customer.nominee_name ?? '',
      nominee_relation: customer.nominee_relation ?? '',
      nominee_dob: customer.nominee_dob ?? '',
      nominee_mobile: customer.nominee_mobile ?? '',
      photo_url: customer.photo_url ?? '',
      signature_url: customer.signature_url ?? '',
    };

    Object.entries(mappedFields).forEach(([field, value]) => {
      dispatch(
        updateFormField({
          field: field as keyof typeof formData,
          value: value as (typeof formData)[keyof typeof formData],
        })
      );
    });

    dispatch(setCustomerLookupStatus(false));
  };

  const handleMobileChange = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, 10);
    dispatch(updateFormField({ field: 'mobile', value: onlyDigits }));
    dispatch(updateFormField({ field: 'customer_id', value: null }));
    dispatch(resetCustomerLookup());
  };

  const handleMobileBlur = () => {
    const inputMobile = normalizeMobile(formData.mobile);

    if (inputMobile.length !== 10) {
      dispatch(setCustomerId(null));
      dispatch(setCustomerLookupStatus(true));
      return;
    }

    const matchedCustomer = customers.find(
      (customer) => normalizeMobile(customer.mobile) === inputMobile
    );

    if (matchedCustomer) {
      fillCustomerData(matchedCustomer);
    } else {
      dispatch(setCustomerId(null));
      dispatch(updateFormField({ field: 'customer_id', value: null }));
      dispatch(setCustomerLookupStatus(true));
    }
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: 'photo_url' | 'signature_url'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const currentUrl = formData[field];
    if (currentUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    dispatch(updateFormField({ field, value: previewUrl }));
    e.target.value = '';
  };

  return (
    <div className="space-y-4 pb-6">
      <div className={sectionClass}>Personal Details</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Father / Husband Name <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            value={formData.father_name}
            onChange={(e) => handleChange('father_name', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className={inputClass}
            value={formData.dob}
            onChange={(e) => handleChange('dob', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            className={inputClass}
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={customerNotFound ? inputErrorClass : inputClass}
            value={formData.mobile}
            onChange={(e) => handleMobileChange(e.target.value)}
            onBlur={handleMobileBlur}
            maxLength={10}
          />
          {customerNotFound && (
            <p className="text-[11px] font-medium text-red-500">
              Customer not found. Please register first.
            </p>
          )}
          {customersLoading && (
            <p className="text-[11px] text-gray-400">Loading customer list...</p>
          )}
          {customersError && (
            <p className="text-[11px] text-red-500">{customersError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <hr className="my-2 border-gray-200" />
      <div className={sectionClass}>Address Details</div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`${inputClass} min-h-[72px] resize-none`}
          rows={2}
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>City</label>
          <input
            className={inputClass}
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>State</label>
          <input
            className={inputClass}
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>PIN Code</label>
          <input
            className={inputClass}
            value={formData.pin}
            onChange={(e) => handleChange('pin', e.target.value)}
          />
        </div>
      </div>

      <hr className="my-2 border-gray-200" />
      <div className={sectionClass}>KYC & Identity</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Aadhaar Number</label>
          <input
            className={inputClass}
            value={formData.aadhaar}
            onChange={(e) => handleChange('aadhaar', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>PAN Number</label>
          <input
            className={inputClass}
            value={formData.pan}
            onChange={(e) => handleChange('pan', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Occupation</label>
          <select
            className={inputClass}
            value={formData.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
          >
            <option value="">Select occupation</option>
            {occupations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Income</label>
          <select
            className={inputClass}
            value={formData.income}
            onChange={(e) => handleChange('income', e.target.value)}
          >
            <option value="">Select income</option>
            {incomeRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr className="my-2 border-gray-200" />
      <div className={sectionClass}>Nominee Details</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Name</label>
          <input
            className={inputClass}
            value={formData.nominee_name}
            onChange={(e) => handleChange('nominee_name', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Relation</label>
          <input
            className={inputClass}
            value={formData.nominee_relation}
            onChange={(e) => handleChange('nominee_relation', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee DOB</label>
          <input
            type="date"
            className={inputClass}
            value={formData.nominee_dob}
            onChange={(e) => handleChange('nominee_dob', e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Nominee Mobile</label>
          <input
            className={inputClass}
            value={formData.nominee_mobile}
            onChange={(e) => handleChange('nominee_mobile', e.target.value)}
          />
        </div>
      </div>

      <hr className="my-2 border-gray-200" />
      <div className={sectionClass}>Photo & Signature</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Photo</label>
          <input
            type="file"
            accept="image/*"
            className={inputClass}
            onChange={(e) => handleImageChange(e, 'photo_url')}
          />
          {formData.photo_url && (
            <img
              src={formData.photo_url}
              alt="Customer photo"
              className="mt-2 h-24 w-24 rounded-lg border border-gray-200 object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Signature</label>
          <input
            type="file"
            accept="image/*"
            className={inputClass}
            onChange={(e) => handleImageChange(e, 'signature_url')}
          />
          {formData.signature_url && (
            <img
              src={formData.signature_url}
              alt="Customer signature"
              className="mt-2 h-24 w-24 rounded-lg border border-gray-200 object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}