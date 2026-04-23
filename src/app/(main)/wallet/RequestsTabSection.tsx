import React from "react";

export interface RechargeRequest {
  id: string | number;
  date: string;
  amount: number;
  utr: string;
  method: "UPI" | "NEFT" | "IMPS" | "RTGS" | "Cash" | string;
  status: "Pending" | "Approved" | "Rejected";
  creditedAt?: string;
  rejectReason?: string;
}

interface Props {
  requests?: RechargeRequest[];
  loading?: boolean;
}

export const RequestsTabSection: React.FC<Props> = ({
  requests = [],
  loading = false,
}) => {
  const getBadgeClass = (status: RechargeRequest["status"]) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
      default:
        return "yellow";
    }
  };

  const getStatusText = (req: RechargeRequest) => {
    if (req.status === "Approved") return req.creditedAt || "Credited";
    if (req.status === "Rejected") return req.rejectReason || "Rejected by admin";
    return "Awaiting admin verification";
  };

  return (
    <div id="wt-requests">
      <div className="card">
        <div className="card-header">
          <div className="card-title">My Recharge Requests</div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>UTR / Reference</th>
                <th>Method</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--ink3)" }}>
                    Loading recharge requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--ink3)" }}>
                    No recharge requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td style={{ fontSize: 12 }}>{req.date}</td>

                    <td
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontWeight: 700,
                      }}
                    >
                      ₹{Number(req.amount || 0).toFixed(2)}
                    </td>

                    <td
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 11,
                        color: "var(--ink3)",
                      }}
                    >
                      {req.utr || "—"}
                    </td>

                    <td>{req.method || "—"}</td>

                    <td>
                      <span className={`badge ${getBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>

                    <td
                      style={{
                        fontSize: 12,
                        color:
                          req.status === "Rejected"
                            ? "var(--red)"
                            : req.status === "Approved"
                            ? "var(--ink3)"
                            : "var(--sky)",
                      }}
                    >
                      {getStatusText(req)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};