import React, { useState, useEffect } from "react";

export const CspBankSetupTabSection: React.FC<{
  profile: any | null;
  dashboard: any | null;
  loading: boolean;
  onUpdateBank: (data: any) => Promise<any>;
}> = ({ profile, dashboard, loading, onUpdateBank }) => {
  const [form, setForm] = useState({
    outletName: '',
    cspCode: '',
    primaryBank: '',
    branch: '',
    ifsc: '',
    agentCode: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        outletName: profile.outlet_name || '',
        cspCode: profile.csp_code || '',
        primaryBank: profile.bank_name || '',
        branch: profile.branch_name || '',
        ifsc: profile.ifsc || '',
        agentCode: profile.agent_code || '',
        address: profile.location || ''
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onUpdateBank(form);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !profile) {
    return <div className="card"><div className="skeleton">Loading CSP setup...</div></div>;
  }

  return (
    <div id="pt-csp">
      <div className="card">
        <div className="card-header">
          <div className="card-title">CSP & Bank Configuration</div>
          <span className="badge amber">Admin must approve changes</span>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label>Outlet Name</label>
              <input
                className="form-input"
                value={form.outletName}
                onChange={(e) => setForm({ ...form, outletName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>CSP Code</label>
              <input
                className="form-input"
                value={form.cspCode}
                readOnly
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Primary Bank</label>
              <input
                className="form-input"
                value={form.primaryBank}
                onChange={(e) => setForm({ ...form, primaryBank: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Branch</label>
              <input
                className="form-input"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                className="form-input"
                value={form.ifsc}
                onChange={(e) => setForm({ ...form, ifsc: e.target.value.toUpperCase() })}
              />
            </div>
            <div className="form-group">
              <label>Agent Code</label>
              <input
                className="form-input"
                value={form.agentCode}
                onChange={(e) => setForm({ ...form, agentCode: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Business Address</label>
            <textarea
              className="form-input"
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Enter complete business address"
            />
          </div>

          {dashboard && (
            <div className="form-hint">
              💰 Current Wallet: ₹{dashboard.wallet_balance?.toLocaleString() || '0'}
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-teal"
              onClick={handleSubmit}
              disabled={saving || loading}
            >
              {saving ? "Saving..." : "Save Bank Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};