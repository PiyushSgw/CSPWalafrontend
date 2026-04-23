import React, { useState } from "react";

interface LoginActivity {
  ip: string;
  location: string;
  device: string;
  time: string;
  status: 'success' | 'failed';
}

interface Props {
  loading: boolean;
  onChangePassword: (data: {
  currentPassword: string;
  newPassword: string;
}) => Promise<any>;
  onClearError: () => void;
  loginActivity: LoginActivity[];
}

export const SecurityTabSection: React.FC<Props> = ({
  loading,
  onChangePassword,
  onClearError,
  loginActivity = [],
}) => {
  const [form, setForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      await onChangePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  return (
    <div id="pt-security">
      <div className="two-col">
        {/* Password Change Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Change Password</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password (min 8 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  minLength={8}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-teal btn-sm"
                disabled={loading}
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Login Activity */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Login Activity</div>
          </div>
          <div className="card-body">
            {loginActivity.length === 0 ? (
              <div className="empty-state">
                <span>🔐</span>
                <p>No login activity recorded</p>
              </div>
            ) : (
              <div className="activity-list">
                {loginActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className={`activity-item ${activity.status}`}>
                    <div className="activity-info">
                      <div className="activity-device">{activity.device}</div>
                      <div className="activity-location">
                        {activity.location} ({activity.ip})
                      </div>
                    </div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};