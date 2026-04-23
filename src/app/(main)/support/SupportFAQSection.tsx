import React, { useState } from "react";

const FAQS = [
  {
    q: "How long does wallet recharge take?",
    a:
      "Wallet recharge is usually approved within 30 minutes during business hours (9 AM – 6 PM). For off-hour requests, expect up to 2 hours.",
  },
  {
    q: "Can I reprint a passbook for free?",
    a:
      "Yes! You can reprint any passbook or form for free within 24 hours of the original print. After 24 hours, the standard charge applies.",
  },
  {
    q: "What if my print job fails mid-way?",
    a:
      "Your wallet is never charged unless the PDF is successfully generated. If generation fails, no money is deducted. Please try again or contact support.",
  },
  {
    q: "How do I add a new bank form template?",
    a:
      "Form templates are managed by admin. If you need a template for a specific bank not currently available, contact support and we'll add it.",
  },
];

export const SupportFAQSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Frequently Asked Questions</div>
      </div>
      <div
        className="card-body"
        style={{ padding: 0 }}
      >
        {FAQS.map((item, i) => (
          <div
            key={i}
            style={{
              borderBottom:
                i < FAQS.length - 1
                  ? "1px solid var(--border)"
                  : "none",
              padding: "14px 16px",
              cursor: "pointer",
            }}
            onClick={() => setExpandedIndex(prev => (prev === i ? null : i))}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {item.q}
            </div>
            {expandedIndex === i && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink3)",
                  marginTop: 4,
                }}
              >
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};