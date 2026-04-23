import React from "react";

interface Props {
  showDatePopup: boolean;
  setShowDatePopup: (value: boolean) => void;
  startDate: string;
  endDate: string;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  onApplyDateFilter: () => void;
  onClearDateFilter: () => void;
}

export const PageHeaderSection: React.FC<Props> = ({
  showDatePopup,
  setShowDatePopup,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onApplyDateFilter,
  onClearDateFilter,
}) => {
  return (
    <div className="page-header" style={{ position: "relative" }}>
      <div className="page-header-left">
        <div className="page-title">🗂️ Print History</div>
        <div className="page-sub">
          Complete log of all print jobs — passbooks and account forms
        </div>
      </div>

      <div className="page-header-actions">
        <button
          className="btn btn-outline btn-sm"
          type="button"
          onClick={() => setShowDatePopup(!showDatePopup)}
        >
          📅 Filter by Date
        </button>

        <button className="btn btn-outline btn-sm" type="button">
          ⬇️ Export CSV
        </button>
      </div>

      {showDatePopup && (
        <>
          <div
            onClick={() => setShowDatePopup(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.12)",
              zIndex: 999,
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 320,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              padding: 16,
              zIndex: 1000,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 12,
                color: "#111827",
              }}
            >
              Filter by Date Range
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  Starting Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "#374151",
                  }}
                >
                  Ending Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: "100%",
                    height: 40,
                    border: "1px solid #d1d5db",
                    borderRadius: 10,
                    padding: "0 12px",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={onClearDateFilter}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={onApplyDateFilter}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};