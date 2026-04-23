import React from "react";

interface PageHeaderSectionProps {
  onSave: () => void;
  onChangePassword?: () => void;
  saving?: boolean;
  loading?: boolean;
}

export const PageHeaderSection: React.FC<PageHeaderSectionProps> = ({
  onSave,
  onChangePassword,
  saving,
  loading,
}) => {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-title">👤 My Profile</div>
        <div className="page-sub">
          Manage your CSP account details, bank setup, and documents
        </div>
      </div>

      <div className="page-header-actions">
        <button
          className="btn btn-outline btn-sm"
          onClick={onChangePassword}
          type="button"
        >
          🔑 Change Password
        </button>

        <button
          className="btn btn-teal btn-sm"
          onClick={onSave}
          disabled={saving || loading}
          type="button"
        >
          💾 {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};