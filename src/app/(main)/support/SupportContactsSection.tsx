import React, { useState } from "react";

type IssueType =
  | "Wallet / Payment Issue"
  | "Print Job Failed"
  | "Account Verification"
  | "Technical Problem"
  | "Other";

interface TicketForm {
  type: IssueType;
  subject: string;
  description: string;
}

const ContactCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  time: string;
  color: string;
}> = ({ icon, title, desc, time, color }) => {
  return (
    <div className="qa-card" style={{ cursor: "default" }}>
      <span className="qa-icon">{icon}</span>
      <div className="qa-title">{title}</div>
      <div className="qa-desc">{desc}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color,
          fontWeight: 600,
        }}
      >
        {time}
      </div>
    </div>
  );
};

const SUPPORT_CONTACTS = [
  {
    icon: "📞",
    title: "Phone Support",
    desc: "+91 98XXXXXX00",
    time: "Mon–Sat 9AM–6PM",
    color: "var(--green)",
  },
  {
    icon: "💬",
    title: "WhatsApp",
    desc: "+91 98XXXXXX00",
    time: "Quick response",
    color: "var(--green)",
  },
  {
    icon: "📧",
    title: "Email Support",
    desc: "support@cspwala.in",
    time: "24h response",
    color: "var(--ink3)",
  },
];

export const SupportContactsSection: React.FC = () => {
  const [form, setForm] = useState<TicketForm>({
    type: "Other",
    subject: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value } as TicketForm));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.alert("Support ticket submitted! We will contact you within 2 hours.");
  };

  return (
    <div
      className="card"
      style={{ margin: 0 }}
    >
      <div className="card-header">
        <div className="card-title">Submit a Support Ticket</div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div
            className="form-group"
            style={{ marginBottom: 14 }}
          >
            <label className="form-label">Issue Type</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Wallet / Payment Issue</option>
              <option>Print Job Failed</option>
              <option>Account Verification</option>
              <option>Technical Problem</option>
              <option>Other</option>
            </select>
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 14 }}
          >
            <label className="form-label">Subject</label>
            <input
              className="form-input"
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief description of issue"
            />
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 16 }}
          >
            <label className="form-label">Detailed Description</label>
            <textarea
              className="form-textarea"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your issue in detail..."
            />
          </div>
          <button
            className="btn btn-teal"
            type="submit"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
};