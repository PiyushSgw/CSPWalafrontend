import React from "react";

type BankForm = {
  outletName: string;
  cspCode: string;
  primaryBank: string;
  branch: string;
  ifsc: string;
  agentCode: string;
  address: string;
};

interface Props {
  profile: any | null;
  dashboard: any | null;
  loading: boolean;
  form: BankForm;
  setForm: React.Dispatch<React.SetStateAction<BankForm>>;
}

export const CspBankSetupTabSection: React.FC<Props> = ({
  dashboard,
  loading,
  form,
  setForm,
}) => {
  if (loading && !form.cspCode) {
    return (
      <div className="card">
        <div className="skeleton">Loading CSP setup...</div>
      </div>
    );
  }

  return (
    <div id="pt-csp">
      <div className="card">
        <div className="card-header">
          <div className="card-title">CSP & Bank Configuration</div>
          <span className="badge amber">Admin must approve changes</span>
        </div>

        <div className="card-body">
          <div className="form-row cols-2">
            <div className="form-group">
              <label className="form-label">CSP Outlet Name</label>
              <input
                className="form-input"
                value={form.outletName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, outletName: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                CSP Code <span style={{ color: "red" }}>*</span>
              </label>
              <input className="form-input" value={form.cspCode} readOnly />
              <div className="form-hint">🔒 Cannot be changed after verification</div>
            </div>
          </div>

          <div className="form-row cols-2">
            <div className="form-group">
              <label className="form-label">Primary Bank</label>
              <input
                className="form-input"
                value={form.primaryBank}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, primaryBank: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bank Branch</label>
              <input
                className="form-input"
                value={form.branch}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, branch: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-row cols-2">
            <div className="form-group">
              <label className="form-label">IFSC Code</label>
              <input
                className="form-input"
                value={form.ifsc}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ifsc: e.target.value.toUpperCase() }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">BC / Agent Code</label>
              <input
                className="form-input"
                value={form.agentCode}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, agentCode: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CSP Physical Address</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          <div className="alert-box warning" style={{ marginTop: 16 }}>
            <div className="alert-body">
              ⚠️ Changes to bank/branch details require re-verification by admin. Existing print jobs are not affected.
            </div>
          </div>

          {dashboard && (
            <div className="form-hint" style={{ marginTop: 12 }}>
              💰 Current Wallet: ₹{dashboard.wallet_balance?.toLocaleString() || "0"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};