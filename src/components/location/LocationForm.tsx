"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchStates,
  fetchDistricts,
  fetchTalukas,
  clearDistricts,
  clearTalukas,
} from "@/redux/slices/locationSlice";
import SearchableDropdown from "./SearchableDropdown";

export interface LocationFormValue {
  state: string;
  district: string;
  subDistrict: string;
  villageCity: string;
  pinCode: string;
  fullAddress: string;
}

interface LocationFormProps {
  value: LocationFormValue;
  onChange: (value: LocationFormValue) => void;
  showAddressField?: boolean;
  required?: boolean;
}

export default function LocationForm({
  value,
  onChange,
  showAddressField = true,
  required = true,
}: LocationFormProps) {
  const dispatch = useAppDispatch();
  const {
    states,
    districts,
    talukas,
    loading: loadingStates,
    loadingDistricts,
    loadingTalukas,
    error,
  } = useAppSelector((s) => s.location);

  useEffect(() => {
    if (states.length === 0) {
      dispatch(fetchStates());
    }
  }, [dispatch, states.length]);

  const update = useCallback(
    (patch: Partial<LocationFormValue>) => {
      onChange({ ...value, ...patch });
    },
    [value, onChange],
  );

  const handleStateChange = useCallback(
    (state: string) => {
      update({ state, district: "", subDistrict: "" });
      if (state) {
        dispatch(fetchDistricts(state));
      } else {
        dispatch(clearDistricts());
      }
    },
    [update, dispatch],
  );

  const handleDistrictChange = useCallback(
    (district: string) => {
      update({ district, subDistrict: "" });
      if (district && value.state) {
        dispatch(fetchTalukas({ state: value.state, district }));
      } else {
        dispatch(clearTalukas());
      }
    },
    [update, dispatch, value.state],
  );

  return (
    <div className="loc-form">
      <style>{`
        .loc-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .loc-form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .loc-form-input,
        .loc-form-textarea {
          width: 100%;
          padding: 9px 11px;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
          color: #111827;
          background: #ffffff;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
        }
        .loc-form-input:focus,
        .loc-form-textarea:focus {
          border-color: #0d8f72;
          box-shadow: 0 0 0 3px rgba(13,143,114,0.1);
        }
        .loc-form-textarea {
          min-height: 60px;
          resize: vertical;
        }
        .loc-form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .loc-form-label {
          font-size: 11px;
          font-weight: 600;
          color: #0f172a;
          letter-spacing: 0.5px;
          font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif;
        }
        .loc-form-label .hi {
          text-transform: none;
          font-weight: 600;
          color: #0f172a;
          font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif;
        }
        .loc-form-label .req { color: #dc2626; margin-left: 2px; }
        .loc-form-error {
          font-size: 11px;
          font-weight: 600;
          color: #dc2626;
          padding: 8px 12px;
          background: #fef2f2;
          border-radius: 6px;
        }
        @media (max-width: 640px) {
          .loc-form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {error && <div className="loc-form-error">{error}</div>}

      {/* Row 1: State */}
      <SearchableDropdown
        label={<> <span className="hi"> राज्य / केंद्र शासितप्रदेश</span></>}
        placeholder="Select State or UT..."
        options={states.map((s) => s.name)}
        value={value.state}
        onChange={handleStateChange}
        required={required}
        loading={loadingStates}
        allowCustom
      />

      {/* Row 2: District + Taluka */}
      <div className="loc-form-grid-2">
        <SearchableDropdown
          label={<> <span className="hi"> जिला</span></>}
          placeholder={value.state ? "Select District..." : "Select State first"}
          options={districts.map((d) => d.name)}
          value={value.district}
          onChange={handleDistrictChange}
          required={required}
          disabled={!value.state}
          loading={loadingDistricts}
          allowCustom
        />

        <SearchableDropdown
          label={<>  <span className="hi"> तालुका / तहसील / उप-जिला</span></>}
          placeholder={
            value.district ? "Select Taluka..." : "Select District first"
          }
          options={talukas.map((t) => t.name)}
          value={value.subDistrict}
          onChange={(subDistrict) => update({ subDistrict })}
          required={required}
          disabled={!value.district}
          loading={loadingTalukas}
          allowCustom
        />
      </div>

      {/* Row 3: Village/City + PIN */}
      <div className="loc-form-grid-2">
        <div className="loc-form-group">
          <label className="loc-form-label">
           <span className="hi"> गाँव / शहर का नाम</span> {required && <span className="req">*</span>}
          </label>
          <input
            className="loc-form-input"
            type="text"
            placeholder="Enter Village or City name"
            value={value.villageCity}
            onChange={(e) => update({ villageCity: e.target.value })}
            maxLength={50}
          />
        </div>

        <div className="loc-form-group">
          <label className="loc-form-label">
            <span className="hi"> पिन कोड</span> {required && <span className="req">*</span>}
          </label>
          <input
            className="loc-form-input"
            type="text"
            placeholder="6-digit PIN code"
            value={value.pinCode}
            onChange={(e) =>
              update({
                pinCode: e.target.value.replace(/\D/g, "").slice(0, 6),
              })
            }
            maxLength={6}
            inputMode="numeric"
          />
        </div>
      </div>

      {/* Row 4: Full Address / Landmark */}
      {showAddressField && (
        <div className="loc-form-group">
          <label className="loc-form-label">
             <span className="hi"> पूरा पता / लैंडमार्क</span> {required && <span className="req">*</span>}
          </label>
          <textarea
            className="loc-form-textarea"
            placeholder="Enter full address with landmark details"
            value={value.fullAddress}
            onChange={(e) => update({ fullAddress: e.target.value })}
            maxLength={200}
          />
        </div>
      )}
    </div>
  );
}
