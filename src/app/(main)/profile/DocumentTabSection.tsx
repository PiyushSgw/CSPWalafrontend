"use client";

import React, { useMemo, useRef, useState } from "react";

interface ProfileLike {
  aadhaar_url?: string | null;
  pan_url?: string | null;
  csp_certificate_url?: string | null;
  outlet_photo_url?: string | null;
  bank_letter_url?: string | null;
}

interface DocumentItem {
  id: string;
  icon: string;
  name: string;
  meta: string;
  status: "Verified" | "Pending";
  isUploadable: boolean;
  file?: File | null;
}

interface DocumentTabSectionProps {
  profile: ProfileLike | null;
  loading: boolean;
  onUploadKYC: (files: {
    outlet_photo?: File;
    bank_letter?: File;
  }) => Promise<any>;
}

export const DocumentTabSection: React.FC<DocumentTabSectionProps> = ({
  profile,
  loading,
  onUploadKYC,
}) => {
  const outletRef = useRef<HTMLInputElement | null>(null);
  const bankRef = useRef<HTMLInputElement | null>(null);

  const [outletPhoto, setOutletPhoto] = useState<File | null>(null);
  const [bankLetter, setBankLetter] = useState<File | null>(null);

  const docs: DocumentItem[] = useMemo(
    () => [
      {
        id: "aadhaar",
        icon: "🪪",
        name: "Aadhaar Card",
        meta: profile?.aadhaar_url
          ? "Uploaded and verified from backend"
          : "Required KYC document not found",
        status: profile?.aadhaar_url ? "Verified" : "Pending",
        isUploadable: false,
      },
      {
        id: "pan",
        icon: "💳",
        name: "PAN Card",
        meta: profile?.pan_url
          ? "Uploaded and verified from backend"
          : "Required KYC document not found",
        status: profile?.pan_url ? "Verified" : "Pending",
        isUploadable: false,
      },
      {
        id: "csp",
        icon: "📜",
        name: "CSP Certificate",
        meta: profile?.csp_certificate_url
          ? "Uploaded and verified from backend"
          : "Required CSP document not found",
        status: profile?.csp_certificate_url ? "Verified" : "Pending",
        isUploadable: false,
      },
      {
        id: "outlet",
        icon: "📷",
        name: "CSP Outlet Photo",
        meta: outletPhoto
          ? `${outletPhoto.name} · ${(outletPhoto.size / 1024).toFixed(0)} KB selected`
          : profile?.outlet_photo_url
          ? "Already uploaded to backend"
          : "Optional — Photo of your banking outlet signboard",
        status: profile?.outlet_photo_url || outletPhoto ? "Verified" : "Pending",
        isUploadable: true,
        file: outletPhoto,
      },
      {
        id: "bank",
        icon: "📄",
        name: "Bank Letter / NOC",
        meta: bankLetter
          ? `${bankLetter.name} · ${(bankLetter.size / 1024).toFixed(0)} KB selected`
          : profile?.bank_letter_url
          ? "Already uploaded to backend"
          : "Optional — Authorization letter from bank",
        status: profile?.bank_letter_url || bankLetter ? "Verified" : "Pending",
        isUploadable: true,
        file: bankLetter,
      },
    ],
    [profile, outletPhoto, bankLetter]
  );

  const requiredVerifiedCount = docs.filter(
    doc =>
      ["aadhaar", "pan", "csp"].includes(doc.id) && doc.status === "Verified"
  ).length;

  return (
    <div id="pt-docs">
      <div className="two-col" style={{ gap: 20, alignItems: "start" }}>
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">Uploaded Documents</div>
            </div>

            <div className="card-body">
              {docs.map(doc => (
                <div
                  key={doc.id}
                  className="doc-row"
                  style={
                    doc.isUploadable && doc.status === "Pending"
                      ? {
                          border: "1.5px dashed var(--border2)",
                          background: "var(--bg)",
                        }
                      : {}
                  }
                >
                  <div className="doc-icon">{doc.icon}</div>

                  <div className="doc-info">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-meta">{doc.meta}</div>
                  </div>

                  {/* ✅ AUTO UPLOAD OUTLET */}
                  {doc.id === "outlet" && (
                    <>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => outletRef.current?.click()}
                        disabled={loading}
                      >
                        Upload
                      </button>
                      <input
                        ref={outletRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: "none" }}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setOutletPhoto(file);
                          await onUploadKYC({ outlet_photo: file }); // ✅ AUTO UPLOAD
                        }}
                      />
                    </>
                  )}

                  {/* ✅ AUTO UPLOAD BANK */}
                  {doc.id === "bank" && (
                    <>
                      <button
                        className="btn btn-outline btn-xs"
                        onClick={() => bankRef.current?.click()}
                        disabled={loading}
                      >
                        Upload
                      </button>
                      <input
                        ref={bankRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: "none" }}
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setBankLetter(file);
                          await onUploadKYC({ bank_letter: file }); // ✅ AUTO UPLOAD
                        }}
                      />
                    </>
                  )}

                  {!doc.isUploadable && (
                    <span
                      className={`badge ${
                        doc.status === "Verified" ? "green" : "amber"
                      }`}
                    >
                      {doc.status}
                    </span>
                  )}
                </div>
              ))}

              {/* ❌ BUTTON REMOVED COMPLETELY */}
            </div>
          </div>
        </div>

        <div className="alert-box success" style={{ margin: 0 }}>
          <div className="alert-icon">✅</div>
          <div className="alert-body">
            <strong>
              {requiredVerifiedCount === 3
                ? "All Required Documents Verified"
                : "Document Verification Pending"}
            </strong>{" "}
            {requiredVerifiedCount === 3
              ? "Your Aadhaar, PAN, and CSP Certificate have been verified by admin."
              : `Required verified documents: ${requiredVerifiedCount}/3 completed.`}
          </div>
        </div>
      </div>
    </div>
  );
};