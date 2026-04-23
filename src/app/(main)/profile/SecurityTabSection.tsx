import React, { useState } from "react";

interface LoginActivity {
  ip: string;
  location: string;
  device: string;
  time: string;
  status: "success" | "failed";
}

interface Props {
  loading: boolean;
  onChange_Password: (data: {
    current_Password: string;
    new_Password: string;
  }) => Promise<any>;
  onClearError: () => void;
  loginActivity: LoginActivity[];
}

export const SecurityTabSection: React.FC<Props> = ({
  loading,
  onChange_Password,
  onClearError,
  loginActivity = [],
}) => {
  // ✅ FIXED STATE (snake_case everywhere)
  const [form, setForm] = useState({
    current_Password: "",
    new_Password: "",
    confirm_Password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (form.new_Password !== form.confirm_Password) {
      alert("Passwords do not match");
      return;
    }

    if (form.new_Password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    try {
      await onChange_Password({
        current_Password: form.current_Password,
        new_Password: form.new_Password,
      });

      // ✅ reset form
      setForm({
        current_Password: "",
        new_Password: "",
        confirm_Password: "",
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
                  value={form.current_Password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      current_Password: e.target.value,
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
                  value={form.new_Password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      new_Password: e.target.value,
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
                  value={form.confirm_Password}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      confirm_Password: e.target.value,
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
                {loading ? "Changing..." : "Change_Password"}
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