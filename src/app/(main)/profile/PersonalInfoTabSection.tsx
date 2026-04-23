import React from "react";

type ProfileForm = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
};

interface PersonalInfoTabSectionProps {
  profile: any | null;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
  form?: ProfileForm;
  setForm?: React.Dispatch<React.SetStateAction<ProfileForm>>;
}

const defaultForm: ProfileForm = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  address: "",
};

export const PersonalInfoTabSection: React.FC<PersonalInfoTabSectionProps> = ({
  profile,
  error,
  onClearError,
  form = defaultForm,
  setForm,
}) => {
  const updateForm = (key: keyof ProfileForm, value: string) => {
    if (!setForm) return;
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div id="pt-personal">
      {error && (
        <div className="alert-box error" onClick={onClearError}>
          <div className="alert-body">{error}</div>
        </div>
      )}

      <div className="two-col" style={{ gap: 20, alignItems: "start" }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Personal Information</div>
          </div>

          <div className="card-body">
            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  value={form.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  value={form.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row cols-2">
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  className="form-input"
                  value={form.mobile}
                  onChange={(e) => updateForm("mobile", e.target.value)}
                />
                <div className="form-hint">✅ Verified · OTP sent for changes</div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={form.email}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Address</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">Account Summary</div>
            </div>

            <div className="card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink3)" }}>Account Status</span>
                  <span className="badge green">
                    {profile?.status === "approved" ? "Active" : "Pending"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink3)" }}>Member Since</span>
                  <span style={{ fontWeight: 600 }}>{profile?.member_since || "January 2024"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink3)" }}>Total Prints</span>
                  <span style={{ fontWeight: 700 }}>{profile?.total_prints || "1,847"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink3)" }}>Total Spend</span>
                  <span style={{ fontWeight: 700 }}>{profile?.total_spend || "₹12,430"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--ink3)" }}>Customers Added</span>
                  <span style={{ fontWeight: 700 }}>{profile?.customers_added || "63"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="alert-box success" style={{ margin: 0 }}>
            <div className="alert-icon">✅</div>
            <div className="alert-body">
              <strong>Verification Complete</strong>
              <div>All KYC documents verified. Your account is fully active.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};